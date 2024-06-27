import { Router} from "express";
import { sanitizeProfesorInput, findAll, findOne,add, update, remove} from "./profesor.controler.js";

export const profesorRouter = Router()

profesorRouter.get('/',findAll)
profesorRouter.get('/:id',findOne)
profesorRouter.post('/',sanitizeProfesorInput,add)
profesorRouter.put('/:id',sanitizeProfesorInput,update)
profesorRouter.patch('/:id',sanitizeProfesorInput,update)
profesorRouter.delete('/:id',remove)