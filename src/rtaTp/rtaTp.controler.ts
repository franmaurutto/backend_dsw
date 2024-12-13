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

async function getInscripcionDeRtaTp(req: Request, res: Response) {
  try {
    const rtaTpId = Number(req.params.id); 
    const inscripcionId = Number(req.params.inscripcionId); 

    if (isNaN(inscripcionId) || isNaN(rtaTpId)) {
      return res.status(400).json({ message: 'Los IDs proporcionados no son válidos' });
    }

    const rtaTp = await em.findOne(RtaTp, { id: rtaTpId });

    if (!rtaTp) {
      return res.status(404).json({ message: 'Inscripción no encontrada' });
    }

    await em.populate(rtaTp, ['inscripcion']);

    if (!rtaTp.inscripcion) {
      return res.status(404).json({ message: 'La rtaTp no tiene una inscripcion asociada' });
    }

    if (rtaTp.inscripcion.id !== inscripcionId) {
      return res.status(404).json({ message: 'inscripcion no encontrada para esta rtaTp' });
    }

    return res.status(200).json(rtaTp.inscripcion);
  } catch (error: any) {
    console.error('Error al obtener la inscripcion de la rtaTp:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
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

  async function add(req: Request, res: Response) {
    try {
      let inscripcion = null;
      if (req.body.inscripcionId) {
        inscripcion = await em.findOne(Inscripcion, { id: req.body.inscripcionId });
        if (!inscripcion) {
          return res.status(404).json({ message: 'Inscripción no encontrada' });
        }
      }
  
      let tp = null;
      if (req.body.tpId) {
        tp = await em.findOne(Tp, { id: req.body.tpId });
        if (!tp) {
          return res.status(404).json({ message: 'Tp no encontrado' });
        }
      }
  
      const rtaTp = em.create(RtaTp, {
        rtaConsignaTP: req.body.rtaConsignaTP,
        inscripcion: inscripcion || null,
        tp: tp || null,
      });
  
      await em.persistAndFlush(rtaTp);
      res.status(201).json({ message: 'Respuesta al trabajo práctico creada', data: rtaTp });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async function update(req: Request, res: Response) {
    try {
      const id = Number.parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }
      const rtaTp = await em.findOne(RtaTp, id);
      if (!rtaTp) {
        return res.status(404).json({ message: 'Respuesta no encontrada' });
      }
      rtaTp.rtaConsignaTP = req.body.rtaConsignaTP;
      await em.flush();
      res.status(200).json({ message: 'Respuesta actualizada correctamente', data: rtaTp });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar la respuesta' });
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

export {sanitizeRtaTpInput, findAll, findOne, add, update, remove, getInscripcionDeRtaTp}
