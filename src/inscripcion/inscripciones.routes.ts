import {Router} from 'express';
import {getAll, getOne, add, update, remove,sanitizeInscripcionInput } from './inscripciones.controler.js';
export const inscripcionRouter = Router();

inscripcionRouter.get("/",getAll);
inscripcionRouter.get("/:id",getOne);
inscripcionRouter.post("/",sanitizeInscripcionInput,add);
inscripcionRouter.put("/:id",sanitizeInscripcionInput,update);
inscripcionRouter.patch("/:id",sanitizeInscripcionInput,update);
inscripcionRouter.delete("/:id",sanitizeInscripcionInput,remove);