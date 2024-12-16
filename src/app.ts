import { getApp } from "./appconfig.js";
import { syncSchema } from './Shared/orm.js';
import dotenv from 'dotenv';
dotenv.config();

const app = getApp()

await syncSchema()
app.listen (process.env.API_PORT, ()=>{
    console.log(`Server running on ${process.env.API_SERVER}:${process.env.API_PORT}`)
});
