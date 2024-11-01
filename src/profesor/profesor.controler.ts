import { Request, Response, NextFunction } from "express"
import { Profesor } from "./profesores.entity.js"
import { orm } from "../Shared/orm.js";
import { Curso } from "../curso/cursos.entity.js";

const em = orm.em

function sanitizeProfesorInput(req: Request, res: Response, next: NextFunction){
    
    req.body.sanitizedInput = {
        nombre_y_apellido: req.body.nombre_y_apellido,
        mail: req.body.mail,
        telefono: req.body.telefono,
        contrasenia: req.body.contrasenia,
        cursoId: req.body.cursoId,
        
    }
    
    Object.keys(req.body.sanitizedInput).forEach(key=>{
        if (req.body.sanitizedInput[key]===undefined){
        delete req.body.sanitizedInput[key]
        }
    })
    next()
} 

async function findAll(req: Request, res: Response){
    try {
      const profesores = await em.find(Profesor, {})
      res.status(200).json({ message: 'Se encontraron todos los profesores', data: profesores })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
    
  }
  async function findOne(req: Request, res: Response){
    try {
      const id = Number.parseInt(req.params.id)
      const profesor = await em.findOneOrFail(Profesor, { id })
      res.status(200).json({ message: 'Se encontró el profesor', data: profesor })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
 /* async function add(req: Request, res: Response){
    try {
      const profesor = em.create(Profesor, req.body)
      await em.flush()
      res.status(201).json({ message: 'profesor creado', data: profesor })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }*/
  async function add(req: Request, res: Response) {
    console.log(`profesor add req.body: ${JSON.stringify(req.body.sanitizedInput)}`);
    try {
      const curso = await em.findOne(Curso, { id: req.body.sanitizedInput.cursoId });
      if (!curso) {
        return res.status(404).json({ message: 'Curso no encontrado' });
      }
      const profesor = em.create(Profesor, {
        ...req.body.sanitizedInput,
        curso,              
      });
      await em.persistAndFlush(profesor);
      res.status(201).json({ message: 'Profesor ha sido creado', data: profesor });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  async function update(req: Request, res: Response){
    try {
      const id = Number.parseInt(req.params.id)
      const profesor = em.getReference(Profesor, id)
      em.assign(profesor, req.body)
      await em.flush()
      res.status(200).json({ message: 'profesor actualizado' })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  async function remove(req: Request, res: Response){
    try {
      const id = Number.parseInt(req.params.id)
      const profesor = em.getReference(Profesor, id)
      await em.removeAndFlush(profesor)
      res.status(200).send({ message: 'profesor eliminado' })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

export {sanitizeProfesorInput, findAll, findOne, add, update, remove}
