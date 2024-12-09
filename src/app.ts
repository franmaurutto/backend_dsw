import 'reflect-metadata'
import express from 'express';
import { cursoRouter } from './curso/cursos.routes.js';
//import { alumnoRouter } from './alumno/alumnos.routes.js';
import { tpRouter } from './tp/tps.routes.js';
import { usuarioRouter } from './usuario/usuario.routes.js';
//import { profesorRouter } from './profesor/profesor.routes.js';
import { certificadoRouter } from './certificado/certificado.routes.js';
import { orm, syncSchema } from './Shared/orm.js';
import { RequestContext } from '@mikro-orm/core';
import { inscripcionRouter } from './inscripcion/inscripciones.routes.js';
import { rtaTpRouter } from './rtaTp/rtaTp.routes.js';
import { parcialRouter } from './parcial/parcial.routes.js';
import { rtaParcialRouter } from './rtaParcial/rtaParcial.routes.js';
import { materialRouter} from './material/materiales.routes.js'


import cors from 'cors'

const app = express() 

app.use(express.json()) 
app.use(cors({
  origin: 'http://localhost:3001', 
  methods: 'GET,POST,PUT,DELETE', 
  credentials: true 
}));


app.use((req, res, next) => {
    RequestContext.create(orm.em, next)
  })


app.use("/api/cursos", cursoRouter)
//app.use("/api/alumnos", alumnoRouter)
app.use("/api/tps", tpRouter)
//app.use("/api/profesores", profesorRouter)
app.use("/api/certificados", certificadoRouter)
app.use("/api/usuarios", usuarioRouter)
app.use("/api/inscripciones", inscripcionRouter)
app.use("/api/rtaTps", rtaTpRouter)
app.use("/api/parciales", parcialRouter)
app.use("/api/rtaParciales", rtaParcialRouter)
app.use("/api/materiales", materialRouter)

await syncSchema()
app.listen (3000, ()=>{
    console.log("Server running on http://localhost:3000/")
});

app.use((_, res) => {
    return res.status(404).json({Error:"Ruta no encontrada"});
})