import {Router} from 'express';
import {findAll, findOne, add, update, remove,sanitizeUsuarioInput,findByEmail, getInscripcionesAlumno, getCursosProfesor} from './usuario.controller.js';
import { verificarTokenYRol } from '../middleware/verificarTokenYRol.js';
export const usuarioRouter = Router();

usuarioRouter.get("/", findAll);
usuarioRouter.get("/:id", findOne);
usuarioRouter.post("/",sanitizeUsuarioInput, add);
usuarioRouter.put("/:id",verificarTokenYRol(['profesor','alumno']),sanitizeUsuarioInput, update);
usuarioRouter.patch("/:id",sanitizeUsuarioInput, update);
usuarioRouter.delete("/:id",verificarTokenYRol(['profesor','alumno']),sanitizeUsuarioInput, remove);
usuarioRouter.post("/login",verificarTokenYRol(['profesor','alumno']), findByEmail);
usuarioRouter.get('/:id/inscripciones',verificarTokenYRol(['alumno']), getInscripcionesAlumno);
usuarioRouter.get('/:id/cursos',verificarTokenYRol(['profesor']),getCursosProfesor)