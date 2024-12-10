import {Router} from 'express';
import {getAll, getOne, add, update, remove, sanitizeCursoInput, getMaterialesCurso } from './cursoscontroler.js';
import { verificarTokenYRol } from '../middleware/verificarTokenYRol.js';
export const cursoRouter = Router();

cursoRouter.get("/",verificarTokenYRol(['profesor,alumno']),getAll);
cursoRouter.get("/:id",getOne);
cursoRouter.post("/",verificarTokenYRol(['profesor']),sanitizeCursoInput, add);
cursoRouter.put("/:id",verificarTokenYRol(['profesor']),update);
cursoRouter.patch("/:id",update);
cursoRouter.delete("/:id",verificarTokenYRol(['profesor']),remove);
cursoRouter.get('/:id/materiales',verificarTokenYRol(['profesor']),getMaterialesCurso)
