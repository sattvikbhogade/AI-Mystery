import mongoose from 'mongoose';
import Case from '../models/Case.js';
import Suspect from '../models/Suspect.js';
import Evidence from '../models/Evidence.js';
import Accusation from '../models/Accusation.js';
import { createCase, getJob, submitAccusation } from '../services/caseService.js';
import { createCaseSchema, accusationSchema } from '../validators/case.js';

const fail = (res, status, message, code) => res.status(status).json({ success: false, message, error: { code } });
function owner(req, res) { const id = req.get('x-owner-id'); if (!id || id.length > 80) { fail(res, 400, 'A browser owner identifier is required.', 'OWNER_REQUIRED'); return null; } return id; }
export async function create(req, res, next) {
  const ownerId = owner(req,res); if (!ownerId) return;
  const parsed = createCaseSchema.safeParse(req.body); if (!parsed.success) return fail(res,400,parsed.error.issues[0].message,'VALIDATION_ERROR');
  try { const item = await createCase({ ...parsed.data, ownerId }); res.status(202).json({ success:true,message:'Case generation started',data:{ case:{ _id:item._id,caseCode:item.caseCode,status:item.status,generationStatus:item.generationStatus } } }); } catch(error) { next(error); }
}
export async function list(req,res,next) {
  const ownerId=owner(req,res);if(!ownerId)return;
  try { const cases=await Case.find({ownerId}).sort({createdAt:-1}).select('-privateSolution -ownerId').lean();res.json({success:true,message:'Cases loaded',data:{cases}}); } catch(error){next(error)}
}
export async function getOne(req,res,next) {
  const ownerId=owner(req,res);if(!ownerId)return;
  if(!mongoose.isValidObjectId(req.params.id))return fail(res,404,'Case not found.','CASE_NOT_FOUND');
  try {
    const item=await Case.findOne({_id:req.params.id,ownerId}).select('+generationError').lean();if(!item)return fail(res,404,'Case not found.','CASE_NOT_FOUND');
    const job=await getJob(item._id);const accusation=await Accusation.findOne({caseId:item._id}).lean();
    const [suspects,evidence]=await Promise.all([Suspect.find({caseId:item._id}).select('-isCulprit').lean(),Evidence.find({caseId:item._id}).select('-isCritical -clueExplanation').lean()]);
    const publicCase={...item};delete publicCase.privateSolution;delete publicCase.ownerId;delete publicCase.generationError;
    let verdict=null;
    if(accusation){const culprit=await Suspect.findOne({caseId:item._id,suspectId:item.privateSolution?.culpritSuspectId}).select('+isCulprit').lean();verdict={isCorrect:accusation.isCorrect,selectedSuspect:{suspectId:accusation.selectedSuspectId,name:suspects.find(s=>s.suspectId===accusation.selectedSuspectId)?.name},culprit:{suspectId:culprit?.suspectId,name:culprit?.name,occupation:culprit?.occupation},solution:item.privateSolution};}
    res.json({success:true,message:'Case loaded',data:{case:publicCase,suspects,evidence,job:job?{status:job.status,currentStage:job.currentStage,progress:job.progress,error:job.status==='failed'?job.error:null,errorCode:job.status==='failed'?job.errorCode:null}:null,hasAccusation:Boolean(accusation),verdict}});
  }catch(error){next(error)}
}
export async function accuse(req,res,next){
  const ownerId=owner(req,res);if(!ownerId)return;
  if(!mongoose.isValidObjectId(req.params.id))return fail(res,404,'Case not found.','CASE_NOT_FOUND');
  const parsed=accusationSchema.safeParse(req.body);if(!parsed.success)return fail(res,400,parsed.error.issues[0].message,'VALIDATION_ERROR');
  try{const item=await Case.findOne({_id:req.params.id,ownerId}).select('+privateSolution');if(!item)return fail(res,404,'Case not found.','CASE_NOT_FOUND');if(item.generationStatus!=='completed')return fail(res,409,'This case is not ready for an accusation.','CASE_NOT_READY');const verdict=await submitAccusation({item,ownerId,...parsed.data});res.json({success:true,message:'Accusation submitted',data:{verdict}});}catch(error){if(error.code===11000)return fail(res,409,'An accusation has already been submitted for this case.','DUPLICATE_ACCUSATION');next(error)}
}
