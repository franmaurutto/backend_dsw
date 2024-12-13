import { Router} from "express";
import { findAll, findOne, update, add, remove,sanitizeRtaTpInput } from "./rtaTp.controler.js";
import { verificarTokenYRol } from "../middleware/verificarTokenYRol.js";

export const rtaTpRouter = Router()

rtaTpRouter.get('/', findAll)
rtaTpRouter.get('/:id', findOne)
rtaTpRouter.post('/', sanitizeRtaTpInput, verificarTokenYRol(['alumno']), add)
rtaTpRouter.put('/:id',sanitizeRtaTpInput, update)
rtaTpRouter.patch('/:id',sanitizeRtaTpInput, update)
rtaTpRouter.delete('/:id',sanitizeRtaTpInput, remove)
