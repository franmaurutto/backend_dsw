import {Request, Response, NextFunction} from 'express'; 
import { AlumnoRepository } from "./alumnos.repository.js";
import { Alumno } from './alumnos.entity.js';
const repository=new AlumnoRepository() 


const alumnos = [
    new Alumno(
      'Federico Diaz',
      'fedeprograma@hotmail.com',
      3415889546,
      'capofede11',
    ),
  ]


function sanitezeAlumnoInput(req: Request, res: Response, next :NextFunction) {
  
  req.body.sanitizedInput= {
    nombre_y_apellido: req.body.nombre_y_apellido,
    mail: req.body.mail,
    telefono: req.body.telefono,
    contrasenia: req.body.contrasenia,
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
  const identificador= req.params.id
  const alumno = repository.findOne({identificador})  
  if(!alumno){
    return res.status(404).json({Error: 'Alumno no encontrado'})
  } 
  return res.json(alumno)
}

function add (req:Request, res:Response) {
  const input= req.body.sanitizedInput 
  const alumnoInput = new Alumno(input.nombre_y_apellido, input.mail, input.telefono, input.contrasenia)
  const alumno = repository.add(alumnoInput) 
  return res.status(201).json({message: 'Alumno creado', data: alumno})
}

function update(req:Request, res:Response) {
  req.body.sanitizedInput.identificador=req.params.id
  const alumno= repository.update(req.body.sanitizedInput)

  if(!alumno){
    return res.status(404).json({message: 'Alumno no encontrado'})
  }
   return res.status(200).json({message: 'Alumno se actualizo con exito', data: alumnos})
}


function patch(req:Request, res:Response) {
  req.body.sanitizedInput.identificador=req.params.id
  const alumno= repository.update(req.body.sanitizedInput)

  if(!alumno){ 
    return res.status(404).json({message: 'Alumno no encontrado'})
  }
   return res.status(200).json({message: 'Alumno se actualizo con exito', data: alumnos})
}


function remove (req: Request, res: Response) {
  const identificador=req.params.id;
  const alumno =repository.delete({identificador});

  if (!alumno) {
    return res.status(404).json({ message: 'Alumno no encontrado' })
  } else {
    return res.status(200).json({ message: 'Alumno se ha eliminado correctamente' })
  }
}

export {sanitezeAlumnoInput, getAll, getOne, add, update, patch, remove }
