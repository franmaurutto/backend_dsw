import { Router } from "express";
import { sanitizeMaterialInput, findAll, findOne, add, update, remove, findMatSinCurso, addMaterialToCurso } from "./material.controler.js";
import { verificarTokenYRol } from "../middleware/verificarTokenYRol.js";
export const materialRouter = Router();

materialRouter.get('/sin-curso',verificarTokenYRol(['profesor']), findMatSinCurso); 
materialRouter.get('/',verificarTokenYRol(['profesor']), findAll);
materialRouter.get('/:id',verificarTokenYRol(['profesor']), findOne);
materialRouter.post('/',verificarTokenYRol(['profesor']), sanitizeMaterialInput, add);
materialRouter.put('/:id', sanitizeMaterialInput,verificarTokenYRol(['profesor']), update);
materialRouter.patch('/:id', sanitizeMaterialInput, update);
materialRouter.delete('/:id',verificarTokenYRol(['profesor']), remove);
materialRouter.post('/:materialId/add-to-curso/:cursoId',verificarTokenYRol(['profesor']), addMaterialToCurso);