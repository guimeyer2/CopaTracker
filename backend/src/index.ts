import express from "express";
import cors from "cors";
import { config } from "./config";
import matchesRouter from "./routes/matches";

const app = express();

app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  }),
);
app.use(express.json());

// Healthcheck
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "copatracker-backend" });
});

// Jogos (público)
app.use("/matches", matchesRouter);

// TODO (próximas seções da ordem de implementação):
//   /auth     — Passport + Google OAuth (seção 5)
//   /watches  — registrar/avaliar jogos assistidos (seção 6)
//   /stats    — estatísticas agregadas do usuário (seção 8)

app.listen(config.port, () => {
  console.log(`🏟️  Copa Tracker API rodando em http://localhost:${config.port}`);
});
