import { Router} from "express";
import { sanitizeParcialInput, findAll, findOne,add, update, remove, getRtaParcialdeParcial} from "./parcial.controler.js";
import { verificarTokenYRol } from "../middleware/verificarTokenYRol.js";
export const parcialRouter = Router()

parcialRouter.get('/',findAll)
parcialRouter.get('/:id',verificarTokenYRol(['profesor','alumno']),findOne)
parcialRouter.post('/',verificarTokenYRol(['profesor']),sanitizeParcialInput,add)
parcialRouter.put('/:id',verificarTokenYRol(['profesor']),sanitizeParcialInput,update)
parcialRouter.patch('/:id',sanitizeParcialInput,update)
parcialRouter.delete('/:id',verificarTokenYRol(['profesor']),remove)
parcialRouter.get('/:id/rtasParcial',verificarTokenYRol(['profesor']),getRtaParcialdeParcial)