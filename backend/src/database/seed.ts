import { db } from './index';
import { users, articles } from './schema';
import bcrypt from 'bcrypt';

async function seed() {
  try {
    console.log('Seeding database...');

    // Create sample user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const sampleUser = await db.insert(users).values({
      email: 'demo@example.com',
      name: 'Demo User',
      passwordHash: hashedPassword,
    }).returning();

    console.log('Sample user created:', sampleUser[0]);

    // Create sample articles
    const sampleArticles = await db.insert(articles).values([
      {
        title: 'AI News Portal MVP Launch',
        content: 'We are excited to announce the launch of our AI News Portal MVP. This platform aggregates news from various sources and provides AI-powered summaries.',
        summary: 'AI News Portal MVP launched with news aggregation and AI summaries.',
        url: 'https://example.com/ai-news-portal-launch',
        publishedAt: new Date(),
        source: 'Tech Blog',
        category: 'Technology',
        isProcessed: true,
      },
      {
        title: 'The Future of AI in News Media',
        content: 'Artificial Intelligence is revolutionizing how we consume news. From automated summarization to personalized content delivery, AI is reshaping the media landscape.',
        summary: 'AI is transforming news media through automated summarization and personalized content.',
        url: 'https://example.com/future-ai-news',
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        source: 'AI Journal',
        category: 'AI',
        isProcessed: true,
      },
      {
        title: 'React Query: Best Practices 2024',
        content: 'React Query continues to be the go-to solution for server state management in React applications. Learn about the latest best practices and features.',
        summary: 'Latest React Query best practices and features for 2024.',
        url: 'https://example.com/react-query-best-practices',
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        source: 'React Weekly',
        category: 'Development',
        isProcessed: true,
      },
    ]).returning();

    console.log('Sample articles created:', sampleArticles.length);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();