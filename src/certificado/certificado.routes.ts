import { Router} from "express";
import { sanitizeCertificadoInput, findAll, findOne, update, add, remove } from "./certificado.controler.js";

export const certificadoRouter = Router()

certificadoRouter.get('/', findAll)
certificadoRouter.get('/:id', findOne)
certificadoRouter.post('/', sanitizeCertificadoInput, add)
certificadoRouter.put('/:id', sanitizeCertificadoInput, update)
certificadoRouter.patch('/:id', sanitizeCertificadoInput, update)
certificadoRouter.delete('/:id', remove)
