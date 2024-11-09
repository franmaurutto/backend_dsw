import { Entity, Property, OneToMany, ManyToMany, Collection, Cascade, OneToOne, ManyToOne,Rel } from "@mikro-orm/core";
import { BaseEntity } from "../Shared/baseEntity.entity.js";
import { Inscripcion } from "../inscripcion/inscripciones.entity.js";
import { Tp } from "../tp/tps.entity.js";

@Entity()
export class RtaTp extends BaseEntity{
   
    @Property({ nullable: false })
    rtaConsignaTP!: string

    @OneToOne('Inscripcion', (inscripcion: Inscripcion) => inscripcion.rtatp, { cascade: [Cascade.ALL] })
    inscripcion?: Rel<Inscripcion>;

    @ManyToOne(() => Tp)
    tp!: Tp; 

}