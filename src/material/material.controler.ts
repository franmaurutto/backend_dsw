import { Request, Response, NextFunction } from "express"
import { Material } from "./material.entity.js";
import { orm } from "../Shared/orm.js";
import { Curso } from "../curso/cursos.entity.js";
import jwt from 'jsonwebtoken';

const em = orm.em

const SECRET_KEY = 'mi_clave_secreta_para_materiales';

/**
 * @param material Objeto con los datos del material.
 * @returns Token JWT generado.
 */

function generateMaterialToken(material: any): string {
  const { 
    id,
    titulo, 
    descripcion, 
    cursoId 
  } = material;

  return jwt.sign(
    { 
      id,
      titulo, 
      descripcion, 
      cursoId 
    },  
    SECRET_KEY,    
    { expiresIn: '1h' }  
  );
}

/**
 * @param material Objeto con los datos del material.
 * @returns Token JWT generado.
 */


function validateMaterial(material: Partial<Material>) {
  if (!material) {
      throw new Error("Los datos del material son requeridos");
  }

  if (material.titulo !== undefined && material.titulo.trim() === "") {
      throw new Error("El campo título es requerido");
  }

  if (material.descripcion !== undefined && material.descripcion.trim() === "") {
      throw new Error("El campo descripción es requerido");
  }

  return true;
}

function sanitizeMaterialInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      cursoId: req.body.cursoId,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined) {
          delete req.body.sanitizedInput[key];
      }
  });

  if (req.body.sanitizedInput.titulo || req.body.sanitizedInput.descripcion) {
      validateMaterial(req.body.sanitizedInput);
  }

  next();
} 

async function findAll(req: Request, res: Response){
    try {
      const materiales = await em.find(Material, {})
      res.status(200).json({ message: 'Se encontraron todos los materiales', data: materiales })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
    
  }
async function findOne(req: Request, res: Response){
  try {
    const id = Number.parseInt(req.params.id)
    const material = await em.findOneOrFail(Material, { id })
    const token = jwt.sign(
      { id: material.id, titulo: material.titulo, descripcion: material.descripcion, cursoId: material.curso ? material.curso.id : null },
      process.env.JWT_SECRET || 'mi_clave_secreta_para_materiales',
      { expiresIn: '1h' }
  );

    res.status(200).json({ message: 'Se encontró el material', materialToken: token })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
  async function add(req: Request, res: Response) {
    try {
       let curso = null;
      if (req.body.sanitizedInput.cursoId) {
      curso = await em.findOne(Curso, { id: req.body.sanitizedInput.cursoId });
        if (!curso) {
          return res.status(404).json({ message: 'Curso no encontrado' });
      }
    }

    const material = em.create(Material, {
      ...req.body.sanitizedInput,
      curso,
    });
      await em.persistAndFlush(material);
      res.status(201).json({ message: 'Material ha sido creado', data: material });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const material = await em.findOneOrFail(Material, { id });

        if (req.body.titulo !== undefined) material.titulo = req.body.titulo;
        if (req.body.descripcion !== undefined) material.descripcion = req.body.descripcion;

        if (req.body.curso === undefined) {
            material.curso = undefined;
        } else {
            const curso = await em.findOne(Curso, { id: req.body.curso });
            if (curso) {
                material.curso = curso;
            }
        }

        await em.persistAndFlush(material);
        res.status(200).json({ message: "Material actualizado", data: material });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

  
  
  async function remove(req: Request, res: Response){
    try {
      const id = Number.parseInt(req.params.id)
      const material = em.getReference(Material, id)
      await em.removeAndFlush(material)
      res.status(200).send({ message: 'Material eliminado' })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  async function findMatSinCurso(req: Request, res: Response) {
    try {
      const materiales = await em.find(Material, { curso: null }); 
  
      res.status(200).json({ message: 'Se encontraron todos los materiales sin curso asignado', data: materiales });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  async function addMaterialToCurso(req: Request, res: Response) {
    try {
      
      const materialId = parseInt(req.params.materialId, 10);
      const cursoId = parseInt(req.params.cursoId, 10);

      if (isNaN(materialId) || isNaN(cursoId)) {
        return res.status(400).json({ message: 'Material ID o Curso ID no válidos' });
      }

      const material = await em.findOneOrFail(Material, { id: materialId });
      if (!material) {
        return res.status(404).json({ message: "Material no encontrado" });
      }

      const curso = await em.findOneOrFail(Curso, { id: cursoId });
      if (!curso) {
        return res.status(404).json({ message: "Curso no encontrado" });
      }

      material.curso = curso;
      await em.persistAndFlush(material);
  
      res.status(200).json({ message: "Material agregado al curso correctamente", data: material });
    } catch (error: any) {
      console.error('Error en el servidor:', error);
      res.status(500).json({ message: error.message });
    }
}

export {sanitizeMaterialInput, findAll, findOne, add, update, remove, findMatSinCurso, addMaterialToCurso,generateMaterialToken}