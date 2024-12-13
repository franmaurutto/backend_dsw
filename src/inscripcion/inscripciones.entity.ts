import { Entity, Property, ManyToMany,OneToOne, ManyToOne, Collection, Cascade, Rel, TinyIntType } from '@mikro-orm/core'
import { BaseEntity } from '../Shared/baseEntity.entity.js'
import { Usuario } from '../usuario/usuario.entity.js'
import { Curso } from '../curso/cursos.entity.js'
import { Certificado } from '../certificado/certificado.entity.js'
import { RtaParcial } from '../rtaParcial/rtaParcial.entity.js'
import { RtaTp } from '../rtaTp/rtaTp.entity.js'

@Entity()
export class Inscripcion extends BaseEntity{
    @Property({ nullable: false})
    fechaInscripcion!:Date
    @ManyToOne(()=> Usuario,{nullable:false})
    usuario!:Rel<Usuario>
    @ManyToOne(()=> Curso,{nullable:true})//cambiar nullable
    curso?: Rel<Curso>
    @OneToOne(() => Certificado, {nullable:true})
    certificado?: Certificado | null;
    @OneToOne(()=>RtaParcial,{nullable:true})
    rtaparcial?: RtaParcial | null;
    @OneToOne(() => RtaTp, { nullable: true })
    rtatp?: RtaTp;
}
