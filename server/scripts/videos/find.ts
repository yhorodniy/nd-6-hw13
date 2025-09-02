import { db } from '../../config/database';
import { Video } from '../types';

async function findVideos(): Promise<void> {
    try {
        const args: string[] = process.argv.slice(2);
        const searchArg = args.find(arg => arg.startsWith('--search='));

        const search = searchArg ? searchArg.split('=')[1] : '';

        const videos: Video[] = await db('videos')
            .select('*')
            .where('title', 'ilike', `%${search}%`)
            .orderBy('id', 'asc')

        if (videos.length === 0) {
            console.log('No videos found in the database.');
        } else {
            console.log('All videos:');
            console.table(videos);
        }
    } catch (error: any) {
        console.error('Error fetching videos:', error.message);
    } finally {
        await db.destroy();
    }
}

findVideos();
