import { db } from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ValidationError, AuthServiceError } from '../helpers/errors';
import { LoginResponse, UserCreateRequest } from '../types/types';
import { BaseService } from './baseService';

export class UserService extends BaseService {
    private static readonly SALT_ROUNDS = 10;
    private static readonly JWT_SECRET = process.env.JWT_SECRET || '1234567890abcdef';
    private static readonly JWT_EXPIRES_IN = '7d';

    constructor() {
        super('users');
    }

    async createUser(userData: UserCreateRequest): Promise<LoginResponse> {
        try {
            const existingUser = await this.executeQuery(
                this.getQueryBuilder()
                    .select('id')
                    .where('email', userData.email)
                    .first()
            );

            if (existingUser) {
                throw new AuthServiceError('User with this email already exists', 409);
            }

            const passwordHash = await bcrypt.hash(userData.password, UserService.SALT_ROUNDS);

            const [user] = await this.executeQuery(
                this.getQueryBuilder()
                    .insert({
                        email: userData.email,
                        password_hash: passwordHash,
                        created_at: new Date(),
                        updated_at: new Date()
                    })
                    .returning(['id', 'email'])
            );

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
            throw new AuthServiceError(`Failed to create user: ${error.message}`, 500, error);
        }
    }

    async loginUser(email: string, password: string): Promise<LoginResponse> {
        try {
            const user = await this.executeQuery(
                this.getQueryBuilder()
                    .select('id', 'email', 'password_hash')
                    .where('email', email)
                    .first()
            );

            if (!user) {
                throw new AuthServiceError('Invalid email or password', 401);
            }

            const isPasswordValid = await bcrypt.compare(password, user.password_hash);

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
            const user = await this.executeQuery(
                this.getQueryBuilder()
                    .select('id', 'email', 'created_at', 'updated_at')
                    .where('id', id)
                    .first()
            );

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
