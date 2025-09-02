import { db } from '../config/database';

async function createTable(): Promise<void> {
    try {
        const newsPostsTableExists = await db.schema.hasTable('newsPosts');
        const videosTableExists = await db.schema.hasTable('videos');

        if (newsPostsTableExists && videosTableExists) {
            console.log('Tables "newsPosts" and "videos" already exist!');
            return;
        }

        if (!newsPostsTableExists) {
            await db.schema.createTable('newsPosts', (table) => {
                table.increments('id').primary();
                table.text('title').notNullable();
                table.text('text').notNullable();
                table.timestamp('created_date').defaultTo(db.fn.now());
            });
        }

        if (!videosTableExists) {
            await db.schema.createTable('videos', (table) => {
                table.increments('id').primary();
                table.text('title').notNullable();
                table.float('views');
                table.text('category');
            });
        }
        
        console.log('Tables "newsPosts" and "videos" created successfully!');
    } catch (error: any) {
        console.error('Error creating table:', error.message);
    } finally {
        await db.destroy();
    }
}

createTable();
