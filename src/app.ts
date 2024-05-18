import express, { NextFunction, Request, Response } from 'express' 
import { Curso } from './curso/cursos.entity.js';
import { CursoRepository } from './curso/cursos.repository.js'; 

const app = express() 
app.use(express.json()) 

const repository=new CursoRepository() 


const cursos = [
    new Curso(
      'Este curso de Python proporciona a los estudiantes las habilidades y conocimientos necesarios para codificar programas efectivos en Python y utilizarlo en una variedad de aplicaciones prácticas. Es una excelente opción para cualquier persona interesada en la programación, desde principiantes hasta profesionales que desean expandir su conjunto de habilidades.',
      'Curso de Python',
      25,
      '3 meses',
      '10 de marzo de 2025',
      '10 de junio 2025',
      '08:00 am',
      '10:00 am',
      ['Lunes', 'Miercoles', 'Viernes'],
      'a02b91bc-3769-4221-beb1-d7a3aeba7dad' //VERLO
    ),
  ]

function sanitezeCursoInput(req: Request, res: Response, next :NextFunction) {
  
  req.body.sanitizedInput= {
    descripcion: req.body.descripcion,
    nombre: req.body.nombre,
    cantCupos: req.body.cantCupos,
    duracion: req.body.duracion,
    fechaInicio: req.body.fechaInicio,
    fechaFin: req.body.fechaFin,
    horaInicio: req.body.horaInicio,
    horaFin: req.body.horaFin,
    dias: req.body.dias,
  }
  Object.keys(req.body.sanitizedInput).forEach((key) => { 
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

app.get ('/api/cursos', (req,res)=>{
    res.json({data: repository.findAll()})
})

app.get ('/api/cursos/:identificador', (req,res)=>{
  const identificador= req.params.identificador 
  const curso = repository.findOne({identificador})  
  if(!curso){
    res.status(404).send({message: 'Curso no encontrado'})
  } 
  res.json(curso)
}) 

app.post('/api/cursos', sanitezeCursoInput,(req,res)=>{
  const input= req.body.sanitizedInput 
  const cursoInput = new Curso(input.descripcion, input.nombre, input.cantCupos, input.duracion, input.fechaInicio, input.fechaFin, input.horaInicio, input.horaFin, input.dias)
  const curso = repository.add(cursoInput) 
  res.status(201).send({message: 'Curso creado', data: curso})
})


app.put('/api/cursos/:identificador', sanitezeCursoInput,(req,res)=> {
  req.body.sanitizedInput.identificador=req.params.identificador
  const curso= repository.update(req.body.sanitizedInput)

  if(!curso){
    return res.status(404).send({message: 'Curso no encontrado'})
  }
   return res.status(200).send({message: 'Curso se actualizo con exito', data: cursos})
})


app.patch('/api/cursos/:identificador', sanitezeCursoInput,(req,res)=> {
  req.body.sanitizedInput.identificador=req.params.identificador
  const curso= repository.update(req.body.sanitizedInput)

  if(!curso){ 
    return res.status(404).send({message: 'Curso no encontrado'})
  }
   return res.status(200).send({message: 'Curso se actualizo con exito', data: cursos})
})


app.delete('/api/cursos/:identificador', (req, res) => {
  const identificador=req.params.identificador
  const curso =repository.delete({identificador})

  if (!curso) {
    res.status(404).send({ message: 'Curso no encontrado' })
  } else {
    res.status(200).send({ message: 'Curso se ha eliminado correctamente' })
  }
})

app.use((_, res) => {
  return res.status(404).send({ message: 'Curso no encontrado' }) 
})

app.listen (3000, ()=>{
    console.log("Server running on http: //localhost:3000/")
});
