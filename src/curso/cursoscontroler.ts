import {Request, Response, NextFunction} from 'express'; 
import { Curso } from './cursos.entity.js';
import { orm } from "../Shared/orm.js";

const em = orm.em

async function getAll (req: Request,res: Response){
  try {
    const cursos = await em.find(Curso, {})
    res
      .status(200)
      .json({ message: 'Se han encontrado los cursos', data: cursos })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function getOne (req: Request,res: Response){
  try {
    const id = Number.parseInt(req.params.id)
    const curso = await em.findOneOrFail(Curso, { id })
    res
      .status(200)
      .json({ message: 'Se ha encontrado el curso', data: curso })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add (req:Request, res:Response) {
  try {
    const curso = em.create(Curso, req.body)
    await em.flush()
    res
      .status(201)
      .json({ message: 'Curso ha sido creado', data: curso })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req:Request, res:Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const curso = em.getReference(Curso, id)
    em.assign(curso, req.body)
    await em.flush()
    res.status(200).json({ message: 'Se ha actualizado el curso' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function remove (req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const curso = em.getReference(Curso, id)
    await em.removeAndFlush(curso)
    res.status(200).send({ message: 'Se ha borrado el curso' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export {getAll, getOne, add, update, remove }
