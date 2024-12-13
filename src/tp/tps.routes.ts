import {Router} from 'express';
import {sanitizeTpInput, getAll, getOne, add, update, remove, getRtaTpdeTp } from './tpscontroler.js';
import { verificarTokenYRol } from '../middleware/verificarTokenYRol.js';
const tpRouter = Router();

tpRouter.get("/",getAll);
tpRouter.get("/:id",verificarTokenYRol(['profesor','alumno']),getOne);
tpRouter.post("/",verificarTokenYRol(['profesor']),sanitizeTpInput,add);
tpRouter.put("/:id",verificarTokenYRol(['profesor']),sanitizeTpInput,update);
tpRouter.patch("/:id",sanitizeTpInput,update);
tpRouter.delete("/:id",verificarTokenYRol(['profesor']),remove);
tpRouter.get('/:id/rtastp',verificarTokenYRol(['profesor']),getRtaTpdeTp)

export{tpRouter};