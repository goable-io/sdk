/**
 * @goable-io/sdk — TypeScript client for the Goable API.
 *
 *   import { GoableClient } from "@goable-io/sdk"
 *   const goable = new GoableClient({ apiKey: process.env.GOABLE_API_KEY! })
 *   const { score, verdict } = await goable.score({
 *     activity: "kitesurfing",
 *     location: { lat: 43.7, lng: 7.27 },
 *   })
 */

export { GoableClient } from "./client.ts"
export type { FetchLike, GoableClientOptions } from "./client.ts"
export {
  type ApiErrorExtra,
  DriftActiveError,
  GoableApiError,
  GoableNetworkError,
  type RateLimit,
  type ZodIssueLike,
} from "./errors.ts"
export type * from "./types.ts"
