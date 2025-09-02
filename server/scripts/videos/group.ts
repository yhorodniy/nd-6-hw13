import { db } from '../../config/database';
import { Video } from '../types';

export interface GroupedVideos {
    category: string;
    total_views: number;
}

async function groupVideos(): Promise<void> {
    try {
        const result = await db('videos')
            .select('category')
            .sum('views as total_views')
            .groupBy('category')
            .orderBy('category', 'asc');

        const videos: GroupedVideos[] = result.map(row => ({
            category: row.category,
            total_views: parseInt(row.total_views as string)
        }));

        if (videos.length === 0) {
            console.log('No videos found in the database.');
        } else {
            console.log('Views by category:');
            videos.forEach(video => {
                console.log(`${video.category} - ${video.total_views}`);
            });
            console.log('\nDetailed table:');
            console.table(videos);
        }
    } catch (error: any) {
        console.error('Error fetching videos:', error.message);
    } finally {
        await db.destroy();
    }
}

groupVideos();
