import { Repository } from "../Shared/repository.js";
import { Profesor } from "./profesores.entity.js";

const profesores = [
    new Profesor(
        'Dante Aguirre',
        'danteaguirre@hotmail.com',
        3413456546,
        'profedante', 
        'a5e3d942-fca1-40c2-a4ae-14e4a1f70731',
    )
]


export class ProfesorRepository implements Repository<Profesor>{
    public findAll(): Profesor[] | undefined {
        return profesores
    }
    public findOne(item: { identificador: string; }): Profesor | undefined {
        return profesores.find((profesor)=> profesor.identificador===item.identificador)
    }

    public add(item: Profesor): Profesor | undefined {
        profesores.push(item)
        return item
    }
    public update(item: Profesor): Profesor | undefined {
        const profesorIdx = profesores.findIndex((profesor) => profesor.identificador === item.identificador);

        if (profesorIdx !== -1){
            profesores[profesorIdx] = { ...profesores[profesorIdx], ...item }
        }
        return profesores[profesorIdx]
    
    }
    public delete(item: { identificador: string; }): Profesor | undefined {
        const profesorIdx = profesores.findIndex((profesor) => profesor.identificador === item.identificador);

    if (profesorIdx !== -1) {
        const deletedProfesores= profesores[profesorIdx]
        profesores.splice(profesorIdx,1)
        return  deletedProfesores
    }
    }
}