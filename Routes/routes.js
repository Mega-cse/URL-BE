// routes/urlRoutes.js

import express from 'express';
import { redirect, shorten,  } from '../Controller/urlcontroller.js';

const router = express.Router();
router.post('/shorten',shorten)
// router.get('/:redirect',redirect)
router.get('/:shortId', redirect);

export default router;
