import {Router} from 'express';
import {findAll, findOne, add, update, remove,sanitizeUsuarioInput,findByEmail, getInscripcionesAlumno, getCursosProfesor,cambiarContrasenia, findOneByEmail} from './usuario.controller.js';
import { verificarTokenYRol } from '../middleware/verificarTokenYRol.js';
export const usuarioRouter = Router();

usuarioRouter.get("/", findAll);
usuarioRouter.get("/:id", findOne);
usuarioRouter.post("/",sanitizeUsuarioInput, add);
usuarioRouter.put("/:id",verificarTokenYRol(['profesor','alumno']),sanitizeUsuarioInput, update);
usuarioRouter.patch("/:id",sanitizeUsuarioInput, update);
usuarioRouter.delete("/:id",verificarTokenYRol(['profesor','alumno']),sanitizeUsuarioInput, remove);
usuarioRouter.post("/login", findByEmail);
usuarioRouter.get('/:id/inscripciones',verificarTokenYRol(['alumno']), getInscripcionesAlumno);
usuarioRouter.get('/:id/cursos',verificarTokenYRol(['profesor']),getCursosProfesor)
usuarioRouter.patch("/:id/cambiar-contrasenia",verificarTokenYRol(['profesor','alumno']), cambiarContrasenia);
usuarioRouter.post("/validar", findOneByEmail);