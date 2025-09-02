import { db } from '../../config/database';
import { NewsPost } from '../types';

async function deletePost(): Promise<void> {
    try {
        const args: string[] = process.argv.slice(2);
        const idArg = args.find(arg => arg.startsWith('--id='));
        
        if (!idArg) {
            console.error('Error: Please provide --id parameter');
            console.log('Usage: ts-node delete.ts --id=1');
            return;
        }
        
        const id: number = parseInt(idArg.split('=')[1]);
        
        if (isNaN(id)) {
            console.error('Error: ID must be a valid number');
            return;
        }
        
        const existingPost: NewsPost | undefined = await db('newsPosts')
            .where('id', id)
            .first();
        
        if (!existingPost) {
            console.log(`Post with ID ${id} not found.`);
            return;
        }
        
        const deletedCount: number = await db('newsPosts')
            .where('id', id)
            .del();
        
        if (deletedCount > 0) {
            console.log(`Post with ID ${id} deleted successfully.`);
            console.log('Deleted post was:');
            console.table([existingPost]);
        } else {
            console.log(`Failed to delete post with ID ${id}.`);
        }
        
    } catch (error: any) {
        console.error('Error deleting post:', error.message);
    } finally {
        await db.destroy();
    }
}

deletePost();
