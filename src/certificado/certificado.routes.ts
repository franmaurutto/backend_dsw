import { Router} from "express";
import { findAll, findOne, update, add, remove, sanitizeCertificadoInput} from "./certificado.controler.js";
import { verificarTokenYRol } from '../middleware/verificarTokenYRol.js';
export const certificadoRouter = Router()

certificadoRouter.get('/', findAll)
certificadoRouter.get('/:id',verificarTokenYRol(['alumno']), findOne)
certificadoRouter.post('/',verificarTokenYRol(['profesor']),sanitizeCertificadoInput, add)
certificadoRouter.put('/:id',sanitizeCertificadoInput, update)
certificadoRouter.patch('/:id', update)
certificadoRouter.delete('/:id',verificarTokenYRol(['profesor']), remove)
