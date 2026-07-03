// Daily content generator - scheduled Cloud Function
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { defineSecret } from 'firebase-functions/params';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';
import { fetchRelevantArticles, DEFAULT_SOURCES } from '../news/rssParser.js';
import { generateBlogPost, initClaudeClient } from '../ai/claudeClient.js';

// Initialize Firebase Admin if not already done
if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();

// Define the secret for Anthropic API key
const ANTHROPIC_API_KEY = defineSecret('ANTHROPIC_API_KEY');

/**
 * Generate a URL-friendly slug from a title
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/**
 * Get active news sources from Firestore, or use defaults
 */
async function getNewsSources() {
  try {
    const snapshot = await db.collection('newsSources')
      .where('isActive', '==', true)
      .orderBy('priority')
      .get();

    if (snapshot.empty) {
      console.log('No news sources in Firestore, using defaults');
      return DEFAULT_SOURCES.map(s => ({ ...s, isActive: true }));
    }

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching news sources:', error);
    return DEFAULT_SOURCES.map(s => ({ ...s, isActive: true }));
  }
}

/**
 * Check if an article has already been processed
 */
async function isArticleProcessed(articleId) {
  const doc = await db.collection('processedArticles').doc(articleId).get();
  return doc.exists;
}

/**
 * Mark an article as processed
 */
async function markArticleProcessed(articleId, data) {
  await db.collection('processedArticles').doc(articleId).set({
    ...data,
    processedAt: FieldValue.serverTimestamp(),
  });
}

/**
 * Save a generated blog post to Firestore
 */
async function saveBlogPost(post, sourceArticle) {
  const slug = slugify(post.title);
  const docRef = db.collection('blogPosts').doc();

  const blogPost = {
    slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    date: FieldValue.serverTimestamp(),
    publishedAt: FieldValue.serverTimestamp(),
    author: 'NDN Analytics Team',
    category: sourceArticle.category === 'blockchain' ? 'Blockchain' : 'AI',
    readTime: post.readTime,
    tags: post.tags,
    relatedProducts: post.relatedProducts,
    ndnServiceCTA: post.ndnServiceCTA,  // NDN service tie-in
    source: 'ai_generated',
    sourceUrl: sourceArticle.link,
    sourceTitle: sourceArticle.title,
    generationModel: 'claude-haiku-4-5',
    status: 'published',
    viewCount: 0,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  await docRef.set(blogPost);

  return { id: docRef.id, slug };
}

/**
 * Main scheduled function - runs daily at 6 AM UTC
 */
export const dailyContentGenerator = onSchedule(
  {
    schedule: '0 6 * * *',
    timeZone: 'UTC',
    memory: '512MiB',
    timeoutSeconds: 540,
    secrets: [ANTHROPIC_API_KEY],
  },
  async () => {
    console.log('Starting daily content generation...');

    try {
      // Initialize Claude client
      const apiKey = ANTHROPIC_API_KEY.value();
      initClaudeClient(apiKey);

      // Get news sources
      const sources = await getNewsSources();
      console.log(`Fetching from ${sources.length} news sources`);

      // Fetch relevant articles
      const articles = await fetchRelevantArticles(sources, 5);
      console.log(`Found ${articles.length} relevant articles`);

      if (articles.length === 0) {
        console.log('No new relevant articles found');
        return;
      }

      let postsGenerated = 0;
      const maxPosts = 2; // Generate up to 2 posts per day

      for (const article of articles) {
        if (postsGenerated >= maxPosts) break;

        // Check if already processed
        if (await isArticleProcessed(article.articleId)) {
          console.log(`Article already processed: ${article.title}`);
          continue;
        }

        try {
          console.log(`Generating post for: ${article.title}`);

          // Generate blog post with Claude
          const post = await generateBlogPost(article, apiKey);

          // Save to Firestore
          const saved = await saveBlogPost(post, article);
          console.log(`Published: ${saved.slug}`);

          // Mark article as processed
          await markArticleProcessed(article.articleId, {
            sourceId: article.sourceId,
            sourceName: article.sourceName,
            originalUrl: article.link,
            originalTitle: article.title,
            blogPostId: saved.id,
            skipped: false,
          });

          postsGenerated++;

        } catch (error) {
          console.error(`Failed to generate post for article: ${article.title}`, error);

          // Mark as processed but skipped
          await markArticleProcessed(article.articleId, {
            sourceId: article.sourceId,
            originalUrl: article.link,
            originalTitle: article.title,
            skipped: true,
            skipReason: error.message,
          });
        }
      }

      console.log(`Daily content generation complete. Generated ${postsGenerated} posts.`);

    } catch (error) {
      console.error('Daily content generation failed:', error);
      throw error;
    }
  }
);
