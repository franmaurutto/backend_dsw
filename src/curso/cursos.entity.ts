import { Entity, Property, ManyToMany,OneToOne, ManyToOne, Collection, Cascade, Rel } from '@mikro-orm/core'
import { BaseEntity } from '../Shared/baseEntity.entity.js'
import { Profesor } from '../profesor/profesores.entity.js'
import { Alumno } from '../alumno/alumnos.entity.js'
import { Tp } from '../tp/tps.entity.old.js'
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
    dias!: string []
    @ManyToOne(()=> Profesor, {nullable: false})
    profesor!: Rel<Profesor>
    @ManyToMany(()=>Alumno, (alumno)=>alumno.cursos, {
        cascade:[Cascade.ALL],
        owner:true
    })
    alumnos = new Collection<Alumno>(this)
    
   /* @OneToOne(()=>Parcial)
    parcial!: Parcial
    para cuando hagamos la clase Parcial
    @OneToOne(()=> Tp)
    tp!: Tp
    */
} //ver tema fecha