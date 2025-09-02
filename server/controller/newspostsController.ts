import { Request, Response, NextFunction } from 'express';
import { PostsService } from '../services/postsService';
import { AuthenticatedRequest } from '../helpers/auth';
import { PostCreateRequest, PostUpdateRequest } from '../types/types';

const postsService = new PostsService();

export const getNewsPosts = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const page = parseInt(req.query.page as string) || 0;
        const size = parseInt(req.query.size as string) || 10;
        let category = req.query.category as string | undefined;
        if (category && category === 'All Genres') {
            category = undefined;
        }
        
        const authReq = req as AuthenticatedRequest;
        const userId = authReq.user?.id;

        const posts = await postsService.getAllPosts(page, size, category, userId);

        return res.status(200).json(posts);
    } catch (error) {
        next(error);
    }
};

export const getSinglePost = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: 'Post ID is required' });
        }

        const authReq = req as AuthenticatedRequest;
        const userId = authReq.user?.id;

        const post = await postsService.getPostById(id, userId);
        return res.status(200).json(post);
    } catch (error) {
        next(error);
    }
};

export const createPost = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        debugger;
        const authReq = req as AuthenticatedRequest;
        if (!authReq.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const postData: PostCreateRequest = req.body;
        const newPost = await postsService.createPost(postData, authReq.user.id);

        return res.status(201).json(newPost);
    } catch (error) {
        next(error);
    }
};

export const updatePost = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const authReq = req as AuthenticatedRequest;
        if (!authReq.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: 'Post ID is required' });
        }

        const postData: PostUpdateRequest = req.body;
        const updatedPost = await postsService.updatePost(id, postData, authReq.user.id);

        return res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
};

export const deletePost = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const authReq = req as AuthenticatedRequest;
        if (!authReq.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: 'Post ID is required' });
        }

        await postsService.deletePost(id, authReq.user.id);

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const categories = await postsService.getCategories();
        return res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};

export const triggerError = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const error = new Error('This is a test error');
    next(error);
};
