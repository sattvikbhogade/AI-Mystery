import { Router } from 'express';
import { create, list, getOne, accuse } from '../controllers/caseController.js';
const router=Router();
router.post('/',create);
router.get('/',list);
router.get('/:id',getOne);
router.post('/:id/accusation',accuse);
export default router;
