import { Request, Response } from "express";
import { pool } from "../db";

export const getTopProducts = async (req: Request, res: Response) => {
  try {
    const { channel, dayOfWeek, startHour, endHour, limit } = req.query;

    const daysMap: Record<string, number> = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };

    const dayNum = dayOfWeek ? daysMap[String(dayOfWeek).toLowerCase()] : null;

    const query = `
      SELECT 
        p.name AS product_name,
        SUM(ps.quantity) AS total_sold,
        ROUND(SUM(ps.total_price)::numeric, 2) AS total_value
      FROM product_sales ps
      JOIN sales s ON ps.sale_id = s.id
      JOIN products p ON ps.product_id = p.id
      JOIN channels c ON s.channel_id = c.id
      WHERE 
        ($1::text IS NULL OR LOWER(c.name) = LOWER($1))
        AND ($2::int IS NULL OR EXTRACT(DOW FROM s.created_at) = $2)
        AND ($3::int IS NULL OR EXTRACT(HOUR FROM s.created_at) BETWEEN $3 AND $4)
      GROUP BY p.name
      ORDER BY total_sold DESC
      LIMIT COALESCE($5::int, 10);
    `;

    const values = [
      channel || null,
      dayNum,
      startHour || null,
      endHour || null,
      limit || 10,
    ];

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar produtos mais vendidos" });
  }
};

export const getDeliveryPerformance = async (req: Request, res: Response) => {
  try {
    const { channel, startCurrent, endCurrent, startPrevious, endPrevious } =
      req.query;

    const query = `
      WITH current_period AS (
        SELECT 
          da.city,
          ROUND(AVG(s.delivery_seconds)::numeric / 60, 2) AS current_avg_delivery
        FROM sales s
        JOIN delivery_addresses da ON s.id = da.sale_id
        JOIN channels c ON s.channel_id = c.id
        WHERE 
          ($1::text IS NULL OR LOWER(c.name) = LOWER($1))
          AND s.created_at BETWEEN $2::timestamp AND $3::timestamp
        GROUP BY da.city
      ),
      previous_period AS (
        SELECT 
          da.city,
          ROUND(AVG(s.delivery_seconds)::numeric / 60, 2) AS previous_avg_delivery
        FROM sales s
        JOIN delivery_addresses da ON s.id = da.sale_id
        JOIN channels c ON s.channel_id = c.id
        WHERE 
          ($1::text IS NULL OR LOWER(c.name) = LOWER($1))
          AND s.created_at BETWEEN $4::timestamp AND $5::timestamp
        GROUP BY da.city
      )
      SELECT 
        COALESCE(cp.city, pp.city) AS city,
        cp.current_avg_delivery,
        pp.previous_avg_delivery,
        ROUND((cp.current_avg_delivery - pp.previous_avg_delivery)::numeric, 2) AS variation
      FROM current_period cp
      FULL OUTER JOIN previous_period pp ON cp.city = pp.city
      ORDER BY variation DESC NULLS LAST;
    `;

    const values = [
      channel || null,
      startCurrent,
      endCurrent,
      startPrevious,
      endPrevious,
    ];
    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Erro ao comparar performance de entrega" });
  }
};

