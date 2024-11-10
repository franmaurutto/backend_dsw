import {Router} from 'express';
import {sanitizeTpInput, getAll, getOne, add, update, remove } from './tpscontroler.js';
const tpRouter = Router();

tpRouter.get("/",getAll);
tpRouter.get("/:id",sanitizeTpInput,getOne);
tpRouter.post("/",sanitizeTpInput,add);
tpRouter.put("/:id",sanitizeTpInput,update);
tpRouter.patch("/:id",sanitizeTpInput,update);
tpRouter.delete("/:id",sanitizeTpInput,remove);

export{tpRouter};