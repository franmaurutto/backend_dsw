import { Request, Response, NextFunction } from "express"
import { Parcial } from "./parcial.entity.js"; 
import { orm } from "../Shared/orm.js";


const em = orm.em

function sanitizeParcialInput(req: Request, res: Response, next: NextFunction){
    
    req.body.sanitizedInput = {
        nroParcial: req.body.nroParcial,
        fechaLimite: req.body.fechaLimite,
        consigna: req.body.consigna,
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
      const parciales = await em.find(Parcial, {})
      res.status(200).json({ message: 'Se encontraron todos los parciales', data: parciales })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
    
  }

async function findOne(req: Request, res: Response){
    try {
      const id = Number.parseInt(req.params.id)
      const parcial = await em.findOneOrFail(Parcial, { id })
      res.status(200).json({ message: 'Se encontró el parcial', data: parcial })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }}

  async function add(req: Request, res: Response){
    try {
      const parcial = em.create(Parcial, req.body)
      await em.flush()
      res.status(201).json({ message: 'parcial creado', data: parcial })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

async function update(req: Request, res: Response){
    try {
      const id = Number.parseInt(req.params.id)
      const parcial = em.getReference(Parcial, id)
      em.assign(parcial, req.body)
      await em.flush()
      res.status(200).json({ message: 'parcial actualizado' })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

async function remove(req: Request, res: Response){
    try {
      const id = Number.parseInt(req.params.id)
      const parcial = em.getReference(Parcial, id)
      await em.removeAndFlush(parcial)
      res.status(200).send({ message: 'parcial eliminado' })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

export {sanitizeParcialInput, findAll, findOne, add, update, remove}

