// Claude API client for content generation
import Anthropic from '@anthropic-ai/sdk';
import { BLOG_GENERATION_PROMPT, formatArticleForPrompt } from './prompts.js';

let client = null;

/**
 * Initialize the Anthropic client
 */
export function initClaudeClient(apiKey) {
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is required');
  }
  client = new Anthropic({ apiKey });
  return client;
}

/**
 * Generate a blog post from a news article
 */
export async function generateBlogPost(article, apiKey) {
  if (!client) {
    initClaudeClient(apiKey);
  }

  const prompt = formatArticleForPrompt(article);

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20241022',
      max_tokens: 2048,
      system: BLOG_GENERATION_PROMPT,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.content[0]?.text;
    if (!content) {
      throw new Error('No content in Claude response');
    }

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not find JSON in Claude response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate required fields
    if (!parsed.title || !parsed.excerpt || !parsed.content) {
      throw new Error('Missing required fields in Claude response');
    }

    return {
      title: parsed.title,
      excerpt: parsed.excerpt,
      content: parsed.content,
      tags: parsed.tags || [],
      relatedProducts: parsed.relatedProducts || [],
      readTime: estimateReadTime(parsed.content),
    };
  } catch (error) {
    console.error('Claude API error:', error.message);
    throw error;
  }
}

/**
 * Estimate read time based on word count
 */
function estimateReadTime(content) {
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}
