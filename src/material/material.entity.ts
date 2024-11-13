import { Entity, Property, OneToMany, ManyToMany, Collection, Cascade, Rel, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "../Shared/baseEntity.entity.js";
import { Curso } from "../curso/cursos.entity.js";

@Entity()
export class Material extends BaseEntity{
  
    @Property({ nullable: false })
    descripcion!: string
  
    @Property({ nullable: false })
    titulo!: string
  
    @ManyToOne(()=> Curso, {nullable: false})
    curso?: Rel<Curso>

}