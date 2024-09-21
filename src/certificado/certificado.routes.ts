import { Router} from "express";
import { findAll, findOne, update, add, remove } from "./certificado.controler.js";

export const certificadoRouter = Router()

certificadoRouter.get('/', findAll)
certificadoRouter.get('/:id', findOne)
certificadoRouter.post('/', add)
certificadoRouter.put('/:id', update)
certificadoRouter.patch('/:id', update)
certificadoRouter.delete('/:id', remove)
