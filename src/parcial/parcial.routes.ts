import { Router} from "express";
import { sanitizeParcialInput, findAll, findOne,add, update, remove} from "./parcial.controler.js";

export const parcialRouter = Router()

parcialRouter.get('/',findAll)
parcialRouter.get('/:id',findOne)
parcialRouter.post('/',sanitizeParcialInput,add)
parcialRouter.put('/:id',sanitizeParcialInput,update)
parcialRouter.patch('/:id',sanitizeParcialInput,update)
parcialRouter.delete('/:id',remove)