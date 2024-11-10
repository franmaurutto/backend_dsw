import {Request, Response, NextFunction} from 'express'; 
import { Inscripcion } from './inscripciones.entity.js';
import { orm } from "../Shared/orm.js";
import { Alumno } from '../alumno/alumnos.entity.js';
import { Curso } from '../curso/cursos.entity.js';
import { Certificado } from '../certificado/certificado.entity.js';

const em = orm.em

function validateInscripcion(inscripcion: Inscripcion): boolean {
  if (!inscripcion) {
    throw new Error("Los datos de inscripcion son requeridos");
  }

  if (inscripcion.cancelado !== true && inscripcion.cancelado !== false) {
    throw new Error("El campo cancelado es requerido y debe ser 'Si' o 'No'");
  }

  return true;
}

function sanitizeInscripcionInput(req: Request, res: Response, next: NextFunction) {
  // Mostrar el cuerpo antes de la sanitización
  console.log('Body before sanitizing:', req.body);

  req.body.sanitizedInput = {
    fechaInscripcion: req.body.fechaInscripcion,
    cancelado: req.body.cancelado === 'Si' ? true : (req.body.cancelado === 'No' ? false : undefined),
    alumnoId: req.body.alumnoId,
    cursoId: req.body.cursoId,
    certificadoId: req.body.certificadoId,
    rtaparcialId: req.body.rtaparcialId,
    rtatpId: req.body.rtatpId
  };

  // Mostrar el cuerpo después de la asignación de sanitización
  console.log('Body after sanitizing assignment:', req.body);

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  // Mostrar el cuerpo después de eliminar propiedades con valores undefined
  console.log('Body after removing undefined values:', req.body);

  // Validar la inscripción
  validateInscripcion(req.body.sanitizedInput);
  next();
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
  console.log(`inscripcion add req.body: ${JSON.stringify(req.body.sanitizedInput)}`);
  try {
    const alumno = await em.findOne(Alumno, { id: req.body.sanitizedInput.alumnoId });
    if (!alumno) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }
    const curso = await em.findOne(Curso, { id: req.body.sanitizedInput.cursoId });
    if (!curso) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }
    const inscripcion = em.create(Inscripcion,{
       ...req.body.sanitizedInput,
      alumno,
      curso})
    await em.persistAndFlush(inscripcion)
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
    const inscripcion= em.getReference(Inscripcion, id)
    em.assign(inscripcion, req.body)
    await em.flush()
    res.status(200).json({ message: 'Se ha actualizado la inscripcion'})
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
