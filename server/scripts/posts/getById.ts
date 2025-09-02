import { db } from '../../config/database';
import { NewsPost } from '../types';

async function getPostById(): Promise<void> {
    try {
        console.log("Arguments: ", process.argv);
        const args: string[] = process.argv.slice(2);
        const idArg = args.find(arg => arg.startsWith('--id='));
        
        if (!idArg) {
            console.error('Error: Please provide --id parameter');
            console.log('Usage: ts-node getById.ts --id=1');
            return;
        }
        
        const id: number = parseInt(idArg.split('=')[1]);
        
        if (isNaN(id)) {
            console.error('Error: ID must be a valid number');
            return;
        }
        
        const post: NewsPost | undefined = await db('newsPosts')
            .where('id', id)
            .first();
        
        if (!post) {
            console.log(`Post with ID ${id} not found.`);
        } else {
            console.log('Post found:');
            console.table([post]);
        }
    } catch (error: any) {
        console.error('Error fetching post:', error.message);
    } finally {
        await db.destroy();
    }
}

getPostById();
