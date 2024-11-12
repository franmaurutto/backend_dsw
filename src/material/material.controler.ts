import { Request, Response, NextFunction } from "express"
import { Profesor } from "./materiales.entity.js"
import { orm } from "../Shared/orm.js";
import { Curso } from "../curso/cursos.entity.js";

const em = orm.em
function validateMaterial(material: Material) {
    if (!material) {
      throw new Error("Los datos del material son requeridos");
    }
  
    if (!material.titulo || material.titulo.trim() === "") {
      throw new Error("El campo título es requerido");
    }
  
    if (!material.descripcion || material.descripcion.trim() === "") {
      throw new Error("El campo descripción es requerido");
    }
  
    return true;
  }
  

function sanitizeMaterialInput(req: Request, res: Response, next: NextFunction){
    
    req.body.sanitizedInput = {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        cursoId: req.body.cursoId,
        
    }
    
    Object.keys(req.body.sanitizedInput).forEach(key=>{
        if (req.body.sanitizedInput[key]===undefined){
        delete req.body.sanitizedInput[key]
        }
    })
    validateMaterial(req.body.sanitizedInput);
    next()
} 

async function findAll(req: Request, res: Response){
    try {
      const materiales = await em.find(Material, {})
      res.status(200).json({ message: 'Se encontraron todos los materiales', data: materiales })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
    
  }
  async function findOne(req: Request, res: Response){
    try {
      const id = Number.parseInt(req.params.id)
      const material = await em.findOneOrFail(Material, { id })
      res.status(200).json({ message: 'Se encontró el material', data: profesor })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  async function add(req: Request, res: Response) {
    console.log(`profesor add req.body: ${JSON.stringify(req.body.sanitizedInput)}`);
    try {
       let curso = null;
      if (req.body.sanitizedInput.cursoId) {
      curso = await em.findOne(Curso, { id: req.body.sanitizedInput.cursoId });
        if (!curso) {
          return res.status(404).json({ message: 'Curso no encontrado' });
      }
    }

    const material = em.create(Material, {
      ...req.body.sanitizedInput,
      curso,
    });
      await em.persistAndFlush(material);
      res.status(201).json({ message: 'Material ha sido creado', data: material });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  async function update(req: Request, res: Response){
    try {
      const id = Number.parseInt(req.params.id)
      const material = em.getReference(Material, id)
      em.assign(material, req.body)
      await em.flush()
      res.status(200).json({ message: 'Material actualizado' })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  async function remove(req: Request, res: Response){
    try {
      const id = Number.parseInt(req.params.id)
      const material = em.getReference(Material, id)
      await em.removeAndFlush(material)
      res.status(200).send({ message: 'Material eliminado' })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

  async function getCursosProfesor(req: Request, res: Response) {
    const profesorId = parseInt(req.params.id, 10);

    try {
      if (isNaN(profesorId)) {
        return res.status(400).json({ message: 'ID de profesor inválido' });
      }

      const profesor = await em.findOne(Profesor, profesorId, { populate: ['cursos'] });
    
      if (!profesor) {
        return res.status(404).json({ message: 'Profesor no encontrado' });
      }

      const cursos = profesor.cursos.getItems(); 
      return res.status(200).json({ message: 'Cursos del profesor encontrados', data: cursos });

    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: 'Error al obtener los cursos del profesor' });
    }
  }

export {sanitizeMaterialInput, findAll, findOne, add, update, remove}