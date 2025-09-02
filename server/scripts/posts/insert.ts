import { db } from '../../config/database';
import { NewsPost } from '../types';

async function insertPost(): Promise<void> {
    try {
        const args: string[] = process.argv.slice(2);
        const titleArg = args.find(arg => arg.startsWith('--title='));
        const textArg = args.find(arg => arg.startsWith('--text='));
        
        if (!titleArg || !textArg) {
            console.error('Error: Please provide both --title and --text parameters');
            console.log('Usage: ts-node insert.ts --title="Post Title" --text="Post content"');
            return;
        }
        
        const title: string = titleArg.split('=')[1].replace(/['"]/g, '');
        const text: string = textArg.split('=')[1].replace(/['"]/g, '');
        
        if (!title.trim() || !text.trim()) {
            console.error('Error: Title and text cannot be empty');
            return;
        }
        
        const insertData: NewsPost = {
            title: title.trim(),
            text: text.trim(),
            created_date: new Date()
        };
        
        const [insertedPost]: NewsPost[] = await db('newsPosts')
            .insert(insertData)
            .returning('*');
        
        console.log('Post inserted successfully:');
        console.table([insertedPost]);
    } catch (error: any) {
        console.error('Error inserting post:', error.message);
    } finally {
        await db.destroy();
    }
}

insertPost();
