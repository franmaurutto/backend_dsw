import {Router} from 'express';
import {getAll, getOne, add, update, remove,sanitizeInscripcionInput, getCursoDeInscripcion} from './inscripciones.controler.js';
import { verificarTokenYRol } from '../middleware/verificarTokenYRol.js';
export const inscripcionRouter = Router();

inscripcionRouter.get("/",getAll);
inscripcionRouter.get("/:id",getOne);
inscripcionRouter.post("/",verificarTokenYRol(['alumno']),sanitizeInscripcionInput,add);
inscripcionRouter.put("/:id",sanitizeInscripcionInput,update);
inscripcionRouter.patch("/:id",sanitizeInscripcionInput,update);
inscripcionRouter.delete("/:id",verificarTokenYRol(['alumno']),sanitizeInscripcionInput,remove);
inscripcionRouter.get("/:id/curso/:cursoId",verificarTokenYRol(['alumno']), getCursoDeInscripcion);