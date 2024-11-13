import {Router} from 'express';
import {getAll, getOne, add, update, remove, sanitizeCursoInput/*, getMaterialesCurso */} from './cursoscontroler.js';
export const cursoRouter = Router();

cursoRouter.get("/",getAll);
cursoRouter.get("/:id",getOne);
cursoRouter.post("/",sanitizeCursoInput, add);
cursoRouter.put("/:id",update);
cursoRouter.patch("/:id",update);
cursoRouter.delete("/:id",remove);
//cursoRouter.get('/:id/materiales',getMaterialesCurso)
