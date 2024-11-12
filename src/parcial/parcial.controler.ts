import { Request, Response, NextFunction } from "express"
import { Parcial } from "./parcial.entity.js"; 
import { orm } from "../Shared/orm.js";
import { Curso } from "../curso/cursos.entity.js";


const em = orm.em
function validateParcial(parcial: Parcial): boolean {
  if (!parcial) {
      throw new Error("Los datos de parcial son requeridos");
    }
    return true;
  }

function sanitizeParcialInput(req: Request, res: Response, next: NextFunction){
  const fecha = req.body.fecha;


  if (!fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return res.status(400).json({ message: "La fecha de inicio no tiene el formato adecuado" });
  }

  const parsedFecha = new Date(fecha);

    req.body.sanitizedInput = {
        fecha: parsedFecha,
        horaComienzo: req.body.horaComienzo,
        horaFin: req.body.horaFin,
        consigna: req.body.consigna,
        cursoId: req.body.cursoId,    
    }
    
    Object.keys(req.body.sanitizedInput).forEach(key=>{
        if (req.body.sanitizedInput[key]===undefined){
        delete req.body.sanitizedInput[key]
        }
    })
    validateParcial(req.body.sanitizedInput)
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
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const parcial = await em.findOneOrFail(Parcial, { id });
        res.status(200).json({ message: 'Se encontró el parcial', data: parcial });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }}

async function add(req: Request, res: Response) {
console.log(`parcial add req.body: ${JSON.stringify(req.body.sanitizedInput)}`);
  try {
    const curso = await em.findOne(Curso, { id: req.body.sanitizedInput.cursoId });

    if (!curso) {
      return res.status(404).json({ message: 'Curso no encontrado' });
  };

    const parcial = em.create(Parcial, {
      ...req.body.sanitizedInput,
      curso,  
      habilitado: false          
    });
    await em.persistAndFlush(parcial); // Primero guarda el parcial

    curso.parcial = parcial;
    await em.persistAndFlush(curso); 

    curso.parcial = parcial;  
    await em.flush();
    res.status(201).json({ message: 'Parcial ha sido creado', data: parcial });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  } }
  

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

