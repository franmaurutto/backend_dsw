import {Request, Response, NextFunction} from 'express'; 
import { CursoRepository } from "./cursos.repository.js";
import { Curso } from './cursos.entity.js';
const repository=new CursoRepository() 


const cursos = [
    new Curso(
      'Este curso de Python proporciona a los estudiantes las habilidades y conocimientos necesarios para codificar programas efectivos en Python y utilizarlo en una variedad de aplicaciones prácticas. Es una excelente opción para cualquier persona interesada en la programación, desde principiantes hasta profesionales que desean expandir su conjunto de habilidades.',
      'Curso de Python',
      25,
      '3 meses',
      '10 de marzo de 2025',
      '10 de junio 2025',
      '08:00 am',
      '10:00 am',
      ['Lunes', 'Miercoles', 'Viernes'],
      'a02b91bc-3769-4221-beb1-d7a3aeba7dad' //VERLO
    ),
  ]

function sanitezeCursoInput(req: Request, res: Response, next :NextFunction) {
  
  req.body.sanitizedInput= {
    descripcion: req.body.descripcion,
    nombre: req.body.nombre,
    cantCupos: req.body.cantCupos,
    duracion: req.body.duracion,
    fechaInicio: req.body.fechaInicio,
    fechaFin: req.body.fechaFin,
    horaInicio: req.body.horaInicio,
    horaFin: req.body.horaFin,
    dias: req.body.dias,
  }
  Object.keys(req.body.sanitizedInput).forEach((key) => { 
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

function getAll (req: Request,res: Response){
    res.status(200).json({Listado: repository.findAll()})
}

function getOne (req: Request,res: Response){
  const identificador= req.params.identificador 
  const curso = repository.findOne({identificador})  
  if(!curso){
    return res.status(404).json({Error: 'Curso no encontrado'})
  } 
  return res.json(curso)
}

function add (req:Request, res:Response) {
  const input= req.body.sanitizedInput 
  const cursoInput = new Curso(input.descripcion, input.nombre, input.cantCupos, input.duracion, input.fechaInicio, input.fechaFin, input.horaInicio, input.horaFin, input.dias)
  const curso = repository.add(cursoInput) 
  return res.status(201).json({message: 'Curso creado', data: curso})
}

function update(req:Request, res:Response) {
  req.body.sanitizedInput.identificador=req.params.identificador
  const curso= repository.update(req.body.sanitizedInput)

  if(!curso){
    return res.status(404).json({message: 'Curso no encontrado'})
  }
   return res.status(200).json({message: 'Curso se actualizo con exito', data: cursos})
}


function patch(req:Request, res:Response) {
  req.body.sanitizedInput.identificador=req.params.identificador
  const curso= repository.update(req.body.sanitizedInput)

  if(!curso){ 
    return res.status(404).json({message: 'Curso no encontrado'})
  }
   return res.status(200).json({message: 'Curso se actualizo con exito', data: cursos})
}


function remove (req: Request, res: Response) {
  const identificador=req.params.identificador;
  const curso =repository.delete({identificador});

  if (!curso) {
    return res.status(404).json({ message: 'Curso no encontrado' })
  } else {
    return res.status(200).json({ message: 'Curso se ha eliminado correctamente' })
  }
}

export {sanitezeCursoInput, getAll, getOne, add, update, patch, remove }
