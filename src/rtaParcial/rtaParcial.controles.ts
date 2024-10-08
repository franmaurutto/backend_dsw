import { Request, Response, NextFunction } from "express"
import { RtaParcial } from "./rtaParcial.entity.js";
import { orm } from "../Shared/orm.js";


const em = orm.em

function sanitizeRtaParcialInput(req: Request, res: Response, next: NextFunction){
    
    req.body.sanitizedInput = {
        rtaConsignaParcial: req.body. rtaConsignaParcial 
    }
    
    Object.keys(req.body.sanitizedInput).forEach(key=>{
        if (req.body.sanitizedInput[key]===undefined){
        delete req.body.sanitizedInput[key]
        }
    })


    next()
}

async function findAll(req: Request, res: Response){
    try {
      const rtaParciales = await em.find(RtaParcial, {})
      res.status(200).json({ message: 'Se encontraron todos las respuestas a los parciales', data: rtaParciales })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
    
  }
  async function findOne(req: Request, res: Response){
    try {
      const id = Number.parseInt(req.params.id)
      const rtaParcial = await em.findOneOrFail(RtaParcial, { id })
      res.status(200).json({ message: 'Se encontró la respuesta del parcial', data: rtaParcial })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  async function add(req: Request, res: Response){
    try {
      const rtaParcial = em.create(RtaParcial, req.body)
      await em.flush()
      res.status(201).json({ message: 'Respuesta al parcial creada', data: rtaParcial })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  async function update(req: Request, res: Response){
    try {
      const id = Number.parseInt(req.params.id)
      const rtaParcial = em.getReference(RtaParcial, id)
      em.assign(rtaParcial, req.body)
      await em.flush()
      res.status(200).json({ message: 'Respuesta al parcial actualizada' })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  async function remove(req: Request, res: Response){
    try {
      const id = Number.parseInt(req.params.id)
      const rtaParcial = em.getReference(RtaParcial, id)
      await em.removeAndFlush(rtaParcial)
      res.status(200).send({ message: 'Respuesta al parcial eliminada' })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

export {sanitizeRtaParcialInput, findAll, findOne, add, update, remove}
