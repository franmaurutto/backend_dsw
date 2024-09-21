import { Router} from "express";
import { findAll, findOne, update, add, remove } from "./rtaTp.controler.js";

export const rtaTpRouter = Router()

rtaTpRouter.get('/', findAll)
rtaTpRouter.get('/:id', findOne)
rtaTpRouter.post('/', add)
rtaTpRouter.put('/:id', update)
rtaTpRouter.patch('/:id', update)
rtaTpRouter.delete('/:id', remove)