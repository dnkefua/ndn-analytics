// Lead scoring engine with threshold-based actions
import { updateLead } from './leads';
import { SCORE_THRESHOLDS, type LeadStatus } from '../types/leads';

export type ScoreCategory = 'cold' | 'warm' | 'hot' | 'qualified';

export interface ScoringResult {
  category: ScoreCategory;
  status: LeadStatus;
  shouldNotify: boolean;
  requiresAction: boolean;
}

// Evaluate a lead's score and determine category + actions
export function evaluateScore(score: number): ScoringResult {
  if (score >= SCORE_THRESHOLDS.qualified) {
    return {
      category: 'qualified',
      status: 'qualified',
      shouldNotify: true,
      requiresAction: true,
    };
  }

  if (score > SCORE_THRESHOLDS.warm) {
    return {
      category: 'hot',
      status: 'nurturing',
      shouldNotify: false,
      requiresAction: false,
    };
  }

  if (score > SCORE_THRESHOLDS.cold) {
    return {
      category: 'warm',
      status: 'nurturing',
      shouldNotify: false,
      requiresAction: false,
    };
  }

  return {
    category: 'cold',
    status: 'new',
    shouldNotify: false,
    requiresAction: false,
  };
}

// Update lead status based on score
export async function updateLeadStatus(
  leadId: string,
  currentScore: number,
  currentStatus: LeadStatus
): Promise<ScoringResult> {
  const result = evaluateScore(currentScore);

  // Only update if status should change
  if (result.status !== currentStatus && shouldProgressStatus(currentStatus, result.status)) {
    await updateLead(leadId, { status: result.status });
  }

  return result;
}

// Ensure we only progress forward (never regress status)
function shouldProgressStatus(current: LeadStatus, proposed: LeadStatus): boolean {
  const order: LeadStatus[] = ['new', 'nurturing', 'qualified', 'contacted', 'customer'];
  return order.indexOf(proposed) > order.indexOf(current);
}

// Calculate score for batch of engagements
export function calculateBatchScore(
  engagements: Array<{ type: string; count: number }>
): number {
  const weights: Record<string, number> = {
    page_view: 1,
    blog_read: 2,
    product_view: 5,
    content_download: 8,
    aria_conversation: 3,
    form_submit: 10,
    cta_click: 3,
  };

  return engagements.reduce((total, { type, count }) => {
    return total + (weights[type] || 0) * count;
  }, 0);
}

// Get recommended action based on score category
export function getRecommendedAction(category: ScoreCategory): string {
  const actions: Record<ScoreCategory, string> = {
    cold: 'Add to newsletter nurture sequence',
    warm: 'Send targeted content based on product interests',
    hot: 'Schedule sales outreach call',
    qualified: 'Immediate personal contact required',
  };

  return actions[category];
}

// Score thresholds for UI display
export function getScoreLabel(score: number): string {
  const result = evaluateScore(score);
  const labels: Record<ScoreCategory, string> = {
    cold: 'Cold',
    warm: 'Warm',
    hot: 'Hot',
    qualified: 'Qualified',
  };
  return labels[result.category];
}

// Score color for UI
export function getScoreColor(score: number): string {
  const result = evaluateScore(score);
  const colors: Record<ScoreCategory, string> = {
    cold: '#64748b',     // slate
    warm: '#f59e0b',     // amber
    hot: '#ef4444',      // red
    qualified: '#10b981', // emerald
  };
  return colors[result.category];
}
