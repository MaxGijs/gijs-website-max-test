export type GoogleReview = {
  name: string;
  rating: number;
  originalText?: { text?: string };
  relativePublishTimeDescription?: string;
  googleMapsUri?: string;
  authorAttribution: { displayName: string; uri?: string; photoUri?: string };
};
export type GoogleReviews = {
  displayName: { text: string };
  rating?: number;
  userRatingCount?: number;
  googleMapsUri: string;
  reviews?: GoogleReview[];
};

// Reject incomplete/error payloads instead of accidentally presenting an empty score as genuine data.
export function isGoogleReviews(value: unknown): value is GoogleReviews {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<GoogleReviews>;
  return typeof data.displayName?.text === "string" && typeof data.googleMapsUri === "string"
    && data.googleMapsUri.startsWith("https://")
    && (data.rating === undefined || (typeof data.rating === "number" && data.rating >= 1 && data.rating <= 5))
    && (data.userRatingCount === undefined || (Number.isInteger(data.userRatingCount) && data.userRatingCount >= 0))
    && (data.reviews === undefined || (Array.isArray(data.reviews) && data.reviews.every(review =>
      typeof review.name === "string" && typeof review.authorAttribution?.displayName === "string"
      && typeof review.rating === "number" && review.rating >= 1 && review.rating <= 5)));
}
