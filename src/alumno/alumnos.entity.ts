import { Entity, Property, OneToMany, ManyToMany, Collection, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "../Shared/baseEntity.entity.js";
//import { Inscripcion } from "../inscripcion/inscripciones.entity.js";


@Entity()
export class Alumno extends BaseEntity{
   
    @Property({ nullable: false })
    nombreCompleto!: string
  
    @Property({ nullable: false })
    mail!: string
  
    @Property({ nullable: false })
    telefono!: string 
  
    @Property({ nullable: false })
    contrasenia!: string


    
    /*@OneToMany(() => Inscripcion, (inscripcion) => inscripcion.alumno)
    inscripciones? = new Collection<Inscripcion>(this);*/
    
}
