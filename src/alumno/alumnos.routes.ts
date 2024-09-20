import {Router} from 'express';
import {findAll, findOne, add, update, remove } from './alumnos.controler.js';
export const alumnoRouter = Router();

alumnoRouter.get("/", findAll);
alumnoRouter.get("/:id", findOne);
alumnoRouter.post("/", add);
alumnoRouter.put("/:id", update);
alumnoRouter.patch("/:id", update);
alumnoRouter.delete("/:id", remove);