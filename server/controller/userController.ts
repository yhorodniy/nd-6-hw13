import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/userService";
import { AuthenticatedRequest } from "../helpers/auth";
import { ValidationError, AuthServiceError } from "../helpers/errors";

const userService = new UserService();

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { email, password, confirmPassword } = req.body;

        if (!email || !password || !confirmPassword) {
            throw new ValidationError('Email, password, and confirmPassword are required');
        }

        if (password !== confirmPassword) {
            throw new ValidationError('Passwords do not match');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new ValidationError('Invalid email format');
        }

        if (password.length < 6) {
            throw new ValidationError('Password must be at least 6 characters long');
        }

        const result = await userService.createUser({ email, password });

        return res.status(201).json({
            message: 'User created successfully',
            token: result.token,
            user: result.user
        });
    } catch (error) {
        next(error);
    }
}

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ValidationError('Email and password are required');
        }

        const result = await userService.loginUser(email, password);

        return res.status(200).json({
            token: result.token,
            user: result.user
        });
    } catch (error) {
        next(error);
    }
}

export const getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const authReq = req as AuthenticatedRequest;
        if (!authReq.user) {
            throw new AuthServiceError('User not authenticated', 401);
        }

        const user = await userService.getUserById(authReq.user.id);
        if (!user) {
            throw new AuthServiceError('User not found', 404);
        }

        return res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
}