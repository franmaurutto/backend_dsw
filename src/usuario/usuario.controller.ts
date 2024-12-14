import { Request, Response, NextFunction } from "express";
import { Usuario } from "./usuario.entity.js";
import { orm } from "../Shared/orm.js";
import { Inscripcion } from '../inscripcion/inscripciones.entity.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Console } from "console";

const em = orm.em;

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
        rol: req.body.rol
    };

    Object.keys(req.body.sanitizedInput).forEach(key => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });

    validateUsuario(req.body.sanitizedInput);
    next();
}

async function findAll(req: Request, res: Response) {
    try {
        const usuarios = await em.find(Usuario, {});
        res.status(200).json({ message: 'Se encontraron todos los usuarios', data: usuarios });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const usuario = await em.findOneOrFail(Usuario, { id });
        res.status(200).json({ message: 'Se encontró el usuario', data: usuario });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function findOneByEmail(req: Request, res: Response) {
    try {
      const {mail} = req.body;
      console.log(mail);
  
      if (!mail) {
        return res.status(400).json({ message: 'Faltan datos: mail' });
      }
  
      const usuario = await em.findOne(Usuario, { mail });
      res.status(200).json(usuario);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  


async function add(req: Request, res: Response) {
    try {

        const { nombreCompleto, mail, telefono, contrasenia, rol } = req.body.sanitizedInput;

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(contrasenia, salt);

        const usuario = em.create(Usuario, {
            nombreCompleto,
            mail,
            telefono,
            contrasenia: hashedPassword,
            rol
        });

        await em.persistAndFlush(usuario);
        res.status(201).json({ message: 'Usuario ha sido creado', data: usuario });
    } catch (error: any) {
        res.status(500).json({ message: error.message })
        console.log(error.message);
    }
}

async function update(req: Request, res: Response) {
    try {

        const id = Number.parseInt(req.params.id);
        const usuario = em.getReference(Usuario, id);
        const {contrasenia,...updatedData}=req.body


        em.assign(usuario, updatedData);
        await em.flush();

        const updatedUsuario = await em.findOne(Usuario, id);
        res.status(200).json(updatedUsuario);
        res.status(200).json({ message: 'Usuario actualizado' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const usuario = em.getReference(Usuario, id);
        await em.removeAndFlush(usuario);
        res.status(200).send({ message: 'Usuario eliminado' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function findByEmail(req: Request, res: Response) {
    try {

        const { mail, contrasenia } = req.body;

        if (!mail || !contrasenia) {
            return res.status(400).json({ message: 'Faltan datos: mail o contraseña' });
        }

        const usuario = await em.findOne(Usuario, { mail });

        if (!usuario) {
            console.log('error 1');
            return res.status(401).json({ message: 'Correo o contraseña incorrectos' })
            
        }

        const isPasswordValid = bcrypt.compareSync(contrasenia, usuario.contrasenia);
        if (!isPasswordValid) {
            console.log('error2');
            return res.status(401).json({ message: 'Correo o contraseña incorrectos' })
            
        }

        const token = jwt.sign(
            { id: usuario.id, mail: usuario.mail, rol: usuario.rol, telefono: usuario.telefono, contrasenia: usuario.contrasenia, nombreCompleto: usuario.nombreCompleto },
            process.env.JWT_SECRET || 'clave_secreta',
            { expiresIn: '1h' }
        );

        console.log(token)
        res.status(200).json({ message: 'Inicio de sesión exitoso', usuariotoken: token });
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

async function cambiarContrasenia(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id, 10); 
        console.log('ID recibido:', id); 
        console.log('Body recibido:', req.body);
        const { viejaContrasenia, nuevaContrasenia } = req.body; 

        if (!viejaContrasenia || !nuevaContrasenia) {
            return res.status(400).json({ message: 'Se requieren la contraseña actual y la nueva contraseña.' });
        }


        const usuario = await em.findOne(Usuario, { id });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }


        const esValida = bcrypt.compareSync(viejaContrasenia, usuario.contrasenia);
        if (!esValida) {
            return res.status(401).json({ message: 'La contraseña actual es incorrecta.' });
        }

        
        const salt = bcrypt.genSaltSync(10);
        const hashedNuevaContrasenia = bcrypt.hashSync(nuevaContrasenia, salt);

      
        usuario.contrasenia = hashedNuevaContrasenia;
        await em.persistAndFlush(usuario);

        res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });
    } catch (error: any) {
        console.error('Error al cambiar la contraseña:', error);
        res.status(500).json({message: 'Error interno del servidor.',
            error: error.message || error});
    }
}


export { sanitizeUsuarioInput, findAll, findOne, add, update, remove, findByEmail, getCursosProfesor, getInscripcionesAlumno, cambiarContrasenia, findOneByEmail };
