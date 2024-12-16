import supertest from "supertest"
import { getApp } from "../appconfig.js"
const app = getApp()

describe('usuario', () => {
  describe('get usuario', () =>{
    describe('Si el usuario no existe', ()=>{
      it('deberia retornar 404',async ()=>{
        const usuarioId=123
        await supertest(app).get(`api/usuarios/${usuarioId}`).expect(404)
      })
    })
  })
})