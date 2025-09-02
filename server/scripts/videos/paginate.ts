import { db } from '../../config/database';
import { Video } from '../types';

async function paginateVideos(): Promise<void> {
    try {
        const args: string[] = process.argv.slice(2);
        const pageArg = args.find(arg => arg.startsWith('--page='));
        const sizeArg = args.find(arg => arg.startsWith('--size='));

        const page = pageArg ? parseInt(pageArg.split('=')[1]) : 1;
        const size = sizeArg ? parseInt(sizeArg.split('=')[1]) : 10;

        const videos: Video[] = await db('videos')
            .select('*')
            .orderBy('id', 'asc')
            .limit(size)
            .offset((page - 1) * size);

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

paginateVideos();
