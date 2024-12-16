import { Router} from "express";
import { findAll, findOne, update, add, remove, sanitizeRtaParcialInput, getInscripcionDeRtaParcial } from "./rtaParcial.controles.js";
import { verificarTokenYRol } from "../middleware/verificarTokenYRol.js";

export const rtaParcialRouter = Router()

rtaParcialRouter.get('/',findAll)
rtaParcialRouter.get('/:id', sanitizeRtaParcialInput, findOne)
rtaParcialRouter.post('/', sanitizeRtaParcialInput,verificarTokenYRol(['alumno']), add)
rtaParcialRouter.put('/:id', sanitizeRtaParcialInput, update)
rtaParcialRouter.patch('/:id', sanitizeRtaParcialInput, update)
rtaParcialRouter.delete('/:id', verificarTokenYRol(['profesor']),sanitizeRtaParcialInput, remove)
rtaParcialRouter.get("/:id/inscripcion/:inscripcionId", verificarTokenYRol(['profesor']),getInscripcionDeRtaParcial);