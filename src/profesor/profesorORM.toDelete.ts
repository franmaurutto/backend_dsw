import { Cascade, Collection, Entity, ManyToMany, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import { Curso } from "../curso/cursos.entity.js";
import { BaseEntity } from "../Shared/baseEntity.entity.js";

@Entity()
export class profesor extends BaseEntity {
  @Property({ nullable: false, unique: true })
  nombre_y_apellido!: string

  @Property()
  mail!: string
  @Property()
  telefono!: number
  @Property()
  contrasenia!: string
  @OneToMany(() => Curso, (curso) => curso.profesor, { //se conecta con curso
    cascade: [Cascade.ALL],
  })
  cursos = new Collection<Curso>(this)
  }