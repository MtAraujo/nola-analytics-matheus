import { Request, Response } from "express";
import { pool } from "../db";

export const createDashboard = async (req: Request, res: Response) => {
  try {
    const { name, config } = req.body;
    const result = await pool.query(
      "INSERT INTO dashboards (name, config) VALUES ($1, $2) RETURNING *",
      [name, config]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error("Erro ao criar dashboard:", err.message);
    res.status(500).json({ error: "Erro ao criar dashboard" });
  }
};

export const getDashboards = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM dashboards ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: "Erro ao listar dashboards" });
  }
};

export const getDashboardById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM dashboards WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Dashboard não encontrado" });
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: "Erro ao buscar dashboard" });
  }
};

export const deleteDashboard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM dashboards WHERE id = $1", [id]);
    res.json({ message: "Dashboard excluído com sucesso" });
  } catch (err: any) {
    res.status(500).json({ error: "Erro ao excluir dashboard" });
  }
};
