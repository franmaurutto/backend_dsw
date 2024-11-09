import {Request, Response, NextFunction} from 'express'; 
import { orm } from '../Shared/orm.js'
import { Tp } from './tps.entity.js';
import { Curso } from '../curso/cursos.entity.js';

const em=orm.em

async function getAll(req:Request,res:Response){
  try{
    const tps= await em.find(Tp,{},{populate:['curso']})
    res.status(200).json({message: 'Se encontraron todos los tps ',data:tps})
  }
  catch(error:any){
    res.status(500).json({message:error.message})
  }
}

async function getOne(req:Request,res:Response){
  try{
    const id = Number.parseInt(req.params.id)
    const tp= await em.findOneOrFail(Tp,{id},{populate:['curso']})
    res.status(200).json({message: 'se encontro el tp',data:tp})
  }catch(error:any){
    res.status(500).json({message:error.message})
  }
}

async function add(req:Request,res:Response){
  console.log(`tp add req.body: ${JSON.stringify(req.body.sanitizedInput)}`)
  try{
    const curso = await em.findOne(Curso, { id: req.body.sanitizedInput.cursoId });
    if (!curso) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }
    const tp= em.create(Tp,{
      ...req.body.sanitizedInput,
    curso})
    await em.persistAndFlush(tp)
    res.status(201).json({message:'Tp creado',data: tp})
  }catch(error:any){
    res.status(500).json({message: error.message})
  }
}

async function update(req:Request,res:Response){
  try{
    const id= Number.parseInt(req.params.id)
    const tpToUpdate= await em.findOneOrFail(Tp,{id})
    em.assign(tpToUpdate,req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({message:'Tp modificado', data:tpToUpdate})
  }catch(error:any){
    res.status(500).json({message: error.message})
  }
}

async function remove(req:Request,res:Response){
  try{
    const id= Number.parseInt(req.params.id)
    const tp= em.getReference(Tp,id)
    await em.removeAndFlush(tp)
    res.status(200).json({message:'Tp borrado'})
  }catch(error:any){
    res.status(500).json({message:error.message})
  }
}

function sanitizeTpInput(req: Request, res: Response, next :NextFunction) {
  
  req.body.sanitizedInput= {
    nroTp:req.body.nroTp,
    consigna: req.body.consigna,
    cursoId: req.body.cursoId}
  
  Object.keys(req.body.sanitizedInput).forEach((key) => { 
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

export {sanitizeTpInput, getAll, getOne, add, update, remove }


