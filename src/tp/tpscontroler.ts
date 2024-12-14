import {Request, Response, NextFunction} from 'express'; 
import { orm } from '../Shared/orm.js'
import { Tp } from './tps.entity.js';
import { Curso } from '../curso/cursos.entity.js';
import jwt from 'jsonwebtoken';
import { RtaTp } from "../rtaTp/rtaTp.entity.js";

const em=orm.em


async function getAll(req:Request,res:Response){
  try{
    const tps= await em.find(Tp,{})
    res.status(200).json({message: 'Se encontraron todos los tps ',data:tps})
  }
  catch(error:any){
    res.status(500).json({message:error.message})
  }
}

async function getOne(req:Request,res:Response){
  try{
    const id = Number.parseInt(req.params.id)
    const tp= await em.findOneOrFail(Tp,{id})
    res.status(200).json({message: 'se encontro el tp',data:tp})
  }catch(error:any){
    res.status(500).json({message:error.message})
  }
}

async function add(req: Request, res: Response) {
  
  try {
    const sanitizedInput = req.body.sanitizedInput;

    const curso = await em.findOne(Curso, { id: sanitizedInput.cursoId });
    if (!curso) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }
    const fechaLimite = new Date(req.body.sanitizedInput.fechaLimite);
    if (fechaLimite < curso.fechaInicio || fechaLimite > curso.fechaFin) {
      return res.status(400).json({
        message: `La fecha límite (${fechaLimite}) debe estar entre la fecha de inicio (${curso.fechaInicio}) y la fecha de fin (${curso.fechaFin}) del curso.`
      });
    }

    const tp = em.create(Tp, {
      ...sanitizedInput,
      curso
    });

    await em.persistAndFlush(tp);
    res.status(201).json({ message: "Tp creado", data: tp });
  } catch (error: any) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
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

function sanitizeTpInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    consigna: req.body.consigna,
    fechaLimite: req.body.fechaLimite,
    cursoId: req.body.cursoId,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  if (!req.body.sanitizedInput.cursoId) {
    return res.status(400).json({ message: "El campo cursoId es obligatorio." });
  }

  try {
    validateTp(req.body.sanitizedInput);
  } catch (error: any) {
    console.error("Error:", error.message);
    res.status(500).json({ message: error.message });
  }
  
  next();
}

function validateTp(tp: any): boolean {
  if (!tp || !tp.fechaLimite || !tp.consigna || !tp.cursoId) {
    throw new Error("Los datos del trabajo práctico son requeridos.");
  }
  return true;
}

async function getRtaTpdeTp(req: Request, res: Response) {

  try {
    const tpId = parseInt(req.params.tpId, 10);
    if (isNaN(tpId)) {
      return res.status(400).json({ message: 'ID del trabajo práctico inválido' });
    }

    const rtasTp = await em.find(RtaTp, { tp: tpId });
    res.status(200).json({
      message: rtasTp.length > 0 ? 'Respuestas encontradas' : 'No hay respuestas para este TP',
      data: rtasTp,
    });
  } catch (error) {
    console.error('Error al obtener respuestas del TP:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}



export {sanitizeTpInput, getAll, getOne, add, update, remove, getRtaTpdeTp }


