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
import jwt from 'jsonwebtoken';
const em = orm.em

const SECRET_KEY = 'mi_clave_secreta_para_cursos';

/**
 * Genera un token JWT para un curso.
 * @param curso Datos del curso.
 * @returns Token JWT.
 */
function generateCourseToken(curso: any): string {
  const { 
    id,
    nombre, 
    descripcion, 
    cantCupos, 
    duracion, 
    fechaInicio, 
    fechaFin, 
    horaInicio, 
    horaFin, 
    dias, 
    profesorId, 
    parcialId, 
    tpId, 
    materialId 
  } = curso;

  return jwt.sign(
    { 
      id,
      nombre, 
      descripcion, 
      cantCupos, 
      duracion, 
      fechaInicio, 
      fechaFin, 
      horaInicio, 
      horaFin, 
      dias, 
      profesorId, 
      parcialId, 
      tpId, 
      materialId 
    },  // Todos los datos del curso
    SECRET_KEY,    // Clave secreta
    { expiresIn: '1h' }  // El token expirará en 1 hora
  );
}

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
    const cursos = await em.find(Curso, {}, {populate: ['usuario']})
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
    const curso = await em.findOneOrFail(Curso, { id }, { populate: ['usuario'] });
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
        usuarioId: curso.usuario? curso.usuario.id :null,
        parcialId: curso.parcial ? curso.parcial.id : null,
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
    const usuario = await em.findOne(Usuario, { id: req.body.sanitizedInput.profesorId });
    if (!usuario) {
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
      usuario,
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
export {sanitizeCursoInput, getAll, getOne, add, update, remove, getMaterialesCurso,generateCourseToken }
