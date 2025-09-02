import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const systemConfig = {
    client: 'pg',
    connection: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: 'postgres'
    }
};

async function createDatabaseIfNotExists(): Promise<void> {
    const targetDatabase = process.env.DB_NAME || 'nd_hw10';
    const systemDb = knex(systemConfig);
    
    try {
        console.log(`🔍 Checking if database "${targetDatabase}" exists...`);
        
        const result = await systemDb.raw(
            'SELECT 1 FROM pg_database WHERE datname = ?', 
            [targetDatabase]
        );
        
        if (result.rows.length === 0) {
            console.log(`📝 Creating database "${targetDatabase}"...`);
            
            await systemDb.raw(`CREATE DATABASE "${targetDatabase}"`);
            
            console.log(`✅ Database "${targetDatabase}" created successfully!`);
        } else {
            console.log(`✅ Database "${targetDatabase}" already exists.`);
        }
        
    } catch (error: any) {
        console.error('❌ Error creating database:', error.message);
        throw error;
    } finally {
        await systemDb.destroy();
    }
}

export { createDatabaseIfNotExists };

if (require.main === module) {
    createDatabaseIfNotExists()
        .then(() => {
            console.log('🎉 Database setup completed!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Database setup failed:', error.message);
            process.exit(1);
        });
}
