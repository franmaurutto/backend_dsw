import { Router} from "express";
import { findAll, findOne, update, add, remove,sanitizeRtaTpInput } from "./rtaTp.controler.js";

export const rtaTpRouter = Router()

rtaTpRouter.get('/', findAll)
rtaTpRouter.get('/:id', findOne)
rtaTpRouter.post('/',sanitizeRtaTpInput, add)
rtaTpRouter.put('/:id',sanitizeRtaTpInput, update)
rtaTpRouter.patch('/:id',sanitizeRtaTpInput, update)
rtaTpRouter.delete('/:id',sanitizeRtaTpInput, remove)