import express, { Request, Response } from 'express';
import authRoutes from './auth.router';
import userRoutes from './user.router';
import accountRoutes from './account.router';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
	return res.send('Lendsqr 🚀 ');
});

router.use('/auth', authRoutes);

router.use('/user', userRoutes);

router.use('/account', accountRoutes);

export default router;
