import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/db.js';
import dns from 'node:dns';

dns.setServers(['1.1.1.1', '8.8.8.8']);

const port=process.env.PORT||5000;
try{await connectDatabase();app.listen(port,()=>console.info(`Mystery Room API listening on ${port}`));}
catch(error){console.error(`Could not start server: ${error.message}`);process.exit(1)}
