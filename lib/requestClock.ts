import "server-only";
import { cache } from "react";

/**
 * Capture one wall-clock timestamp per server-render request, so time-based
 * display decisions stay consistent even if React retries the render.
 * Mutation routes must separately enforce their own expiry checks.
 */
export const getRequestTimestampMs = cache(() => Date.now());
