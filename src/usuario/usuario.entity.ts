import { Entity, Property, OneToMany, ManyToMany, Collection, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "../Shared/baseEntity.entity.js";
import { Inscripcion } from "../inscripcion/inscripciones.entity.js";
import { Curso } from "../curso/cursos.entity.js";

@Entity()
export class Usuario extends BaseEntity{
   
    @Property({ nullable: false })
    nombreCompleto!: string

    @Property({ nullable: false })
    rol!: string
  
    @Property({ nullable: false })
    mail!: string
  
    @Property({ nullable: false })
    telefono!: string 
  
    @Property({ nullable: false })
    contrasenia!: string

    @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.usuario, { nullable: true })
    inscripciones = new Collection<Inscripcion>(this);

    @OneToMany(() => Curso, (curso) => curso.profesor, {
        cascade: [Cascade.ALL],
        nullable: true
    })
    cursos = new Collection<Curso>(this);
    
}
