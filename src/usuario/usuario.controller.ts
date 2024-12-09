import { Request, Response, NextFunction } from "express"
import { Usuario } from "./usuario.entity.js"
import { orm } from "../Shared/orm.js";
import { Inscripcion } from '../inscripcion/inscripciones.entity.js';

const em = orm.em
function validateUsuario(usuario: Usuario): boolean {
    if (!usuario) {
        throw new Error("Los datos de usuario son requeridos");
    }

    if (!usuario.nombreCompleto || usuario.nombreCompleto.trim() === "") {
        throw new Error("El campo nombre completo es requerido");
    }

    if (usuario.telefono && usuario.telefono.length !== 10) {
        throw new Error("El número de teléfono debe tener 10 caracteres");
    }

    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!usuario.mail || !emailPattern.test(usuario.mail)) {
        throw new Error("El mail no es válido");
    }

    if (!usuario.contrasenia || usuario.contrasenia.length < 4) {
        throw new Error("La clave es requerida y debe tener 4 o más caracteres");
    }

    return true;
}
  

  function sanitizeUsuarioInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
        nombreCompleto: req.body.nombreCompleto,
        mail: req.body.mail,
        telefono: req.body.telefono,
        contrasenia: req.body.contrasenia,
        rol:req.body.rol
    };

    Object.keys(req.body.sanitizedInput).forEach(key => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });

    validateUsuario(req.body.sanitizedInput);
    next();
}



async function findAll(req: Request, res: Response){
    try {
      const usuarios = await em.find(Usuario, {})
      res.status(200).json({ message: 'Se encontraron todos los usuarios', data: usuarios })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
    
  }
  async function findOne(req: Request, res: Response){
    try {
      const id = Number.parseInt(req.params.id)
      const usuario = await em.findOneOrFail(Usuario, { id })
      res.status(200).json({ message: 'Se encontró el usuario', data: usuario })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

  async function add(req: Request, res: Response) {
    try {
        const usuario = em.create(Usuario, {
            ...req.body.sanitizedInput,
        });

        await em.persistAndFlush(usuario);
        res.status(201).json({ message: 'Usuario ha sido creado', data: usuario });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

  async function update(req: Request, res: Response){
    try {
      const id = Number.parseInt(req.params.id)
      const usuario = em.getReference(Usuario, id)
      em.assign(usuario, req.body)
      await em.flush()
      res.status(200).json({ message: 'usuario actualizado' })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  async function remove(req: Request, res: Response){
    try {
      const id = Number.parseInt(req.params.id)
      const usuario = em.getReference(Usuario, id)
      await em.removeAndFlush(usuario)
      res.status(200).send({ message: 'usuario eliminado' })
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

        // Buscar el usuario según el correo, ahora sin la validación de dominio
        const usuario = await em.findOne(Usuario, { mail }, { populate: ['cursos'] });

        if (!usuario || usuario.contrasenia !== contrasenia) {
            return res.status(401).json({ message: 'Correo o contraseña incorrecta' });
        }

        res.status(200).json({ message: 'Inicio de sesión exitoso', data: usuario });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

  

  async function getCursosProfesor(req: Request, res: Response) {
    const usuarioId = parseInt(req.params.id, 10);

    try {
      if (isNaN(usuarioId)) {
        return res.status(400).json({ message: 'ID de usuario inválido' });
      }

      const profesor = await em.findOne(Usuario, usuarioId, { populate: ['cursos'] });
    
      if (!profesor) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const cursos = profesor.cursos.getItems(); 
      return res.status(200).json({ message: 'Cursos del profesor encontrados', data: cursos });

    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: 'Error al obtener los cursos del profesor' });
    }
  }
  async function getInscripcionesAlumno(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID de alumno inválido' });
      }
  
      const inscripciones = await em.find(Inscripcion, { usuario: id });
      res.status(200).json({ message: 'Inscripciones encontradas', data: inscripciones });
    } catch (error) {
      console.error('Error al obtener inscripciones del alumno:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

export {sanitizeUsuarioInput, findAll, findOne, add, update, remove,findByEmail,getCursosProfesor, getInscripcionesAlumno}