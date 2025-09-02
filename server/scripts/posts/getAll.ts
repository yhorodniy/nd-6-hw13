import { db } from '../../config/database';
import { NewsPost } from '../types';

async function getAllPosts(): Promise<void> {
    try {
        const posts: NewsPost[] = await db('newsPosts')
            .select('*')
            .orderBy('created_date', 'desc');
        
        if (posts.length === 0) {
            console.log('No posts found in the database.');
        } else {
            console.log('All posts:');
            console.table(posts);
        }
    } catch (error: any) {
        console.error('Error fetching posts:', error.message);
    } finally {
        await db.destroy();
    }
}

getAllPosts();
