import { db } from '../../config/database';
import { Video } from '../types';


async function insertVideo(): Promise<void> {
    try {
        const args: string[] = process.argv.slice(2);
        const titleArg = args.find(arg => arg.startsWith('--title='));
        const viewsArg = args.find(arg => arg.startsWith('--views='));
        const categoryArg = args.find(arg => arg.startsWith('--category='));

        if (!titleArg || !viewsArg || !categoryArg) {
            console.error('Error: Please provide all parameters');
            console.log('Usage: ts-node insertVideo.ts --title="Post Title" --views=100 --category="Category"');
            return;
        }
        
        const title: string = titleArg.split('=')[1].replace(/['"]/g, '');
        const views: string = viewsArg.split('=')[1].replace(/['"]/g, '');
        const category: string = categoryArg.split('=')[1].replace(/['"]/g, '');

        if (!title.trim() || !views || !category.trim()) {
            console.error('Error: Title, views, and category cannot be empty');
            return;
        }
        
        const insertData: Video = {
            title: title.trim(),
            views: parseFloat(views),
            category: category.trim()
        };

        const [insertedPost]: Video[] = await db('videos')
            .insert(insertData)
            .returning('*');
        
        console.log('Video inserted successfully:');
        console.table([insertedPost]);
    } catch (error: any) {
        console.error('Error inserting video:', error.message);
    } finally {
        await db.destroy();
    }
}

insertVideo();
