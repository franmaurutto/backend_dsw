import { Request, Response, NextFunction } from "express"
import { Certificado } from "./certificado.entity.js"
import { orm } from "../Shared/orm.js";


const em = orm.em

function sanitizeCertificadoInput(req: Request, res: Response, next: NextFunction){
    
    req.body.sanitizedInput = {
        descripcion: req.body.descripcion,
        fechaEmision: req.body.fechaEmision,
        
    }
    
    Object.keys(req.body.sanitizedInput).forEach(key=>{
        if (req.body.sanitizedInput[key]===undefined){
        delete req.body.sanitizedInput[key]
        }
    })
    next()
} //funcion q actua como un middleware, hay q hacer mas validaciones

async function findAll(req: Request, res: Response){
    try {
      const certificados = await em.find(Certificado, {})
      res.status(200).json({ message: 'Se encontraron todos los certificados', data: certificados })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
    
  }
  async function findOne(req: Request, res: Response){
    try {
      const id = Number.parseInt(req.params.id)
      const certificado = await em.findOneOrFail(Certificado, { id })
      res.status(200).json({ message: 'Se encontró el certificado', data: certificado })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  async function add(req: Request, res: Response){
    try {
      const certificado = em.create(Certificado, req.body)
      await em.flush()
      res.status(201).json({ message: 'Certificado creado', data: certificado })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  async function update(req: Request, res: Response){
    try {
      const id = Number.parseInt(req.params.id)
      const certificado = em.getReference(Certificado, id)
      em.assign(certificado, req.body)
      await em.flush()
      res.status(200).json({ message: 'Certificado actualizado' })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  async function remove(req: Request, res: Response){
    try {
      const id = Number.parseInt(req.params.id)
      const certificado = em.getReference(Certificado, id)
      await em.removeAndFlush(certificado)
      res.status(200).send({ message: 'Certificado eliminado' })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

export {sanitizeCertificadoInput, findAll, findOne, add, update, remove}

