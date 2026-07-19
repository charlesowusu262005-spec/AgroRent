/**
 * @file        mockReviewData.ts
 * @feature     Reviews
 * @description Static review seeds for all equipment listings and labor workers in dev/offline mode.
 * @data        MOCK_REVIEWS_BY_TARGET, getMockReviews, generateReviewId
 * @author      MiStarStudio
 */

import { subDays } from 'date-fns';

import { MOCK_EQUIPMENT } from '../../equipment/data/mockEquipmentData';
import { MOCK_WORKERS } from '../../labor/data/mockLaborData';
import type { Review, ReviewTargetType } from '../types/review.types';
import { reviewTargetKey } from '../types/review.types';

const avatar = (seed: string) => `https://picsum.photos/seed/reviewer-${seed}/100/100`;

const REVIEWER_NAMES = [
  'Kwame Asante',
  'Ama Osei',
  'Yaw Boateng',
  'Akosua Mensah',
  'Kofi Adjei',
  'Abena Kumi',
  'Daniel Tetteh',
  'Grace Akoto',
  'Ibrahim Tanko',
  'Efua Serwaa',
];

const EQUIPMENT_COMMENTS = [
  'Equipment was in excellent condition and the owner was very helpful with setup.',
  'Worked perfectly for our maize harvest. Would rent again next season.',
  'Reliable machine, though pickup was slightly later than agreed.',
  'Fair price for the quality. Minor wear but fully functional.',
  'Owner explained operation clearly. Great experience overall.',
  'Saved us days of manual labor. Highly recommend this listing.',
  'Good value for money. Fuel consumption was reasonable.',
  'Professional handover and clean equipment. Five stars.',
];

const WORKER_COMMENTS = [
  'Very reliable and finished land clearing ahead of schedule.',
  'Good work on planting rows. Would hire again.',
  'Professional attitude and knows farm operations well.',
  'Showed up on time and worked efficiently through the heat.',
  'Skilled with spraying equipment. Crops looked healthy after.',
  'Communicated clearly about progress. Excellent harvest help.',
  'Trustworthy worker — left the field tidy after completion.',
  'Strong work ethic and fair about hours worked.',
];

const RATINGS = [5, 5, 4, 5, 4, 5, 3, 4, 5, 4, 5, 4];

function buildReviewsForTarget(
  targetId: string,
  targetType: ReviewTargetType,
  count: number,
): Review[] {
  const comments = targetType === 'EQUIPMENT' ? EQUIPMENT_COMMENTS : WORKER_COMMENTS;

  return Array.from({ length: count }, (_, index) => {
    const reviewerName = REVIEWER_NAMES[index % REVIEWER_NAMES.length];
    const slug = reviewerName.toLowerCase().replace(/\s+/g, '-');

    return {
      id: `rev-${targetType.toLowerCase()}-${targetId}-${index + 1}`,
      reviewerId: `user-${index + 1}`,
      reviewerName,
      reviewerAvatar: avatar(`${slug}-${targetId}`),
      targetId,
      targetType,
      rating: RATINGS[index % RATINGS.length],
      comment: comments[index % comments.length],
      createdAt: subDays(new Date(), (index + 1) * 12 + index * 3).toISOString(),
    };
  });
}

function buildAllMockReviews(): Record<string, Review[]> {
  const byTarget: Record<string, Review[]> = {};

  MOCK_EQUIPMENT.forEach((equipment, index) => {
    const count = 6 + (index % 3);
    const key = reviewTargetKey(equipment.id, 'EQUIPMENT');
    byTarget[key] = buildReviewsForTarget(equipment.id, 'EQUIPMENT', count);
  });

  MOCK_WORKERS.forEach((worker, index) => {
    const count = 6 + (index % 3);
    const key = reviewTargetKey(worker.userId, 'WORKER');
    byTarget[key] = buildReviewsForTarget(worker.userId, 'WORKER', count);
  });

  return byTarget;
}

// TODO(api): replace with GET /reviews — remove static seed data
export const MOCK_REVIEWS_BY_TARGET = buildAllMockReviews();

export function getMockReviews(targetId: string, targetType: ReviewTargetType): Review[] {
  return MOCK_REVIEWS_BY_TARGET[reviewTargetKey(targetId, targetType)] ?? [];
}

export function generateReviewId(): string {
  return `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
