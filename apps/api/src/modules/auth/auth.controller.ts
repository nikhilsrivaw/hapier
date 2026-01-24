import { Request, Response } from 'express';
import { authService } from './auth.service'

export const authController = {
    async register(req: Request, res: Response) {
        try {
            const { email, password, organizationName, firstName, lastName } = req.body;
            if (!email || !password || !organizationName || !firstName || !lastName) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            const result = await authService.register({
                email,
                password,
                organizationName,
                firstName,
                lastName,
            })
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });

        }
    },
    async changePassword(req: Request, res: Response) {
        try {
            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    error: 'Current password and new password are required'
                });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ error: 'New password must be at least 6 characters' });
            }

            const userId = (req as any).user.userId;
            const result = await authService.changePassword(userId, currentPassword, newPassword);
            res.json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },


    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required ' });
            }
            const result = await authService.login(email, password);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message });

        }
    }
}

