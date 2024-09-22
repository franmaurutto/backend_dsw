import {Request, Response, NextFunction} from 'express'; 
import { Alumno } from './alumnos.entity.js';
import { orm } from '../Shared/orm.js';

const em = orm.em 

async function findAll(req: Request, res: Response){
  try {
    const alumnos = await em.find(Alumno, {})
    res.status(200).json({ message: 'Se encontraron todos los alumnos', data: alumnos })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
  
}
async function findOne(req: Request, res: Response){
  try {
    const id = Number.parseInt(req.params.id)
    const alumno = await em.findOneOrFail(Alumno, { id })
    res.status(200).json({ message: 'Se encontró el alumno', data: alumno })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
async function add(req: Request, res: Response){
  try {
    const alumno = em.create(Alumno, req.body)
    await em.flush()
    res.status(201).json({ message: 'Alumno creado', data: alumno })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
async function update(req: Request, res: Response){
  try {
    const id = Number.parseInt(req.params.id)
    const alumno = em.getReference(Alumno, id)
    em.assign(alumno, req.body)
    await em.flush()
    res.status(200).json({ message: 'Alumno actualizado' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
async function remove(req: Request, res: Response){
  try {
    const id = Number.parseInt(req.params.id)
    const alumno = em.getReference(Alumno, id)
    await em.removeAndFlush(alumno)
    res.status(200).send({ message: 'Alumno eliminado' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
export {findAll, findOne, add, update, remove}
