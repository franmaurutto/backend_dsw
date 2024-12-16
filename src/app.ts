import { getApp } from "./appconfig.js";
import { syncSchema } from './Shared/orm.js';
import dotenv from 'dotenv';
dotenv.config();
const app=getApp()
const PORT = process.env.PORT || 3000;
const startServer = async () => {
    try {
      // Sincronizar el esquema de la base de datos
      await syncSchema();
      console.log('Esquema de la base de datos sincronizado exitosamente.');
  
      // Iniciar el servidor
      app.listen(PORT, () => {
        console.log(`Server running on ${process.env.API_SERVER || 'http://localhost'}:${PORT}`);
      });
    } catch (error) {
      console.error('Error al sincronizar el esquema de la base de datos:', error);
    }
  };
  
  startServer();
