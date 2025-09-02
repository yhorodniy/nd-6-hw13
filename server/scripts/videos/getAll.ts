import { db } from '../../config/database';
import { Video } from '../types';

async function getAllVideo(): Promise<void> {
    try {
        const videos: Video[] = await db('videos')
            .select('*')
            .orderBy('id', 'asc');

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

getAllVideo();
