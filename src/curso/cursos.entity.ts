import { Entity, Property, ManyToMany,OneToOne, ManyToOne, Collection, Cascade, Rel, OneToMany } from '@mikro-orm/core'
import { BaseEntity } from '../Shared/baseEntity.entity.js'
import { Profesor } from '../profesor/profesores.entity.js'
import { Alumno } from '../alumno/alumnos.entity.js'
import { Tp } from '../tp/tps.entity.js'
import { Parcial } from '../parcial/parcial.entity.js'
import { Inscripcion } from '../inscripcion/inscripciones.entity.js'
import { Material } from '../material/material.entity.js'

@Entity()
export class Curso extends BaseEntity{
    @Property()
    descripcion!:string
    @Property({ nullable: false, unique: true }) 
    nombre!:string
    @Property({ nullable: false})
    cantCupos!:number
    @Property({ nullable: false})
    duracion!:string
    @Property({ nullable: false})
    fechaInicio!:string
    @Property({ nullable: false})
    fechaFin!:string
    @Property({ nullable: false})
    horaInicio!: string
    @Property({ nullable: false})
    horaFin!: string
    @Property({ nullable: false}) 
    dias!: string 
    @ManyToOne(()=> Profesor, {nullable: false})
    profesor?: Rel<Profesor>
    @OneToMany(()=> Inscripcion,(inscripcion)=> inscripcion.curso,{
    cascade:[Cascade.ALL]})
    inscripciones?: Collection<Inscripcion>;
    @OneToOne(() => Parcial, { nullable: true })
    parcial?:Rel<Parcial>
    @OneToMany(() => Material, (material) => material.profesor, { 
        cascade: [Cascade.ALL],nullable: true 
    })


   @OneToMany(()=> Tp,(tp)=> tp.curso,{
    cascade:[Cascade.ALL]})
   tps?: Collection<Tp>;
   
} //ver tema fecha