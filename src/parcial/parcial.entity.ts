import { Entity, Property, OneToMany, ManyToMany, Collection, Cascade, Rel, OneToOne } from "@mikro-orm/core";
import { BaseEntity } from "../Shared/baseEntity.entity.js";
import { Curso } from "../curso/cursos.entity.js";

@Entity()
export class Parcial extends BaseEntity{
    @OneToOne(() => Curso)
    curso?: Rel<Curso>
    @Property({ nullable: false })
    nroParcial!: number
  
    @Property({ nullable: false })
    fechaLimite!: string
  
    @Property({ nullable: false })
    consigna!: string
}