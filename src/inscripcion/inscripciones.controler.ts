import {Request, Response, NextFunction} from 'express'; 
import { Inscripcion } from './inscripciones.entity.js';
import { orm } from "../Shared/orm.js";
import { Alumno } from '../alumno/alumnos.entity.js';
import { Curso } from '../curso/cursos.entity.js';
import { Certificado } from '../certificado/certificado.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';
import jwt from 'jsonwebtoken';

const em = orm.em


function sanitizeInscripcionInput(req: Request, res: Response, next: NextFunction) {

  req.body.sanitizedInput = {
    fechaInscripcion: req.body.fechaInscripcion ? new Date(req.body.fechaInscripcion) : new Date(), 
    usuarioId: req.body.usuarioId,
    cursoId: req.body.cursoId,
    certificadoId: req.body.certificadoId,
    rtaparcialId: req.body.rtaparcialId,
    rtatpId: req.body.rtatpId
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined || req.body.sanitizedInput[key] === null) {
      delete req.body.sanitizedInput[key];
    }
  });

  next();
}



async function getAll (req: Request,res: Response){
  try {
    const inscripciones = await em.find(Inscripcion, {}) 
    res
      .status(200)
      .json({ message: 'Se han encontrado las inscripciones', data: inscripciones })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function getOne (req: Request,res: Response){
  try {
      const id = Number.parseInt(req.params.id)
      const inscripcion = await em.findOneOrFail(Inscripcion, { id })
      const token = jwt.sign(
        { id: inscripcion.id, fechaInscripcion: inscripcion.fechaInscripcion, usuarioId: inscripcion.usuario ? inscripcion.usuario.id : null, cursoId: inscripcion.curso ? inscripcion.curso.id : null, certificadoId: inscripcion.certificado ? inscripcion.certificado.id : null, rtaparcialId: inscripcion.rtaparcial ? inscripcion.rtaparcial.id : null, rtatpId: inscripcion.rtatp ? inscripcion.rtatp.id : null },
        process.env.JWT_SECRET || 'mi_clave_secreta_para_inscripciones',
        { expiresIn: '1h' }
    );
  
      res.status(200).json({ message: 'Se encontró la inscripcion', inscripcionToken: token })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
}

async function add(req: Request, res: Response) {
  try {
    const usuario = await em.findOne(Usuario, { id: req.body.sanitizedInput.usuarioId });
    if (!usuario) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }
    const curso = await em.findOne(Curso, { id: req.body.sanitizedInput.cursoId });
    if (!curso) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }
    const inscripcionExistente = await em.findOne(Inscripcion, { usuario, curso});
    if (inscripcionExistente) {
      return res.status(400).json({ message: 'El alumno ya está inscrito en este curso' });
    }
    if (curso.cantCupos === 0) {
      return res.status(400).json({ message: 'No hay cupos disponibles para este curso' });
    }
    const inscripcion = em.create(Inscripcion, {
      ...req.body.sanitizedInput,
      usuario,
      curso
    });
    curso.cantCupos -= 1;
    await em.persistAndFlush([inscripcion, curso]);
    res
      .status(201)
      .json({ message: 'Inscripción ha sido creada', data: inscripcion });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const inscripcion = em.getReference(Inscripcion, id);

    if (!req.body.fechaInscripcion) {
      delete req.body.fechaInscripcion;
    }

    em.assign(inscripcion, req.body);

    await em.flush();
    res.status(200).json({ message: 'Se ha actualizado la inscripción' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const ide = Number.parseInt(req.params.id)
    const inscrip = em.getReference(Inscripcion, ide)

    const inscripcion = await em.findOne(Inscripcion, { id: ide }, { populate: ['usuario', 'curso'] });

    if (!inscripcion) {
      return res.status(404).json({ message: 'Inscripción no encontrada' });
    }

    const { usuario, curso } = inscripcion;

    await em.removeAndFlush(inscripcion);

    if (curso) {
      curso.cantCupos += 1;
      await em.persistAndFlush(curso);
    }

    res.status(200).json({ message: 'Inscripción eliminada exitosamente' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function getCursoDeInscripcion(req: Request, res: Response) {
  try {
    const inscripcionId = Number(req.params.id); 
    const cursoId = Number(req.params.cursoId); 

    if (isNaN(inscripcionId) || isNaN(cursoId)) {
      return res.status(400).json({ message: 'Los IDs proporcionados no son válidos' });
    }

    const inscripcion = await em.findOne(Inscripcion, { id: inscripcionId });

    if (!inscripcion) {
      return res.status(404).json({ message: 'Inscripción no encontrada' });
    }

    await em.populate(inscripcion, ['curso']);

    if (!inscripcion.curso) {
      return res.status(404).json({ message: 'La inscripción no tiene un curso asociado' });
    }

    if (inscripcion.curso.id !== cursoId) {
      return res.status(404).json({ message: 'Curso no encontrado para esta inscripción' });
    }

    return res.status(200).json(inscripcion.curso);
  } catch (error: any) {
    console.error('Error al obtener el curso de la inscripción:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}
async function getAlumnoDeInscripcion(req: Request, res: Response) {
  try {
    const inscripcionId = Number(req.params.id); 
    const alumnoId = Number(req.params.alumnoId); 

    if (isNaN(inscripcionId) || isNaN(alumnoId)) {
      return res.status(400).json({ message: 'Los IDs proporcionados no son válidos' });
    }

    const inscripcion = await em.findOne(Inscripcion, { id: inscripcionId });

    if (!inscripcion) {
      return res.status(404).json({ message: 'Inscripción no encontrada' });
    }

    await em.populate(inscripcion, ['usuario']);

    if (!inscripcion.usuario) {
      return res.status(404).json({ message: 'La inscripción no tiene un alumno asociado' });
    }

    if (inscripcion.usuario.id !== alumnoId) {
      return res.status(404).json({ message: 'Alumno no encontrado para esta inscripción' });
    }

    return res.status(200).json(inscripcion.usuario);
  } catch (error: any) {
    console.error('Error al obtener el alumno de la inscripción:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}
export {sanitizeInscripcionInput, getAll, getOne, add, update, remove, getCursoDeInscripcion, getAlumnoDeInscripcion}
