import { Entity, Property, OneToMany, ManyToMany, Collection, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "../Shared/baseEntity.entity.js";
import { Inscripcion } from "../inscripcion/inscripciones.entity.js";
import { Curso } from "../curso/cursos.entity.js";

@Entity()
export class Alumno extends BaseEntity{
   
    @Property({ nullable: false })
    nombreCompleto!: string
  
    @Property({ nullable: false })
    mail!: string
  
    @Property({ nullable: false })
    telefono!: string //ver si puede funcionar como number
  
    @Property({ nullable: false })
    contrasenia!: string

    @ManyToMany(()=>Curso, (curso)=>curso.alumnos, {
        cascade:[Cascade.ALL],
    })
    cursos = new Collection<Curso>(this)

    /*@OneToMany(() => Inscripcion, (inscripcion) => inscripcion.alumno)
    inscripciones = new Collection<Inscripcion>(this);*/
    
}
