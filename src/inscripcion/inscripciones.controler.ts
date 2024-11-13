import {Request, Response, NextFunction} from 'express'; 
import { Inscripcion } from './inscripciones.entity.js';
import { orm } from "../Shared/orm.js";
import { Alumno } from '../alumno/alumnos.entity.js';
import { Curso } from '../curso/cursos.entity.js';
import { Certificado } from '../certificado/certificado.entity.js';

const em = orm.em


function sanitizeInscripcionInput(req: Request, res: Response, next: NextFunction) {
  // Mostrar el cuerpo antes de la sanitización
  console.log('Body before sanitizing:', req.body);

  req.body.sanitizedInput = {
    fechaInscripcion: req.body.fechaInscripcion ? new Date(req.body.fechaInscripcion) : new Date(), // Si no se proporciona una fecha, usar la fecha actual
    alumnoId: req.body.alumnoId,
    cursoId: req.body.cursoId,
    certificadoId: req.body.certificadoId,
    rtaparcialId: req.body.rtaparcialId,
    rtatpId: req.body.rtatpId
  };

  // Limpiar los valores undefined del objeto
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined || req.body.sanitizedInput[key] === null) {
      delete req.body.sanitizedInput[key];
    }
  });

  next();
}



async function getAll (req: Request,res: Response){
  try {
    const inscripciones = await em.find(Inscripcion, {}) //, {populate: ['certificado', 'parciales', 'tps', 'rtaparcial', 'rtatp']} 
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
    const inscripcion = await em.findOneOrFail(Inscripcion, { id }) //, {populate: ['certificado', 'parciales', 'tps', 'rtaparcial', 'rtatp']} 
    res
      .status(200)
      .json({ message: 'Se ha encontrado la inscripcion', data: inscripcion })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  console.log(`inscripcion add req.body: ${JSON.stringify(req.body.sanitizedInput)}`);
  try {
    const alumno = await em.findOne(Alumno, { id: req.body.sanitizedInput.alumnoId });
    if (!alumno) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }
    const curso = await em.findOne(Curso, { id: req.body.sanitizedInput.cursoId });
    if (!curso) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }
    const inscripcionExistente = await em.findOne(Inscripcion, { alumno, curso});
    if (inscripcionExistente) {
      return res.status(400).json({ message: 'El alumno ya está inscrito en este curso' });
    }
    if (curso.cantCupos === 0) {
      return res.status(400).json({ message: 'No hay cupos disponibles para este curso' });
    }
    const inscripcion = em.create(Inscripcion, {
      ...req.body.sanitizedInput,
      alumno,
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

    // Si no se proporciona una nueva fecha, mantener la fecha existente
    if (!req.body.fechaInscripcion) {
      delete req.body.fechaInscripcion;
    }

    // Asignar los nuevos valores al objeto de inscripción
    em.assign(inscripcion, req.body);

    await em.flush();
    res.status(200).json({ message: 'Se ha actualizado la inscripción' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  console.log(`inscripcion remove req.body: ${JSON.stringify(req.body)}`);
  try {
    const ide = Number.parseInt(req.params.id)
    const inscrip = em.getReference(Inscripcion, ide)

    // Buscar la inscripción por inscripcionId y cargar los datos del alumno y curso
    const inscripcion = await em.findOne(Inscripcion, { id: ide }, { populate: ['alumno', 'curso'] });

    if (!inscripcion) {
      return res.status(404).json({ message: 'Inscripción no encontrada' });
    }

    const { alumno, curso } = inscripcion;

    // Eliminar la inscripción
    await em.removeAndFlush(inscripcion);

    // Volver a aumentar la cantidad de cupos en el curso, si existe
    if (curso) {
      curso.cantCupos += 1;
      await em.persistAndFlush(curso);
    }

    // Respuesta exitosa
    res.status(200).json({ message: 'Inscripción eliminada exitosamente' });
  } catch (error: any) {
    // Manejo de errores
    res.status(500).json({ message: error.message });
  }
}

async function getCursoDeInscripcion(req: Request, res: Response) {
  try {
    const inscripcionId = Number(req.params.id);  // Corregido
    const cursoId = Number(req.params.cursoId);  // Correcto
  // Convertir el cursoId de string a number

    // Verificar si ambos IDs son válidos
    if (isNaN(inscripcionId) || isNaN(cursoId)) {
      return res.status(400).json({ message: 'Los IDs proporcionados no son válidos' });
    }

    // Buscar la inscripción con el inscripcionId
    const inscripcion = await em.findOne(Inscripcion, { id: inscripcionId });

    if (!inscripcion) {
      return res.status(404).json({ message: 'Inscripción no encontrada' });
    }

    // Ahora que tenemos la inscripción, poblamos el curso asociado
    await em.populate(inscripcion, ['curso']);

    // Verificar si la inscripción tiene un curso y si el cursoId coincide
    if (!inscripcion.curso) {
      return res.status(404).json({ message: 'La inscripción no tiene un curso asociado' });
    }

    if (inscripcion.curso.id !== cursoId) {
      return res.status(404).json({ message: 'Curso no encontrado para esta inscripción' });
    }

    // Si todo es correcto, devolver el curso
    return res.status(200).json(inscripcion.curso);
  } catch (error: any) {
    console.error('Error al obtener el curso de la inscripción:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}
export {sanitizeInscripcionInput, getAll, getOne, add, update, remove, getCursoDeInscripcion}
