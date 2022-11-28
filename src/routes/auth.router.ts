import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import validate from '../middlewares/validate';
import authValidation from '../validations/auth.validation';

const router = Router();

router.post('/register', validate(authValidation.register), register);
router.post('/login', validate(authValidation.login), login);

export default router;
