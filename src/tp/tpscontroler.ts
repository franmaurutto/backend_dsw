import {Request, Response, NextFunction} from 'express'; 
import { TpRepository } from "./tps.repository.js";
import { Tp } from './tps.entity.js';
const repository=new TpRepository() 


const tps = [
    new Tp(
      'En este trabajo práctico, se debera desarrollar un programa en Python para gestionar el inventario de una pequeña tienda. El programa deberá leer los datos de los productos desde un archivo, permitir la manipulación del inventario (añadir, eliminar, y modificar productos), y guardar los cambios en el archivo',

      'a02b91bc-3769-4221-beb1-d7a3aeba7der' //VERLO
    ),
  ]

function sanitezeCursoInput(req: Request, res: Response, next :NextFunction) {
  
  req.body.sanitizedInput= {
    consigna: req.body.consigna,

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
  const tp = repository.findOne({identificador})  
  if(!tp){
    return res.status(404).json({Error: 'Tp no encontrado'})
  } 
  return res.json(tp)
}

function add (req:Request, res:Response) {
  const input= req.body.sanitizedInput 
  const tpInput = new Tp(input.consigna)
  const tp = repository.add(tpInput) 
  return res.status(201).json({message: 'Tp creado', data: tp})
}

function update(req:Request, res:Response) {
  req.body.sanitizedInput.identificador=req.params.identificador
  const tp= repository.update(req.body.sanitizedInput)

  if(!tp){
    return res.status(404).json({message: 'Tp no encontrado'})
  }
   return res.status(200).json({message: 'Tp se actualizo con exito', data: tps})
}


function patch(req:Request, res:Response) {
  req.body.sanitizedInput.identificador=req.params.identificador
  const tp= repository.update(req.body.sanitizedInput)

  if(!tp){ 
    return res.status(404).json({message: 'Tp no encontrado'})
  }
   return res.status(200).json({message: 'Tp se actualizo con exito', data: tps})
}


function remove (req: Request, res: Response) {
  const identificador=req.params.identificador;
  const tp =repository.delete({identificador});

  if (!tp) {
    return res.status(404).json({ message: 'Tp no encontrado' })
  } else {
    return res.status(200).json({ message: 'Tp se ha eliminado correctamente' })
  }
}

export {sanitezeCursoInput, getAll, getOne, add, update, patch, remove }