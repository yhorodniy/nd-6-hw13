import { db } from '../../config/database';
import { Video } from '../types';

interface UpdateData {
    title?: string;
    views?: number | string;
    category?: string;
}

async function updateVideo(): Promise<void> {
    try {
        const args: string[] = process.argv.slice(2);
        const idArg = args.find(arg => arg.startsWith('--id='));
        
        if (!idArg) {
            console.error('Error: Please provide --id parameter');
            console.log('Usage: ts-node update.ts --id=1 --title="New Title" --views=100 --category="New Category"');
            return;
        }
        
        const id: number = parseInt(idArg.split('=')[1]);
        
        if (isNaN(id)) {
            console.error('Error: ID must be a valid number');
            return;
        }
        
        const existingPost: Video | undefined = await db('videos')
            .where('id', id)
            .first();
        
        if (!existingPost) {
            console.log(`Post with ID ${id} not found.`);
            return;
        }
        
        const updateData: UpdateData = {};
        const allowedFields: (keyof UpdateData)[] = ['title', 'views', 'category'];
        
        args.forEach(arg => {
            const [key, value] = arg.split('=');
            const fieldName = key.replace('--', '') as keyof UpdateData;
            
            if (allowedFields.includes(fieldName) && value) {
                updateData[fieldName] = value.replace(/['"]/g, '').trim();
            }
        });
        
        if (Object.keys(updateData).length === 0) {
            console.error('Error: No valid fields to update provided');
            console.log('Available fields: --title, --text');
            return;
        }
        
        for (const [field, value] of Object.entries(updateData)) {
            if (!value || !value.trim()) {
                console.error(`Error: ${field} cannot be empty`);
                return;
            }
            if (field === 'views') {
                const viewsNumber = Number(value);
                if (isNaN(viewsNumber) || viewsNumber < 0) {
                    console.error('Error: views must be a non-negative number');
                    return;
                }
                updateData.views = viewsNumber;
            }
        }
        
        const [updatedVideo]: Video[] = await db('videos')
            .where('id', id)
            .update(updateData)
            .returning('*');

        console.log('Video updated successfully:');
        console.table([updatedVideo]);

        console.log('Updated fields:', Object.keys(updateData).join(', '));
        
    } catch (error: any) {
        console.error('Error updating video:', error.message);
    } finally {
        await db.destroy();
    }
}

updateVideo();
