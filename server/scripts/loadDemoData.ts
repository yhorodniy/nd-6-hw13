import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { Post } from '../entities/Post';
import { Category } from '../entities/Category';
import bcrypt from 'bcrypt';
import * as readline from 'readline';
import { demoPosts, demoCategories } from '../data/demoData';

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

export async function questionDemoDataLoading(): Promise<void> {
    console.log('\n📊 Demo Data Loading Options:');
    console.log('1. Load demo data for posts');
    console.log('2. Skip demo data');

    const choice = await askQuestion('\nChoose an option: ');

    switch (choice) {
        case '1':
            await loadDemoData();
            break;
        case '2':
            console.log('⏭️ Skipping demo data...');
            break;
        default:
            console.log('⏭️ Invalid choice, skipping demo data...');
            break;
    }
}

async function loadDemoData() {
    try {
        await AppDataSource.initialize();
        console.log('✅ Database connected');

        const userRepository = AppDataSource.getRepository(User);
        const postRepository = AppDataSource.getRepository(Post);
        const categoryRepository = AppDataSource.getRepository(Category);

        // Create demo user
        const passwordHash = await bcrypt.hash('demo', 10);
        
        let demoUser = await userRepository.findOne({
            where: { email: 'demo@example.com' }
        });

        if (!demoUser) {
            demoUser = userRepository.create({
                email: 'demo@example.com',
                passwordHash
            });
            demoUser = await userRepository.save(demoUser);
            console.log('👤 Created demo user:', demoUser.email);
        }

        // Load categories
        for (const categoryData of demoCategories) {
            const existingCategory = await categoryRepository.findOne({
                where: { name: categoryData.name }
            });

            if (!existingCategory) {
                const category = categoryRepository.create(categoryData);
                await categoryRepository.save(category);
            }
        }
        console.log(`📁 Loaded ${demoCategories.length} categories`);

        // Load posts
        for (const postData of demoPosts) {
            const existingPost = await postRepository.findOne({
                where: { title: postData.title }
            });

            if (!existingPost) {
                const post = postRepository.create({
                    ...postData,
                    authorId: demoUser.id,
                    viewsCount: Math.floor(Math.random() * 500) + 50,
                    likesCount: Math.floor(Math.random() * 50) + 5,
                    readingTime: Math.ceil(postData.content.split(' ').length / 200),
                    publishedAt: postData.is_published ? new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000) : undefined
                });
                await postRepository.save(post);
            }
        }
        console.log(`📝 Loaded ${demoPosts.length} demo posts`);

        console.log('✅ Demo data loaded successfully!');
    } catch (error) {
        console.error('❌ Error loading demo data:', error);
    } finally {
        await AppDataSource.destroy();
    }
}

loadDemoData();
