import { describe, it, expect } from 'vitest';
import {
  evaluateScore,
  calculateBatchScore,
  getRecommendedAction,
  getScoreLabel,
  getScoreColor,
} from '../lib/leadScoring';

describe('evaluateScore', () => {
  it('returns cold for score 0', () => {
    const result = evaluateScore(0);
    expect(result.category).toBe('cold');
    expect(result.status).toBe('new');
    expect(result.shouldNotify).toBe(false);
    expect(result.requiresAction).toBe(false);
  });

  it('returns cold at threshold boundary (score = 20)', () => {
    const result = evaluateScore(20);
    expect(result.category).toBe('cold');
    expect(result.status).toBe('new');
  });

  it('returns warm just above cold threshold (score = 21)', () => {
    const result = evaluateScore(21);
    expect(result.category).toBe('warm');
    expect(result.status).toBe('nurturing');
  });

  it('returns warm at upper boundary (score = 50)', () => {
    const result = evaluateScore(50);
    expect(result.category).toBe('warm');
    expect(result.status).toBe('nurturing');
  });

  it('returns hot just above warm threshold (score = 51)', () => {
    const result = evaluateScore(51);
    expect(result.category).toBe('hot');
    expect(result.status).toBe('nurturing');
  });

  it('returns hot at upper boundary (score = 80)', () => {
    const result = evaluateScore(80);
    expect(result.category).toBe('hot');
    expect(result.status).toBe('nurturing');
  });

  it('returns qualified at threshold (score = 81)', () => {
    const result = evaluateScore(81);
    expect(result.category).toBe('qualified');
    expect(result.status).toBe('qualified');
    expect(result.shouldNotify).toBe(true);
    expect(result.requiresAction).toBe(true);
  });

  it('returns qualified for very high score', () => {
    const result = evaluateScore(500);
    expect(result.category).toBe('qualified');
    expect(result.shouldNotify).toBe(true);
  });

  it('returns cold for negative score', () => {
    const result = evaluateScore(-10);
    expect(result.category).toBe('cold');
    expect(result.status).toBe('new');
  });
});

describe('calculateBatchScore', () => {
  it('returns 0 for empty engagements', () => {
    expect(calculateBatchScore([])).toBe(0);
  });

  it('scores page_view at weight 1', () => {
    expect(calculateBatchScore([{ type: 'page_view', count: 5 }])).toBe(5);
  });

  it('scores blog_read at weight 2', () => {
    expect(calculateBatchScore([{ type: 'blog_read', count: 3 }])).toBe(6);
  });

  it('scores product_view at weight 5', () => {
    expect(calculateBatchScore([{ type: 'product_view', count: 2 }])).toBe(10);
  });

  it('scores content_download at weight 8', () => {
    expect(calculateBatchScore([{ type: 'content_download', count: 1 }])).toBe(8);
  });

  it('scores form_submit at weight 10', () => {
    expect(calculateBatchScore([{ type: 'form_submit', count: 1 }])).toBe(10);
  });

  it('scores aria_conversation at weight 3', () => {
    expect(calculateBatchScore([{ type: 'aria_conversation', count: 4 }])).toBe(12);
  });

  it('scores cta_click at weight 3', () => {
    expect(calculateBatchScore([{ type: 'cta_click', count: 2 }])).toBe(6);
  });

  it('returns 0 for unknown engagement type', () => {
    expect(calculateBatchScore([{ type: 'unknown_type', count: 10 }])).toBe(0);
  });

  it('aggregates multiple engagement types correctly', () => {
    const engagements = [
      { type: 'page_view', count: 10 },     // 10
      { type: 'product_view', count: 3 },    // 15
      { type: 'form_submit', count: 1 },     // 10
    ];
    expect(calculateBatchScore(engagements)).toBe(35);
  });

  it('handles mixed known and unknown types', () => {
    const engagements = [
      { type: 'page_view', count: 5 },       // 5
      { type: 'nonexistent', count: 100 },    // 0
    ];
    expect(calculateBatchScore(engagements)).toBe(5);
  });
});

describe('getRecommendedAction', () => {
  it('returns nurture sequence for cold', () => {
    expect(getRecommendedAction('cold')).toContain('newsletter');
  });

  it('returns targeted content for warm', () => {
    expect(getRecommendedAction('warm')).toContain('targeted content');
  });

  it('returns sales outreach for hot', () => {
    expect(getRecommendedAction('hot')).toContain('sales outreach');
  });

  it('returns immediate contact for qualified', () => {
    expect(getRecommendedAction('qualified')).toContain('Immediate');
  });
});

describe('getScoreLabel', () => {
  it('returns "Cold" for low scores', () => {
    expect(getScoreLabel(10)).toBe('Cold');
  });

  it('returns "Warm" for mid scores', () => {
    expect(getScoreLabel(30)).toBe('Warm');
  });

  it('returns "Hot" for high scores', () => {
    expect(getScoreLabel(60)).toBe('Hot');
  });

  it('returns "Qualified" for top scores', () => {
    expect(getScoreLabel(100)).toBe('Qualified');
  });
});

describe('getScoreColor', () => {
  it('returns slate for cold', () => {
    expect(getScoreColor(10)).toBe('#64748b');
  });

  it('returns amber for warm', () => {
    expect(getScoreColor(30)).toBe('#f59e0b');
  });

  it('returns red for hot', () => {
    expect(getScoreColor(60)).toBe('#ef4444');
  });

  it('returns emerald for qualified', () => {
    expect(getScoreColor(100)).toBe('#10b981');
  });
});
