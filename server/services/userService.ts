import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ValidationError, AuthServiceError } from '../helpers/errors';
import { LoginResponse, UserCreateRequest } from '../types/types';
import { Repository } from 'typeorm';

export class UserService {
    private static readonly SALT_ROUNDS = 10;
    private static readonly JWT_SECRET = process.env.JWT_SECRET || '1234567890abcdef';
    private static readonly JWT_EXPIRES_IN = '7d';
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    async createUser(userData: UserCreateRequest): Promise<LoginResponse> {
        try {
            const existingUser = await this.userRepository.findOne({
                where: { email: userData.email }
            });

            if (existingUser) {
                throw new AuthServiceError('User with this email already exists', 409);
            }

            const passwordHash = await bcrypt.hash(userData.password, UserService.SALT_ROUNDS);

            const user = this.userRepository.create({
                email: userData.email,
                passwordHash: passwordHash
            });

            const savedUser = await this.userRepository.save(user);

            const token = jwt.sign(
                { 
                    userId: savedUser.id, 
                    email: savedUser.email 
                },
                UserService.JWT_SECRET,
                { expiresIn: UserService.JWT_EXPIRES_IN }
            );

            return {
                token,
                user: {
                    id: savedUser.id,
                    email: savedUser.email
                }
            };
        } catch (error: any) {
            if (error instanceof AuthServiceError) {
                throw error;
            }
            throw new AuthServiceError(`Failed to create user: ${error.message}`, 500, error);
        }
    }

    async loginUser(email: string, password: string): Promise<LoginResponse> {
        try {
            const user = await this.userRepository.findOne({
                where: { email },
                select: ['id', 'email', 'passwordHash']
            });

            if (!user) {
                throw new AuthServiceError('Invalid email or password', 401);
            }

            const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

            if (!isPasswordValid) {
                throw new AuthServiceError('Invalid email or password', 401);
            }

            const token = jwt.sign(
                { 
                    userId: user.id, 
                    email: user.email 
                },
                UserService.JWT_SECRET,
                { expiresIn: UserService.JWT_EXPIRES_IN }
            );

            return {
                token,
                user: {
                    id: user.id,
                    email: user.email
                }
            };
        } catch (error: any) {
            if (error instanceof AuthServiceError) {
                throw error;
            }
            throw new AuthServiceError(`Login failed: ${error.message}`, 500, error);
        }
    }

    async getUserById(id: string) {
        try {
            const user = await this.userRepository.findOne({
                where: { id },
                select: ['id', 'email', 'createdAt', 'updatedAt']
            });

            if (!user) {
                throw new AuthServiceError('User not found', 404);
            }

            return user;
        } catch (error: any) {
            if (error instanceof AuthServiceError) {
                throw error;
            }
            throw new AuthServiceError(`Failed to get user: ${error.message}`, 500, error);
        }
    }
}
