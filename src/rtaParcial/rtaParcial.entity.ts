import { Entity, Property, OneToMany, ManyToMany, Collection, Cascade, OneToOne, ManyToOne ,Rel} from "@mikro-orm/core";
import { BaseEntity } from "../Shared/baseEntity.entity.js";
import { Inscripcion } from "../inscripcion/inscripciones.entity.js";
import { Parcial } from "../parcial/parcial.entity.js"

@Entity()
export class RtaParcial extends BaseEntity{
   
    @Property({ nullable: false })
    rtaConsignaParcial!: string

    @OneToOne('Inscripcion', (inscripcion: Inscripcion) => inscripcion.rtaparcial, { cascade: [Cascade.ALL] })
    inscripcion?: Rel<Inscripcion>;

    @ManyToOne(() => Parcial)
    parcial!: Parcial; 


}