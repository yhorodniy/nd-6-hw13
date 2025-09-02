import { db } from '../../config/database';
import { Video } from '../types';

async function findVideos(): Promise<void> {
    try {
        const args: string[] = process.argv.slice(2);
        const topArg = args.find(arg => arg.startsWith('--top='));

        const top = topArg ? parseInt(topArg.split('=')[1]) : 5;

        const videos: Video[] = await db('videos')
            .select('*')
            .orderBy('views', 'desc')
            .limit(top);

        if (videos.length === 0) {
            console.log('No videos found in the database.');
        } else {
            console.log('Top videos:');
            console.table(videos);
        }
    } catch (error: any) {
        console.error('Error fetching videos:', error.message);
    } finally {
        await db.destroy();
    }
}

findVideos();
