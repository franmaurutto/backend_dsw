import {Request, Response, NextFunction} from 'express'; 
import { Alumno } from './alumnos.entity.js';
import { orm } from '../Shared/orm.js';

const em = orm.em 
function validateAlumno(alumno: Alumno): boolean {
  if (!alumno) {
      throw new Error("Los datos de alumno son requeridos");
  }

  if (!alumno.nombreCompleto || alumno.nombreCompleto.trim() === "") {
      throw new Error("El campo nombre completo es requerido");
  }

  if (alumno.telefono && alumno.telefono.length !== 10) {
      throw new Error("El número de teléfono debe tener 10 caracteres");
  }

  const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (alumno.mail && !emailPattern.test(alumno.mail)) {
      throw new Error("El mail no es válido");
  }

  if (!alumno.contrasenia || alumno.contrasenia.length < 4) {
      throw new Error("La clave es requerida y debe tener 4 o más caracteres");
  }

  return true;
}

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
    await orm.em.persistAndFlush(alumno);
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

async function findByEmail(req: Request, res: Response) {
  try {
    console.log('Cuerpo recibido:', req.body); // Para verificar qué llega realmente

    const { mail, contrasenia } = req.body;

    if (!mail || !contrasenia) {
      return res.status(400).json({ message: 'Faltan datos: mail o contraseña' });
    }
    const alumno = await em.findOne(Alumno, { mail });
    console.log(alumno)
    if (!alumno|| alumno.contrasenia !== contrasenia) {
      return res.status(401).json({ message: 'Correo o contraseña incorrecta' });
    }

    res.status(200).json({ message: 'Inicio de sesión exitoso', data: alumno });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

function sanitizeAlumnoInput(req: Request, res: Response, next :NextFunction) {
  
  req.body.sanitizedInput= {
    nombreCompleto:req.body.nombreCompleto,
    mail: req.body.mail,
    telefono: req.body.mail,
    contrasenia:req.body.contrasenia,
  }
  
  Object.keys(req.body.sanitizedInput).forEach((key) => { 
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  validateAlumno(req.body.sanitizedInput);
  next()
}
export {findAll, findOne, add, update, remove, sanitizeAlumnoInput, findByEmail}
