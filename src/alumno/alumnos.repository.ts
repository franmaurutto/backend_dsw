
import { Repository } from "../Shared/repository.js";
import { Alumno } from "./alumnos.entity.js";

const alumnos = [
    new Alumno(
      'Juan Francisco Perez',
      'juan.perez@gmail.com',
      3413645543,
      'juanchopancho123',
      'a02b91bc-3769-4221-beb1-d7a3aeba7dad'//VERr
    ),
]

export class AlumnoRepository implements Repository <Alumno>{ 
    public findAll(): Alumno[] | undefined {
        return alumnos
    }
    public findOne(item: { identificador: string; }): Alumno | undefined {
        return alumnos.find((alumno) => alumno.id === item.identificador)
    }
    public add(item: Alumno): Alumno | undefined {
        alumnos.push(item)
        return item
    }
    public update(item: Alumno): Alumno | undefined {
        const alumnoIdx = alumnos.findIndex((alumno) => alumno.id === item.id)

        if (alumnoIdx !== -1) {
          alumnos[alumnoIdx] = { ...alumnos[alumnoIdx], ...item }
        }
        return alumnos[alumnoIdx]
    }
    public delete(item: { identificador: string; }): Alumno | undefined {
        const alumnoIdx = alumnos.findIndex((alumno) => alumno.id === item.identificador)

        if (alumnoIdx !== -1) {
          const deletedAlumnos = alumnos[alumnoIdx]
          alumnos.splice(alumnoIdx, 1)
          return deletedAlumnos}
    }
}