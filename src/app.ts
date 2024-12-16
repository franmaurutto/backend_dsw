import { getApp } from "./appconfig.js";
import { syncSchema } from './Shared/orm.js';
import dotenv from 'dotenv';
dotenv.config();
const app=getApp()
const PORT = process.env.PORT || 3000;

await syncSchema();

app.listen(PORT, () => {
    console.log(`Server running on ${process.env.API_SERVER || 'http://localhost'}:${PORT}`);
});
