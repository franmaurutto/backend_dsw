import {Request, Response, NextFunction} from 'express'; 
import { Inscripcion } from './inscripciones.entity.js';
import { orm } from "../Shared/orm.js";

const em = orm.em

function sanitizeInscripcionInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    fechaInscripcion: req.body.fechaInscripcion,
    cancelado: req.body.cancelado,
    /*certificado: req.body.certificado,
    parciales: req.body.parciales,
    tps: req.body.tps,
    rtaparcial: req.body.rtaparcial,
    rtatp: req.body.rtatp*/
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

async function getAll (req: Request,res: Response){
  try {
    const inscripciones = await em.find(Inscripcion, {}) //, {populate: ['certificado', 'parciales', 'tps', 'rtaparcial', 'rtatp']} 
    res
      .status(200)
      .json({ message: 'Se han encontrado las inscripciones', data: inscripciones })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function getOne (req: Request,res: Response){
  try {
    const id = Number.parseInt(req.params.id)
    const inscripcion = await em.findOneOrFail(Inscripcion, { id }) //, {populate: ['certificado', 'parciales', 'tps', 'rtaparcial', 'rtatp']} 
    res
      .status(200)
      .json({ message: 'Se ha encontrado la inscripcion', data: inscripcion })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add (req:Request, res:Response) {
  try {
    const inscripcion = em.create(Inscripcion, req.body.sanitizeInscripcionInput)
    await em.flush()
    res
      .status(201)
      .json({ message: 'Inscripcion ha sido creada', data: inscripcion })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req:Request, res:Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const inscripcion = await em.findOneOrFail(Inscripcion, {id})
    em.assign(inscripcion, req.body.sanitizeInscripcionInput)
    await em.flush()
    res.status(200).json({ message: 'Se ha actualizado la inscripcion', data: inscripcion })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove (req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const inscripcion = em.getReference(Inscripcion, id)
    await em.removeAndFlush(inscripcion)
    res.status(200).send({ message: 'Se ha borrado la inscripcion' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


export {sanitizeInscripcionInput, getAll, getOne, add, update, remove }
