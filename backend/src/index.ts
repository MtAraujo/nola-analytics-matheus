import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { pool } from "./db";
import metricsRoutes from "./routes/metrics";
import dashboardRoutes from "./routes/dashboard.routes";
import shareRoutes from "./routes/share.routes";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/dashboards", dashboardRoutes);
app.use("/shares", shareRoutes);


app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro de conexão ao banco");
  }
});

app.use("/metrics", metricsRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
