import {Router} from 'express';
import {sanitezeCursoInput, getAll, getOne, add, update, patch, remove } from './tpscontroler.js';
export const tpRouter = Router();

tpRouter.get("/",getAll);
tpRouter.get("/:identificador",getOne);
tpRouter.post("/",sanitezeCursoInput,add);
tpRouter.put("/:identificador",sanitezeCursoInput,update);
tpRouter.patch("/:identificador",sanitezeCursoInput,patch);
tpRouter.delete("/:identificador",remove);