export const getRecurringCustomers = async (req: Request, res: Response) => {
  try {
    const { minPurchases, daysInactive } = req.query;

    const result = await pool.query(
      `
      SELECT 
        c.customer_name,
        COUNT(s.id) AS total_orders,
        MAX(s.created_at) AS last_order
      FROM sales s
      JOIN customers c ON s.customer_id = c.id
      GROUP BY c.customer_name
      HAVING 
        COUNT(s.id) >= $1
        AND MAX(s.created_at) < (CURRENT_DATE - ($2 || ' days')::interval)
      ORDER BY last_order ASC;
      `,
      [minPurchases || 3, daysInactive || 30]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Erro ao buscar clientes recorrentes inativos" });
  }
};

export const comparePeriods = async (req: Request, res: Response) => {
  try {
    const { filters, metrics, dimensions } = req.body;

    if (!filters || !metrics?.length || !dimensions?.length) {
      return res.status(400).json({ error: "Parâmetros insuficientes" });
    }

    const { startDate, endDate, compareStart, compareEnd } = filters;

    // 🔹 Mapeia as métricas para colunas reais
    const metricSQL = metrics
      .map((m: string) => {
        switch (m) {
          case "total_sales":
            return "SUM(s.total_amount) AS total_sales";
          case "orders":
            return "COUNT(s.id) AS orders";
          case "avg_ticket":
            return "AVG(s.total_amount) AS avg_ticket";
          case "avg_delivery_minutes":
            return "AVG(s.delivery_seconds)/60 AS avg_delivery_minutes";
          default:
            return "";
        }
      })
      .filter(Boolean)
      .join(", ");

    // 🔹 Mapeia as dimensões para colunas reais
    const dimensionSQL = dimensions
      .map((d: string) => {
        switch (d) {
          case "channel":
            return "c.name AS channel";
          case "store":
            return "st.name AS store";
          case "city":
            return "da.city AS city";
          case "product":
            return "p.name AS product";
          case "dow":
            return "EXTRACT(DOW FROM s.created_at) AS dow";
          case "hour":
            return "EXTRACT(HOUR FROM s.created_at) AS hour";
          default:
            return "";
        }
      })
      .filter(Boolean)
      .join(", ");

    // 🔹 Query base
    const queryBase = `
      SELECT ${dimensionSQL}, ${metricSQL}
      FROM sales s
      LEFT JOIN channels c ON c.id = s.channel_id
      LEFT JOIN stores st ON st.id = s.store_id
      LEFT JOIN product_sales ps ON ps.sale_id = s.id
      LEFT JOIN products p ON p.id = ps.product_id
      LEFT JOIN delivery_addresses da ON da.sale_id = s.id
      WHERE s.created_at BETWEEN $1 AND $2
      GROUP BY ${dimensions
        .map((d: string) => {
          switch (d) {
            case "channel":
              return "c.name";
            case "store":
              return "st.name";
            case "city":
              return "da.city";
            case "product":
              return "p.name";
            case "dow":
              return "EXTRACT(DOW FROM s.created_at)";
            case "hour":
              return "EXTRACT(HOUR FROM s.created_at)";
            default:
              return "";
          }
        })
        .filter(Boolean)
        .join(", ")}
    `;

    // 🔹 Executa consultas dos dois períodos
    const currentData = (await pool.query(queryBase, [startDate, endDate]))
      .rows;
    const previousData =
      compareStart && compareEnd
        ? (await pool.query(queryBase, [compareStart, compareEnd])).rows
        : [];

    // 🔹 Calcula variação percentual
    const variationData = currentData.map((curr) => {
      const key = dimensions[0];
      const prev = previousData.find((p) => p[key] === curr[key]);
      const metric = metrics[0];
      const diffPercent =
        prev && prev[metric]
          ? ((Number(curr[metric]) - Number(prev[metric])) /
              Number(prev[metric])) *
            100
          : null;

      return {
        ...curr,
        variation_percent: diffPercent ? diffPercent.toFixed(2) : null,
      };
    });

    res.json({ currentData, previousData, variationData });
  } catch (error: any) {
    console.error("❌ ERRO DETALHADO NO COMPARE PERIODS:");
    console.error(error);
    res
      .status(500)
      .json({ error: error.message || "Erro ao comparar períodos" });
  }
};

export const getMetricsCatalog = (req: Request, res: Response) => {
  const catalog = {
    metrics: [
      {
        id: "total_sales",
        label: "Total de Vendas (R$)",
        sql: "SUM(s.total_amount)",
      },
      { id: "orders", label: "Número de Pedidos", sql: "COUNT(s.id)" },
      {
        id: "avg_ticket",
        label: "Ticket Médio (R$)",
        sql: "AVG(s.total_amount)",
      },
      {
        id: "avg_delivery_minutes",
        label: "Tempo Médio de Entrega (min)",
        sql: "AVG(s.delivery_seconds)/60",
      },
    ],
    dimensions: [
      { id: "channel", label: "Canal", sql: "c.name" },
      { id: "product", label: "Produto", sql: "p.name" },
      { id: "store", label: "Loja", sql: "st.name" },
      { id: "city", label: "Cidade", sql: "da.city" },
      {
        id: "dow",
        label: "Dia da Semana",
        sql: "EXTRACT(DOW FROM s.created_at)",
      },
      {
        id: "hour",
        label: "Hora do Dia",
        sql: "EXTRACT(HOUR FROM s.created_at)",
      },
    ],
  };
  res.json(catalog);
};

export const runPivotQuery = async (req: Request, res: Response) => {
  try {
    const { metrics, dimensions, filters, limit } = req.body;

    const metricMap: Record<string, string> = {
      total_sales: "ROUND(SUM(s.total_amount)::numeric, 2)",
      orders: "COUNT(s.id)",
      avg_ticket: "ROUND(AVG(s.total_amount)::numeric, 2)",
      avg_delivery_minutes: "ROUND(AVG(s.delivery_seconds)::numeric / 60, 2)",
    };

    const dimensionMap: Record<string, string> = {
      channel: "c.name",
      product: "p.name",
      store: "st.name",
      city: "da.city",
      dow: `
    CASE CAST(EXTRACT(DOW FROM s.created_at) AS INT)
      WHEN 0 THEN 'Domingo'
      WHEN 1 THEN 'Segunda-feira'
      WHEN 2 THEN 'Terça-feira'
      WHEN 3 THEN 'Quarta-feira'
      WHEN 4 THEN 'Quinta-feira'
      WHEN 5 THEN 'Sexta-feira'
      WHEN 6 THEN 'Sábado'
    END
  `,
      hour: "EXTRACT(HOUR FROM s.created_at)::INT",
    };

    const selectMetrics = metrics
      .map((m: string) => `${metricMap[m]} AS ${m}`)
      .join(", ");
    const selectDimensions = dimensions
      .map((d: string) => `${dimensionMap[d]} AS ${d}`)
      .join(", ");

    const where: string[] = [];
    const params: any[] = [];

    if (filters?.channel) {
      params.push(filters.channel);
      where.push(`LOWER(c.name) = LOWER($${params.length})`);
    }
    if (filters?.date?.start && filters?.date?.end) {
      params.push(filters.date.start, filters.date.end);
      where.push(
        `s.created_at BETWEEN $${params.length - 1} AND $${params.length}`
      );
    }

    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const query = `
      SELECT ${selectDimensions}${selectMetrics ? `, ${selectMetrics}` : ""}
      FROM sales s
      LEFT JOIN channels c ON s.channel_id = c.id
      LEFT JOIN product_sales ps ON ps.sale_id = s.id
      LEFT JOIN products p ON ps.product_id = p.id
      LEFT JOIN stores st ON s.store_id = st.id
      LEFT JOIN delivery_addresses da ON s.id = da.sale_id
      ${whereClause}
      GROUP BY ${dimensions.map((d: string) => dimensionMap[d]).join(", ")}
      ORDER BY ${metrics[0]} DESC
      LIMIT ${limit || 20};
    `;

    if (req.body.compare) {
      const { startPrevious, endPrevious } = req.body.compare;

      const query = `
    WITH current_period AS (
      SELECT da.city, SUM(s.total_amount) AS total_current
      FROM sales s
      JOIN delivery_addresses da ON da.sale_id = s.id
      WHERE s.created_at BETWEEN $1 AND $2
      GROUP BY da.city
    ),
    previous_period AS (
      SELECT da.city, SUM(s.total_amount) AS total_previous
      FROM sales s
      JOIN delivery_addresses da ON da.sale_id = s.id
      WHERE s.created_at BETWEEN $3 AND $4
      GROUP BY da.city
    )
    SELECT 
      COALESCE(c.city, p.city) AS city,
      COALESCE(c.total_current, 0) AS current_total_sales,
      COALESCE(p.total_previous, 0) AS previous_total_sales,
      ROUND(((COALESCE(c.total_current, 0) - COALESCE(p.total_previous, 0)) / NULLIF(p.total_previous, 0)) * 100, 2) AS variation
    FROM current_period c
    FULL JOIN previous_period p ON c.city = p.city;
  `;

      const result = await pool.query(query, [
        filters.date.start,
        filters.date.end,
        startPrevious,
        endPrevious,
      ]);
      return res.json(result.rows);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
