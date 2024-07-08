import { Router} from "express";
import { sanitizeCertificadoInput, findAll, findOne, update, add, remove } from "./tps.controler.js";

export const tpRouter = Router()

tpRouter.get('/', findAll)
tpRouter.get('/:id', findOne)
tpRouter.post('/', sanitizeCertificadoInput, add)
tpRouter.put('/:id', sanitizeCertificadoInput, update)
tpRouter.patch('/:id', sanitizeCertificadoInput, update)
tpRouter.delete('/:id', remove)
