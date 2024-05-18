
import { Repository } from "../Shared/repository.js";
import { Curso } from "./cursos.entity.js";

const cursos = [
    new Curso(
      'Este curso de Python proporciona a los estudiantes las habilidades y conocimientos necesarios para codificar programas efectivos en Python y utilizarlo en una variedad de aplicaciones prácticas. Es una excelente opción para cualquier persona interesada en la programación, desde principiantes hasta profesionales que desean expandir su conjunto de habilidades.',
      'Curso de Python',
      25,
      '3 meses',
      '10 de marzo de 2025',
      '10 de junio 2025',
      '08:00 am',
      '10:00 am',
      ['Lunes', 'Miercoles', 'Viernes'],
      'a02b91bc-3769-4221-beb1-d7a3aeba7dad'//ver
    ),
]

export class CursoRepository implements Repository <Curso>{ 
    public findAll(): Curso[] | undefined {
        return cursos
    }
    public findOne(item: { identificador: string; }): Curso | undefined {
        return cursos.find((curso) => curso.identificador === item.identificador)
    }
    public add(item: Curso): Curso | undefined {
        cursos.push(item)
        return item
    }
    public update(item: Curso): Curso | undefined {
        const cursoIdx = cursos.findIndex((curso) => curso.identificador === item.identificador)

        if (cursoIdx !== -1) {
          cursos[cursoIdx] = { ...cursos[cursoIdx], ...item }
        }
        return cursos[cursoIdx]
    }
    public delete(item: { identificador: string; }): Curso | undefined {
        const cursoIdx = cursos.findIndex((curso) => curso.identificador === item.identificador)

        if (cursoIdx !== -1) {
          const deletedCursos = cursos[cursoIdx]
          cursos.splice(cursoIdx, 1)
          return deletedCursos}
    }
}