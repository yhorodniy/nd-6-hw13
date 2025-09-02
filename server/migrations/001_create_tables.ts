import { db } from '../config/database';
import { Knex } from 'knex';
import * as readline from 'readline';
import bcrypt from 'bcrypt';
import { demoPosts, demoCategories } from '../data/demoData';
import { UserService } from '../services/userService';

const userService = new UserService();

function askQuestion(question: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.toLowerCase());
        });
    });
}

async function loadDemoData(): Promise<void> {
    console.log('\n📊 Demo Data Loading Options:');
    console.log('1. Load demo data for posts');
    console.log('2. Skip demo data');

    const choice = await askQuestion('\nChoose an option: ');

    switch (choice) {
        case '1':
            await loadPostsData();
            break;
        case '2':
            console.log('⏭️ Skipping demo data...');
            break;
        default:
            console.log('⏭️ Invalid choice, skipping demo data...');
            break;
    }
}

async function loadPostsData(): Promise<void> {
    try {
        console.log('📝 Loading demo data for posts...');

        const { user } = await userService.createUser({
            email: 'demo@example.com',
            password: 'demo'
        });

        console.log('👤 Created demo user:', user.email);

        for (const post of demoPosts) {
            await db('posts').insert({
                ...post,
                author_id: user.id,
                views_count: Math.floor(Math.random() * 500) + 50,
                likes_count: Math.floor(Math.random() * 50) + 5,
                reading_time: Math.ceil(post.content.split(' ').length / 200),
                created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                updated_at: new Date(),
                published_at: post.is_published ? new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000) : null
            });
        }
        
        console.log(`✅ Loaded ${demoPosts.length} demo posts to posts table`);
    } catch (error: any) {
        console.error('❌ Error loading posts demo data:', error.message);
    }
}

async function up(): Promise<void> {
    await db.schema.createTable('users', (table: Knex.CreateTableBuilder) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.string('email').unique().notNullable();
        table.string('password_hash').notNullable();
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());
    });

    await db.schema.createTable('categories', (table: Knex.CreateTableBuilder) => {
        table.increments('id').primary();
        table.string('name').unique().notNullable();
        table.text('description');
        table.string('slug');
        table.string('color');
        table.string('color_active');
        table.timestamp('created_at').defaultTo(db.fn.now());
    });

    await db('categories').insert(demoCategories);

    await db.schema.createTable('posts', (table: Knex.CreateTableBuilder) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.string('title').notNullable();
        table.text('content').notNullable();
        table.text('excerpt');
        table.string('image');
        table.string('category');
        table.specificType('tags', 'text[]');
        table.uuid('author_id').references('id').inTable('users').onDelete('CASCADE');
        table.boolean('is_published').defaultTo(true);
        table.boolean('is_featured').defaultTo(false);
        table.integer('views_count').defaultTo(0);
        table.integer('likes_count').defaultTo(0);
        table.string('slug').unique();
        table.string('meta_title');
        table.text('meta_description');
        table.integer('reading_time').defaultTo(1);
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());
        table.timestamp('published_at');
        table.index(['author_id']);
        table.index(['is_published']);
        table.index(['category']);
        table.index(['created_at']);
    });

    console.log('✅ All tables created successfully!');
    
    await loadDemoData();
}

async function down(): Promise<void> {
    await db.schema.dropTableIfExists('posts');
    await db.schema.dropTableIfExists('categories');
    await db.schema.dropTableIfExists('users');
    
    console.log('All tables dropped successfully!');
}

async function migrate(): Promise<void> {
    try {
        await up();
    } catch (error: any) {
        console.error('Migration failed:', error.message);
        await down();
    } finally {
        await db.destroy();
    }
}

migrate();
