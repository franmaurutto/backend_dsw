import { Router} from "express";
import { findAll, findOne, update, add, remove, sanitizeRtaParcialInput } from "./rtaParcial.controles.js";

export const rtaParcialRouter = Router()

rtaParcialRouter.get('/',findAll)
rtaParcialRouter.get('/:id', sanitizeRtaParcialInput, findOne)
rtaParcialRouter.post('/', add)
rtaParcialRouter.put('/:id', sanitizeRtaParcialInput, update)
rtaParcialRouter.patch('/:id', sanitizeRtaParcialInput, update)
rtaParcialRouter.delete('/:id', sanitizeRtaParcialInput, remove)