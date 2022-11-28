import { Router } from 'express';
import accountController from '../controllers/account.controller';
import validate from '../middlewares/validate';
import accountValidation from '../validations/account.validation';
import auth from '../middlewares/auth';

const router = Router();

router.post('/fund', auth.verifyToken, validate(accountValidation.fundAccount), accountController.fundAccount);
router.post('/transfer', auth.verifyToken, validate(accountValidation.transferFund), accountController.transferFund);
router.post('/withdraw', auth.verifyToken, validate(accountValidation.withdrawFund), accountController.withdrawFund);

export default router;
