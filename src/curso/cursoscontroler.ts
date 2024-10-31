import {Request, Response, NextFunction} from 'express'; 
import { Curso } from './cursos.entity.js';
import { orm } from "../Shared/orm.js";
import { Profesor } from '../profesor/profesores.entity.js';
import { Parcial } from '../parcial/parcial.entity.js';
import { Alumno } from '../alumno/alumnos.entity.js';
import { Tp } from '../tp/tps.entity.js';
const em = orm.em

function sanitizeCursoInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    descripcion: req.body.descripcion,
    nombre: req.body.nombre,
    cantCupos: req.body.cantCupos,
    duracion: req.body.duracion,
    fechaInicio: req.body.fechaInicio,
    fechaFin: req.body.fechaFin,
    horaInicio: req.body.horaInicio,
    horaFin: req.body.horaFin,
    dias: req.body.dias,
    profesorId: req.body.profesorId, 
    parcialId: req.body.parcialId,
    alumnoId:req.body.alumnoId,
    tpId:req.body.tpId,

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
    const cursos = await em.find(Curso, {}, {populate: ['profesor']}) //falta agregar , 'alumnos', 'parcial', 'tp'
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
    const curso = await em.findOneOrFail(Curso, { id },  {populate: ['profesor']}) //falta agregar , 'alumnos', 'parcial', 'tp')
    res
      .status(200)
      .json({ message: 'Se ha encontrado el curso', data: curso })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function add(req: Request, res: Response) {
  console.log(`curso add req.body: ${JSON.stringify(req.body.sanitizedInput)}`);
  try {
    const profesor = await em.findOne(Profesor, { id: req.body.sanitizedInput.profesorId });
    if (!profesor) {
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }
    const parcial = await em.findOne(Parcial, { id: req.body.sanitizedInput.parcialId });
    if (!parcial) {
      return res.status(404).json({ message: 'Parcial no encontrado' });
    }
    const alumno = await em.findOne(Alumno, { id: req.body.sanitizedInput.alumnoId });
    if (!alumno) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }
    const tp = await em.findOne(Alumno, { id: req.body.sanitizedInput.tpId });
    if (!alumno) {
      return res.status(404).json({ message: 'Tp no encontrado' });
    }
    const curso = em.create(Curso, {
      ...req.body.sanitizedInput,
      profesor,
      parcial,
      alumno,
      tp,                
    });
    await em.persistAndFlush(curso);
    res.status(201).json({ message: 'Curso ha sido creado', data: curso });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req:Request, res:Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const curso = await em.findOneOrFail(Curso, {id})
    em.assign(curso, req.body.sanitizeCursoInput)
    await em.flush()
    res.status(200).json({ message: 'Se ha actualizado el curso', data: curso })
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


export {sanitizeCursoInput, getAll, getOne, add, update, remove }
