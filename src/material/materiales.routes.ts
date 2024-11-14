import { Router } from "express";
import { sanitizeMaterialInput, findAll, findOne, add, update, remove, findMatSinCurso, addMaterialToCurso } from "./material.controler.js";

export const materialRouter = Router();

materialRouter.get('/sin-curso', findMatSinCurso); // Coloca esta línea primero
materialRouter.get('/', findAll);
materialRouter.get('/:id', findOne);
materialRouter.post('/', sanitizeMaterialInput, add);
materialRouter.put('/:id', sanitizeMaterialInput, update);
materialRouter.patch('/:id', sanitizeMaterialInput, update);
materialRouter.delete('/:id', remove);
materialRouter.post('/:materialId/add-to-curso/:cursoId', addMaterialToCurso);

