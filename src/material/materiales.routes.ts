import { Router} from "express";
import { sanitizeMaterialInput, findAll, findOne,add, update, remove} from "./material.controler.js";

export const materialRouter = Router()

materialRouter.get('/',findAll)
materialRouter.get('/:id',findOne)
materialRouter.post('/',sanitizeMaterialInput,add)
materialRouter.put('/:id',sanitizeMaterialInput,update)
materialRouter.patch('/:id',sanitizeMaterialInput,update)
materialRouter.delete('/:id',remove)