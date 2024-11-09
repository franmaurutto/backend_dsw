import {Request, Response, NextFunction} from 'express'; 
import { Curso } from './cursos.entity.js';
import { orm } from "../Shared/orm.js";
import { Profesor } from '../profesor/profesores.entity.js';
import { Parcial } from '../parcial/parcial.entity.js';
import { Alumno } from '../alumno/alumnos.entity.js';
import { Tp } from '../tp/tps.entity.js';
const em = orm.em

function validateCurso(curso: Curso): boolean {
  if (!curso) {
      throw new Error("Los datos de curso son requeridos");
  }

  if (!curso.nombre || curso.nombre.trim() === "") {
      throw new Error("El campo nombre es requerido");
  }

  if (curso.cantCupos < 0) {
      throw new Error("El número de cupos debe ser mayor a 0");
  }

  if (!curso.descripcion || curso.descripcion.trim() === "") {
      throw new Error("La descripción es requerida");
  }

  const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
  if (!curso.horaInicio || !timePattern.test(curso.horaInicio)) {
      throw new Error("La hora de inicio es requerida y debe seguir el formato HH:mm");
  }

  if (!curso.horaFin || !timePattern.test(curso.horaFin)) {
      throw new Error("La hora de fin es requerida y debe seguir el formato HH:mm");
  }


  return true;
}

function validarDia(dia: string): void {
  const diasValidos = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  if (!diasValidos.includes(dia)) {
      throw new Error("El día ingresado no es válido. Debe ser un día de lunes a sábado.");
  }
}

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
    tpId:req.body.tpId,

  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  validateCurso(req.body.sanitizedInput);
  next()
}

async function getAll (req: Request,res: Response){
  try {
    const cursos = await em.find(Curso, {}, {populate: ['profesor']}) //falta agregar ,'parcial', 'tp'
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
    const parcial = await em.findOne(Parcial, { id: req.body.sanitizedInput.parcialId })
      ? await em.findOne(Parcial, { id: req.body.sanitizedInput.parcialId }) 
      : null;


    const tp = await em.findOne(Tp, { id: req.body.sanitizedInput.tpId })
      ? await em.findOne(Tp, { id: req.body.sanitizedInput.tpId }) 
      : null;


    const curso = em.create(Curso, {
      ...req.body.sanitizedInput,
      profesor,
      parcial:parcial || null,
      tp:tp || null,                
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
    const curso= em.getReference(Curso, id)
    em.assign(curso, req.body)// va req.body.sanitizedInput?
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


export {sanitizeCursoInput, getAll, getOne, add, update, remove }
