import {Router} from 'express';
import {getAll, getOne, add, update, remove, sanitizeCursoInput, getMaterialesCurso, getInscripcionesCurso } from './cursoscontroler.js';
import { verificarTokenYRol } from '../middleware/verificarTokenYRol.js';
export const cursoRouter = Router();

cursoRouter.get("/",getAll);
cursoRouter.get("/:id",getOne);
cursoRouter.post("/",verificarTokenYRol(['profesor']),sanitizeCursoInput, add);
cursoRouter.put("/:id",verificarTokenYRol(['profesor']),sanitizeCursoInput, update);
cursoRouter.patch("/:id",update);
cursoRouter.delete("/:id",verificarTokenYRol(['profesor']),remove);
cursoRouter.get('/:id/materiales', verificarTokenYRol(['profesor']), getMaterialesCurso);
cursoRouter.get('/:id/inscripciones', verificarTokenYRol(['profesor']), getInscripcionesCurso);
