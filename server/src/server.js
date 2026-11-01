import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/db.js';

const port=process.env.PORT||5000;
try{await connectDatabase();app.listen(port, '0.0.0.0', ()=>console.info(`Mystery Room API listening on ${port}`));}
catch(error){console.error(`Could not start server: ${error.message}`);process.exit(1)}
