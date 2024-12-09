/*import { Request, Response, NextFunction } from "express"
import { Profesor } from "./profesores.entity.js"
import { orm } from "../Shared/orm.js";
import { Curso } from "../curso/cursos.entity.js";

const em = orm.em
function validateProfesor(profesor: Profesor) {
  if (!profesor) {
      throw new Error("Los datos de profesor son requeridos");
  }
  if (!profesor.nombre_y_apellido || profesor.nombre_y_apellido.trim() === "") {
      throw new Error("El campo nombre completo es requerido");
  }
  if (profesor.telefono && profesor.telefono.length !== 10) {
      throw new Error("El número de teléfono debe tener 10 caracteres");
  }
  const patternEducatech = /^[^@\s]+@educatech\.com$/;
  if (profesor.mail && !patternEducatech.test(profesor.mail)) {
      throw new Error("El mail no es válido");
  }
  if (!profesor.contrasenia || profesor.contrasenia.length < 4) {
      throw new Error("La clave es requerida y debe tener 4 o más caracteres");
  }

  return true;
}

function sanitizeProfesorInput(req: Request, res: Response, next: NextFunction){
    
    req.body.sanitizedInput = {
        nombre_y_apellido: req.body.nombre_y_apellido,
        mail: req.body.mail,
        telefono: req.body.telefono,
        contrasenia: req.body.contrasenia,
        cursoId: req.body.cursoId,
        
    }
    
    Object.keys(req.body.sanitizedInput).forEach(key=>{
        if (req.body.sanitizedInput[key]===undefined){
        delete req.body.sanitizedInput[key]
        }
    })
    validateProfesor(req.body.sanitizedInput);
    next()
} 

async function findAll(req: Request, res: Response){
    try {
      const profesores = await em.find(Profesor, {})
      res.status(200).json({ message: 'Se encontraron todos los profesores', data: profesores })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
    
  }

  async function findOne(req: Request, res: Response){
    try {
      const id = Number.parseInt(req.params.id)
      const profesor = await em.findOneOrFail(Profesor, { id })
      res.status(200).json({ message: 'Se encontró el profesor', data: profesor })
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

    const profesor = em.create(Profesor, {
      ...req.body.sanitizedInput,
      curso,
    });
      await em.persistAndFlush(profesor);
      res.status(201).json({ message: 'Profesor ha sido creado', data: profesor });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  async function update(req: Request, res: Response){
    try {
      const id = Number.parseInt(req.params.id)
      const profesor = em.getReference(Profesor, id)
      const { cursos, ...otherFields } = req.body; 
      em.assign(profesor, otherFields);
      await em.flush()
      res.status(200).json({ message: 'profesor actualizado' })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  async function remove(req: Request, res: Response){
    try {
      const id = Number.parseInt(req.params.id)
      const profesor = em.getReference(Profesor, id)
      await em.removeAndFlush(profesor)
      res.status(200).send({ message: 'profesor eliminado' })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

  async function findByEmail(req: Request, res: Response) {
    try {

      const { mail, contrasenia } = req.body;

      if (!mail || !contrasenia) {
        return res.status(400).json({ message: 'Faltan datos: mail o contraseña' });
      }
      const profesor = await em.findOne(Profesor, { mail },{ populate: ['cursos'] });
      
      if (!profesor|| profesor.contrasenia !== contrasenia) {
        return res.status(401).json({ message: 'Correo o contraseña incorrecta' });
      }

      res.status(200).json({ message: 'Inicio de sesión exitoso', data: profesor });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async function getCursosProfesor(req: Request, res: Response) {
    const profesorId = parseInt(req.params.id, 10);

    try {
      if (isNaN(profesorId)) {
        return res.status(400).json({ message: 'ID de profesor inválido' });
      }

      const profesor = await em.findOne(Profesor, profesorId, { populate: ['cursos'] });
    
      if (!profesor) {
        return res.status(404).json({ message: 'Profesor no encontrado' });
      }

      const cursos = profesor.cursos.getItems(); 
      return res.status(200).json({ message: 'Cursos del profesor encontrados', data: cursos });

    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: 'Error al obtener los cursos del profesor' });
    }
  }

export {sanitizeProfesorInput, findAll, findOne, add, update, remove,findByEmail,getCursosProfesor}
*/