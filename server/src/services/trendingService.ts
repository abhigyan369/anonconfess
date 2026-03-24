/**
 * Trending score = (reactions × 3 + comments × 1) / (age_in_hours + 2)^1.5
 * Higher score = more trending
 */
export const getTrendingScore = (
  totalReactions: number,
  commentCount: number,
  createdAt: Date
): number => {
  const ageHours = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);
  const score = (totalReactions * 3 + commentCount * 1) / Math.pow(ageHours + 2, 1.5);
  return score;
};
