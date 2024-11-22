import { Request, Response, NextFunction } from "express"
import { RtaTp } from "./rtaTp.entity.js";
import { orm } from "../Shared/orm.js";
import { Inscripcion } from "../inscripcion/inscripciones.entity.js";
import { Tp } from "../tp/tps.entity.js";


const em = orm.em

function validateRtaTp(rtaTp: RtaTp): boolean {
  if (!rtaTp) {
      throw new Error("Los datos del tp son requeridos");
    }
    return true;
  }

function sanitizeRtaTpInput(req: Request, res: Response, next: NextFunction){
    
    req.body.sanitizedInput = {
        rtaConsignaTP: req.body.rtaConsignaTP,
        inscripcionId: req.body.inscripcionId,
        tpId: req.body.tpId 
    }
    
    Object.keys(req.body.sanitizedInput).forEach(key=>{
        if (req.body.sanitizedInput[key]===undefined){
        delete req.body.sanitizedInput[key]
        }
    })

    validateRtaTp(req.body.sanitizedInput)

    next()
}

async function findAll(req: Request, res: Response){
    try {
      const rtaTps = await em.find(RtaTp, {})
      res.status(200).json({ message: 'Se encontraron todos las respuestas a los tp', data: rtaTps })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
    
  }
  async function findOne(req: Request, res: Response){
    try {
      const id = Number.parseInt(req.params.id)
      const rtaTp = await em.findOneOrFail(RtaTp, { id })
      res.status(200).json({ message: 'Se encontró la respuesta al tp', data: rtaTp })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

  async function add(req: Request, res: Response){
    try {
      const inscripcion = await em.findOne(Inscripcion, {id: req.body.sanitizedInput.inscripcionId})
      if (!inscripcion) {
        return res.status(404).json({ message: 'Inscripcion no encontrado' });
      }
      const tp= await em.findOne(Tp, {id: req.body.sanitizedInput.tpId})
      if (!tp) {
        return res.status(404).json({ message: 'Trabajo parctico no encontrado' });
      }
      const rtaTp = em.create(RtaTp, {
        ...req.body.sanitizedInput,
        inscripcion,
        tp})
      await em.persistAndFlush(rtaTp)
      res.status(201).json({ message: 'Respuesta al tp creada', data: rtaTp })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

  async function update(req: Request, res: Response){
    try {
      const id = Number.parseInt(req.params.id)
      const rtaTp = em.getReference(RtaTp, id)
      em.assign(rtaTp, req.body)
      await em.flush()
      res.status(200).json({ message: 'Respuesta al tp actualizada' })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  async function remove(req: Request, res: Response){
    try {
      const id = Number.parseInt(req.params.id)
      const rtaTp = em.getReference(RtaTp, id)
      await em.removeAndFlush(rtaTp)
      res.status(200).send({ message: 'Respuesta al tp eliminada' })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

export {sanitizeRtaTpInput, findAll, findOne, add, update, remove}
