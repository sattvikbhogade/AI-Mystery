import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import caseRoutes from './routes/caseRoutes.js';

const app=express();
app.disable('x-powered-by');
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);
const allowedOrigins = (process.env.CLIENT_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5173'))
  .split(',').map(origin => origin.trim()).filter(Boolean);
app.use(cors({origin(origin, callback) {
  if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
  return callback(new Error('Origin is not allowed by CORS.'));
}}));
app.use(express.json({limit:'20kb'}));
app.use('/api/',rateLimit({windowMs:15*60*1000,limit:100,standardHeaders:'draft-7',legacyHeaders:false}));
app.get('/api/health',(_req,res)=>res.json({success:true,message:'Mystery Room API is running',data:{status:'ok'}}));
app.use('/api/v1/cases',caseRoutes);
app.use((_req,res)=>res.status(404).json({success:false,message:'Route not found.',error:{code:'NOT_FOUND'}}));
app.use((error,_req,res,_next)=>{console.error(error);if(res.headersSent)return;res.status(error.status||500).json({success:false,message:error.status?error.message:'The server could not complete this request.',error:{code:error.status?'REQUEST_ERROR':'SERVER_ERROR'}})});
export default app;
