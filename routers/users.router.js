import express from 'express';
import { login, register, verifyAccount } from '../controllers/users.controller.js';
import { login_validation, register_validation } from '../validations/users.validation.js';
import { handle_validation_results } from '../middlewares/handle_validation_result.js';
const router = express.Router();


router.route('/register').post(register_validation,handle_validation_results, register);
router.route('/verify/:vtoken/:uid').get(verifyAccount);
router.route('/login').post(login_validation ,login);

export default router;