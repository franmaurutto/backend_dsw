import {Request, Response, NextFunction} from 'express'; 
import { Curso } from './cursos.entity.js';
import { orm } from "../Shared/orm.js";
//import { Profesor } from '../profesor/profesores.entity.js';
import { Parcial } from '../parcial/parcial.entity.js';
//import { Alumno } from '../alumno/alumnos.entity.js';
import { Tp } from '../tp/tps.entity.js';
import { Material } from '../material/material.entity.js';
import { differenceInDays } from 'date-fns';
import { parse } from 'path';
import {Usuario} from '../usuario/usuario.entity.js';
import { Inscripcion } from '../inscripcion/inscripciones.entity.js';
import jwt from 'jsonwebtoken';
import { isBefore } from 'date-fns';

const em = orm.em

function validateCurso(curso: Curso): boolean {
  if (!curso) {
      throw new Error("Los datos de curso son requeridos");
  }

  if (!curso.nombre || curso.nombre.trim() === "") {
      throw new Error("El campo nombre es requerido");
  }

 if (!(curso.fechaInicio instanceof Date) || isNaN(curso.fechaInicio.getTime())) {
    throw new Error("La fecha de inicio es requerida y debe ser una fecha válida");
  }

  if (!(curso.fechaFin instanceof Date) || isNaN(curso.fechaFin.getTime())) {
    throw new Error("La fecha de fin es requerida y debe ser una fecha válida");
  }
  if (!isBefore(curso.fechaInicio, curso.fechaFin)) {
    throw new Error("La fecha de inicio debe ser menor que la fecha de fin");
  }
  if (curso.cantCupos < 0) {
      throw new Error("El número de cupos debe ser mayor a 0");
  }

  if (!curso.descripcion || curso.descripcion.trim() === "") {
      throw new Error("La descripción es requerida");
  }


 if (curso.dias) {
    validarDia(curso.dias);  
  }


  return true;
}

function validarDia(dia: string): void {
  const diaLower=dia.toLocaleLowerCase()
  const diasValidos = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  if (!diasValidos.includes(diaLower)) {
      throw new Error("El día ingresado no es válido. Debe ser un día de lunes a sábado.");
  }
}

function sanitizeCursoInput(
  req: Request,
  res: Response,
  next: NextFunction
) {

  const fechaInicio = req.body.fechaInicio;
  const fechaFin = req.body.fechaFin;

  if (!fechaInicio.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return res.status(400).json({ message: "La fecha de inicio no tiene el formato adecuado" });
  }
  if (!fechaFin.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return res.status(400).json({ message: "La fecha de fin no tiene el formato adecuado" });
  }

  const parsedFechaInicio = new Date(fechaInicio);
  const parsedFechaFin = new Date(fechaFin);


  const duracionDias = differenceInDays(parsedFechaFin, parsedFechaInicio);


  req.body.sanitizedInput = {
    descripcion: req.body.descripcion,
    nombre: req.body.nombre,
    cantCupos: req.body.cantCupos,
    duracion: `${duracionDias} días`,
    fechaInicio: parsedFechaInicio,
    fechaFin: parsedFechaFin,
    horaInicio: req.body.horaInicio,
    horaFin: req.body.horaFin,
    dias: req.body.dias,
    profesorId: req.body.profesorId, 
    parcialId: req.body.parcialId,
    tpId:req.body.tpId,
    materialId: req.body.materialId,

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
    const cursos = await em.find(Curso, {}, {populate: ['profesor']})
    res
      .status(200)
      .json({ message: 'Se han encontrado los cursos', data: cursos })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function getOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const curso = await em.findOneOrFail(Curso, { id }, { populate: ['profesor'] });
    const cursoToken = jwt.sign(
      {
        id: curso.id,
        nombre: curso.nombre,
        descripcion: curso.descripcion,
        cantCupos: curso.cantCupos,
        duracion: curso.duracion,
        fechaInicio: curso.fechaInicio,
        fechaFin: curso.fechaFin,
        horaInicio: curso.horaInicio,
        horaFin: curso.horaFin,
        dias: curso.dias,
        usuario: curso.profesor,
        parcialId: curso.parcial ? curso.parcial.id : null,
        tpId: curso.tp ? curso.tp.id : null,
      },
      process.env.JWT_SECRET || 'clave_secreta',
      { expiresIn: '1h' }
    );
    res.status(200).json({
      message: 'Se ha encontrado el curso',
      data: curso,
      token: cursoToken,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}


async function add(req: Request, res: Response) {
  try {
    const profesor = await em.findOne(Usuario, { id: req.body.sanitizedInput.profesorId });
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

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'El ID proporcionado no es válido.' });
    }
    const curso = await em.findOne(Curso, id);
    if (!curso) {
      return res.status(404).json({ message: `Curso con ID ${id} no encontrado.` });
    }
    em.assign(curso, req.body);
    await em.flush();
    res.status(200).json({ message: 'Se ha actualizado el curso', curso });
    
  } catch (error: any) {
    console.error('Error al actualizar el curso:', {
      message: error.message,
      stack: error.stack, 
      requestData: req.body,  
    });

    res.status(500).json({ 
      message: 'Error en el servidor al actualizar el curso.', 
      error: error.message 
    });
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

async function getMaterialesCurso(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID del curso inválido' });
    }

    const materiales = await em.find(Material, { curso: id });
    res.status(200).json({ message: 'Materiales encontrados', data: materiales });
  } catch (error) {
    console.error('Error al obtener materiales del curso:', error);
    res.status(500).json({ message: 'Error interno del servidor' });

  }
}

async function getInscripcionesCurso(req: Request, res: Response) {
  try {
    const cursoId = parseInt(req.params.id, 10);
    if (isNaN(cursoId)) {
      return res.status(400).json({ message: 'ID del curso inválido' });
    }
    const inscripciones = await em.find(Inscripcion, { curso: cursoId });
    res.status(200).json({ message: 'Inscripciones encontradas', data: inscripciones });
  } catch (error) {
    console.error('Error al obtener inscripciones del curso:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}


export {sanitizeCursoInput, getAll, getOne, add, update, remove, getMaterialesCurso,getInscripcionesCurso}
