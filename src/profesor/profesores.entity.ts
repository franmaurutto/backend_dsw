import { Entity, Property, OneToMany, ManyToMany, Collection, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "../Shared/baseEntity.entity.js";
import { Curso } from "../curso/cursos.entity.js";

@Entity()
export class Profesor extends BaseEntity{
 //   @OneToMany(() => Curso, { nullable: false })
 //   curso!: Curso
  
    @Property({ nullable: false })
    nombre_y_apellido!: string
  
    @Property({ nullable: false })
    mail!: string
  
    @Property({ nullable: false })
    telefono!: string
  
    @Property({ nullable: false })
    contrasenia!: string

    @OneToMany(() => Curso, (curso) => curso.profesor, { //se conecta con curso
        cascade: [Cascade.ALL],nullable: true 
    })
    cursos = new Collection<Curso>(this)
}

