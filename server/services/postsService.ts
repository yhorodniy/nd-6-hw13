import { PaginatedResponse, Post, PostCreateRequest, PostUpdateRequest } from '../types/types';
import { db } from '../config/database';
import { BaseService } from './baseService';

export class PostsService extends BaseService {
    constructor() {
        super('posts');
    }

    private createSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/['\"""'']/g, '')
            .replace(/[^a-zа-яё0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    private calculateReadingTime(content: string): number {
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    }

    async getAllPosts(
        page: number = 0,
        size: number = 10,
        category?: string,
        userId?: string
    ): Promise<PaginatedResponse<Post>> {
        try {
            let baseQuery = this.getQueryBuilder();

            if (userId) {
                baseQuery = baseQuery.where(function() {
                    this.where('is_published', true)
                        .orWhere(function() {
                            this.where('is_published', false)
                                .andWhere('author_id', userId);
                        });
                });
            } else {
                baseQuery = baseQuery.where('is_published', true);
            }

            if (category) {
                baseQuery = baseQuery.where('category', category);
            }

            const countQuery = baseQuery.clone().count('* as count').first();
            const { count } = await this.executeQuery(countQuery);
            const total = parseInt(count as string, 10);

            const dataQuery = baseQuery.clone().select('*');
            
            const from = page * size;
            const data = await this.executeQuery(
                dataQuery
                    .orderBy('created_at', 'desc')
                    .limit(size)
                    .offset(from)
            );

            const totalPages = Math.ceil(total / size);

            return {
                data: data || [],
                pagination: {
                    page,
                    size,
                    total,
                    totalPages
                }
            };
        } catch (error: any) {
            throw new Error(`Failed to fetch posts: ${error.message}`);
        }
    }

    async getPostById(id: string, userId?: string): Promise<Post> {
        try {
            const post = await this.executeQuery(
                this.getQueryBuilder().where('id', id).first()
            );

            if (!post) {
                throw new Error('Post not found');
            }

            if (!post.is_published && post.author_id !== userId) {
                throw new Error('Post not found or not accessible');
            }

            if (post.is_published) {
                await this.executeQuery(
                    this.getQueryBuilder()
                        .where('id', id)
                        .update({ views_count: (post.views_count || 0) + 1 })
                );
                post.views_count = (post.views_count || 0) + 1;
            }

            return post;
        } catch (error: any) {
            throw new Error(`Failed to fetch post: ${error.message}`);
        }
    }

    async createPost(postData: PostCreateRequest, authorId: string): Promise<Post> {
        try {
            const slug = this.createSlug(postData.title);
            const readingTime = this.calculateReadingTime(postData.content);
            
            const insertData = {
                ...postData,
                author_id: authorId,
                slug,
                reading_time: readingTime,
                is_published: postData.is_published ?? true,
                is_featured: postData.is_featured ?? false,
                views_count: 0,
                likes_count: 0,
                created_at: new Date(),
                updated_at: new Date()
            };

            const [post] = await this.executeQuery(
                this.getQueryBuilder().insert(insertData).returning('*')
            );

            return post;
        } catch (error: any) {
            throw new Error(`Failed to create post: ${error.message}`);
        }
    }

    async updatePost(id: string, postData: PostUpdateRequest, authorId: string): Promise<Post> {
        try {
            const existingPost = await this.executeQuery(
                this.getQueryBuilder()
                    .select('author_id', 'title', 'content')
                    .where('id', id)
                    .first()
            );

            if (!existingPost) {
                throw new Error('Post not found');
            }

            if (existingPost.author_id !== authorId) {
                throw new Error('Unauthorized: You can only update your own posts');
            }

            const updateData: any = { 
                ...postData,
                updated_at: new Date()
            };

            if (postData.title && postData.title !== existingPost.title) {
                updateData.slug = this.createSlug(postData.title);
            }

            if (postData.content && postData.content !== existingPost.content) {
                updateData.reading_time = this.calculateReadingTime(postData.content);
            }

            const [updatedPost] = await this.executeQuery(
                this.getQueryBuilder()
                    .where('id', id)
                    .update(updateData)
                    .returning('*')
            );

            return updatedPost;
        } catch (error: any) {
            throw new Error(`Failed to update post: ${error.message}`);
        }
    }

    async deletePost(id: string, authorId: string): Promise<void> {
        try {
            const existingPost = await this.executeQuery(
                this.getQueryBuilder()
                    .select('author_id')
                    .where('id', id)
                    .first()
            );

            if (!existingPost) {
                throw new Error('Post not found');
            }

            if (existingPost.author_id !== authorId) {
                throw new Error('Unauthorized: You can only delete your own posts');
            }

            await this.executeQuery(
                this.getQueryBuilder().where('id', id).delete()
            );
        } catch (error: any) {
            throw new Error(`Failed to delete post: ${error.message}`);
        }
    }

    async getCategories(): Promise<string[]> {
        try {
            const categories = await this.executeQuery(
                db('categories').select('*').orderBy('name', 'asc')
            );
            return categories;
        } catch (error: any) {
            throw new Error(`Failed to fetch categories: ${error.message}`);
        }
    }
}
