import { Entity, Property, OneToMany, ManyToMany, Collection, Cascade, Rel, OneToOne } from "@mikro-orm/core";
import { BaseEntity } from "../Shared/baseEntity.entity.js";
import { Curso } from "../curso/cursos.entity.js";
import { RtaParcial } from "../rtaParcial/rtaParcial.entity.js";

@Entity()
export class Parcial extends BaseEntity{
    @OneToOne(() => Curso, (curso) => curso.parcial)
    curso?: Rel<Curso>;     
  
    @Property({ nullable: false })
    fecha!: Date

    @Property({nullable:false})
    horaComienzo!: string

    @Property({nullable:false})
    horaFin!: string

    @Property({nullable:false})
    habilitado!: boolean
  
    @Property({ nullable: false })
    consigna!: string

    @OneToMany(() => RtaParcial, (rtaparcial) => rtaparcial.parcial, {
        cascade: [Cascade.ALL],
        nullable: true,
      })
      rtasParcial?: Collection<RtaParcial> | null;
    
}