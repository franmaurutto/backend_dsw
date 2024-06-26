import {Router} from 'express';
import {sanitezeAlumnoInput, getAll, getOne, add, update, patch, remove } from './alumnoscontroler.js';
export const alumnoRouter = Router();

alumnoRouter.get("/",getAll);
alumnoRouter.get("/:id",getOne);
alumnoRouter.post("/",sanitezeAlumnoInput,add);
alumnoRouter.put("/:id",sanitezeAlumnoInput,update);
alumnoRouter.patch("/:id",sanitezeAlumnoInput,patch);
alumnoRouter.delete("/:id",remove);