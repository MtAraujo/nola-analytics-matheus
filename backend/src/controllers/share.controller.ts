import { Request, Response } from "express";
import { pool } from "../db";

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

export const shareDashboard = async (req: Request, res: Response) => {
  try {
    const { dashboard_id } = req.body;
    const result = await pool.query(
      "INSERT INTO shares (dashboard_id) VALUES ($1) RETURNING token",
      [dashboard_id]
    );
    const token = result.rows[0].token;
    res.json({
      share_url: `${frontendUrl}/shares/${token}`,
      token
    });
  } catch (err: any) {
    console.error("Erro ao compartilhar dashboard:", err.message);
    res.status(500).json({ error: "Erro ao compartilhar dashboard" });
  }
};

export const getSharedDashboard = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const result = await pool.query(
      `SELECT d.*
       FROM shares s
       JOIN dashboards d ON s.dashboard_id = d.id
       WHERE s.token = $1`,
      [token]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "Link inválido ou expirado" });

    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: "Erro ao acessar dashboard compartilhado" });
  }
};
