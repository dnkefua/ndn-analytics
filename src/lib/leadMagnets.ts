// Lead Magnet definitions and download tracking
import { addEngagement } from './leads';

export interface LeadMagnet {
  id: string;
  title: string;
  description: string;
  fileName: string;
  category: 'ai' | 'blockchain' | 'general';
  relatedProducts: string[];
}

export const LEAD_MAGNETS: LeadMagnet[] = [
  {
    id: 'ai-demand-forecasting-checklist',
    title: 'AI Demand Forecasting Checklist',
    description: '10-point checklist to evaluate if your retail business is ready for AI-powered demand forecasting.',
    fileName: 'NDN-AI-Demand-Forecasting-Checklist.pdf',
    category: 'ai',
    relatedProducts: ['ndn-001'],
  },
  {
    id: 'blockchain-supply-chain-guide',
    title: 'Blockchain Supply Chain ROI Guide',
    description: 'Calculate the ROI of implementing blockchain traceability in your supply chain.',
    fileName: 'NDN-Blockchain-Supply-Chain-ROI-Guide.pdf',
    category: 'blockchain',
    relatedProducts: ['ndn-005'],
  },
  {
    id: 'healthcare-ai-readiness',
    title: 'Healthcare AI Readiness Assessment',
    description: 'Self-assessment tool to determine your hospital\'s readiness for AI-powered care prediction.',
    fileName: 'NDN-Healthcare-AI-Readiness-Assessment.pdf',
    category: 'ai',
    relatedProducts: ['ndn-002'],
  },
  {
    id: 'defi-implementation-playbook',
    title: 'DeFi Implementation Playbook',
    description: 'Step-by-step guide to implementing decentralized finance solutions for community savings.',
    fileName: 'NDN-DeFi-Implementation-Playbook.pdf',
    category: 'blockchain',
    relatedProducts: ['ndn-009'],
  },
  {
    id: 'enterprise-ai-starter-guide',
    title: 'Enterprise AI Starter Guide',
    description: 'Complete beginner\'s guide to implementing AI in enterprise operations.',
    fileName: 'NDN-Enterprise-AI-Starter-Guide.pdf',
    category: 'general',
    relatedProducts: [],
  },
];

export function getLeadMagnetById(id: string): LeadMagnet | undefined {
  return LEAD_MAGNETS.find(lm => lm.id === id);
}

export function getLeadMagnetsByCategory(category: LeadMagnet['category']): LeadMagnet[] {
  return LEAD_MAGNETS.filter(lm => lm.category === category);
}

export function getLeadMagnetForProduct(productId: string): LeadMagnet | undefined {
  return LEAD_MAGNETS.find(lm => lm.relatedProducts.includes(productId));
}

// Track lead magnet download
export async function trackDownload(leadId: string | null, magnetId: string): Promise<void> {
  if (leadId) {
    await addEngagement(leadId, 'content_download', { magnetId });
  }

  // Also track in analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'download', {
      event_category: 'lead_magnet',
      event_label: magnetId,
    });
  }
}

// Generate download URL (in production, this would be a signed URL or gated download)
export function getDownloadUrl(magnetId: string): string {
  const magnet = getLeadMagnetById(magnetId);
  if (!magnet) return '#';
  return `/downloads/${magnet.fileName}`;
}
