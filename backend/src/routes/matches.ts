import { Router } from "express";
import { listMatches, getMatch } from "../controllers/matches.controller";

const router = Router();

router.get("/", listMatches);
router.get("/:id", getMatch);

export default router;
