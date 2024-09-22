import { Request, Response, NextFunction } from "express"
import { RtaTp } from "./rtaTp.entity.js";
import { orm } from "../Shared/orm.js";


const em = orm.em

function sanitizeRtaTpInput(req: Request, res: Response, next: NextFunction){
    
    req.body.sanitizedInput = {
        rtaConsignaTP: req.body. rtaConsignaTP  
    }
    
    Object.keys(req.body.sanitizedInput).forEach(key=>{
        if (req.body.sanitizedInput[key]===undefined){
        delete req.body.sanitizedInput[key]
        }
    })

    // validar tp e inscripcion¿?

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
      const rtaTp = em.create(RtaTp, req.body)
      await em.flush()
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
