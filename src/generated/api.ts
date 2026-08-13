/**
 * GENERATED FILE — do not edit by hand.
 * Source: openapi.json (the committed Goable API contract).
 * Regenerate: pnpm gen
 */

export interface paths {
    "/v1/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Liveness probe */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Process is up */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            [key: string]: unknown;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/health/ready": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Readiness probe (DB + skill lookup + LLM config) */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Ready or degraded */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            [key: string]: unknown;
                        };
                    };
                };
                /** @description Unhealthy (critical check failed) */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            [key: string]: unknown;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/score": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Score an activity at a location + time window */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** @example kitesurfing */
                        activity: string;
                        location: components["schemas"]["GeoPoint"];
                        window?: components["schemas"]["TimeWindow"];
                        /** @description L2a probabilistic ensemble (Pro+) */
                        ensemble?: boolean;
                        members?: number;
                        /**
                         * @description Skill-conditioned scoring (Pro+).
                         * @enum {string}
                         */
                        rider_skill_level?: "beginner" | "intermediate" | "expert";
                    };
                };
            };
            responses: {
                /** @description Score 0-100 + verdict + confidence + eco + calibration_provenance */
                200: {
                    headers: {
                        /** @description Daily safety cap for this endpoint + plan (not the monthly billing quota). Omitted on unlimited (Scale) plans. */
                        "X-RateLimit-Limit"?: number;
                        /** @description Requests remaining in the current UTC-midnight daily window. Omitted on unlimited (Scale) plans. */
                        "X-RateLimit-Remaining"?: number;
                        /** @description Unix timestamp (seconds) at which the daily window resets. Omitted on unlimited (Scale) plans. */
                        "X-RateLimit-Reset"?: number;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ScoreResponse"];
                    };
                };
                /** @description PAYMENT_REQUIRED — a premium capability (`ensemble` or `rider_skill_level`) was requested on a Free/Starter plan. */
                402: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description ACTIVITY_NOT_FOUND — no profile for the activity. `detail` carries `valid_slugs` (see GET /v1/activities) plus a fuzzy `did_you_mean` suggestion when one catalog slug is a close match. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Validation error (`VALIDATION_ERROR`), or `FORECAST_HORIZON_EXCEEDED` when the requested window ends beyond the ~16-day forecast horizon (use POST /v1/score/historical or /v1/projections for longer ranges). */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Rate limit exceeded for this endpoint + plan (`RATE_LIMITED`). Covers both the daily safety cap and the monthly usage quota — `detail.scope` is `daily` or `monthly_quota`. `Retry-After` is set on both. */
                429: {
                    headers: {
                        /** @description Seconds until the exceeded rate-limit window resets. Present on every 429 from a rate-limited route — both the daily safety-cap 429 (resets at 00:00 UTC) and the monthly-quota 429 (resets at 00:00 UTC on the 1st of next month). `detail.scope` on the body distinguishes `daily` vs `monthly_quota`. */
                        "Retry-After"?: number;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description INTERNAL_SERVER_ERROR — an upstream weather-provider fetch failed (or another unexpected error). A DependencyMissingError surfaces as 503 SERVICE_UNAVAILABLE instead. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/activities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List discoverable base activity slugs
         * @description P2 (activity discovery DX) — the canonical, catalog-derived list of base activity slugs a caller can pass as `activity` to POST /v1/score (and the other activity-resolving routes). Never hardcoded: reflects exactly the base (`spot_kind: "base"`) profiles in the loaded catalog, so it can't drift as activities are added. `GET /v1/profiles` is an alias for this same endpoint.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Base activity slugs discoverable in the loaded catalog */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            activities: {
                                /** @example kitesurfing */
                                slug: string;
                                /** @example Kitesurfing */
                                display_name: string;
                                /**
                                 * @description Activity category (water/snow/air/land/commercial).
                                 * @example water
                                 */
                                family: string;
                            }[];
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/profiles": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Alias for GET /v1/activities
         * @description Identical response to GET /v1/activities. Kept as an alias for back-compat with this document's original (pre-/v1/activities) promise of a `GET /v1/profiles` listing endpoint.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Base activity slugs discoverable in the loaded catalog (same as GET /v1/activities) */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            activities: {
                                /** @example kitesurfing */
                                slug: string;
                                /** @example Kitesurfing */
                                display_name: string;
                                /** @example water */
                                family: string;
                            }[];
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/score/series": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Time-series scoring across a window */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        activity: string;
                        location: components["schemas"]["GeoPoint"];
                        window: components["schemas"]["TimeWindow"];
                        /** @enum {string} */
                        granularity?: "hourly" | "3-hourly" | "daily";
                        ensemble?: boolean;
                        members?: number;
                    };
                };
            };
            responses: {
                /** @description Per-step scores */
                200: {
                    headers: {
                        /** @description Daily safety cap for this endpoint + plan (not the monthly billing quota). Omitted on unlimited (Scale) plans. */
                        "X-RateLimit-Limit"?: number;
                        /** @description Requests remaining in the current UTC-midnight daily window. Omitted on unlimited (Scale) plans. */
                        "X-RateLimit-Remaining"?: number;
                        /** @description Unix timestamp (seconds) at which the daily window resets. Omitted on unlimited (Scale) plans. */
                        "X-RateLimit-Reset"?: number;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ScoreSeriesResponse"];
                    };
                };
                /** @description PAYMENT_REQUIRED — `ensemble` was requested on a Free/Starter plan. */
                402: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description ACTIVITY_NOT_FOUND — no profile for the activity. `detail` carries `valid_slugs` (see GET /v1/activities) plus a fuzzy `did_you_mean` suggestion when one catalog slug is a close match. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Validation error (`VALIDATION_ERROR`), or `WINDOW_TOO_LARGE` when the requested window exceeds the per-plan series span. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Rate limit exceeded for this endpoint + plan (`RATE_LIMITED`). Covers both the daily safety cap and the monthly usage quota — `detail.scope` is `daily` or `monthly_quota`. `Retry-After` is set on both. */
                429: {
                    headers: {
                        /** @description Seconds until the exceeded rate-limit window resets. Present on every 429 from a rate-limited route — both the daily safety-cap 429 (resets at 00:00 UTC) and the monthly-quota 429 (resets at 00:00 UTC on the 1st of next month). `detail.scope` on the body distinguishes `daily` vs `monthly_quota`. */
                        "Retry-After"?: number;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/score/multi": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Score multiple activities at one location */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        activities: string[];
                        location: components["schemas"]["GeoPoint"];
                        window?: components["schemas"]["TimeWindow"];
                        ensemble?: boolean;
                        members?: number;
                    };
                };
            };
            responses: {
                /** @description Per-activity scores */
                200: {
                    headers: {
                        /** @description Daily safety cap for this endpoint + plan (not the monthly billing quota). Omitted on unlimited (Scale) plans. */
                        "X-RateLimit-Limit"?: number;
                        /** @description Requests remaining in the current UTC-midnight daily window. Omitted on unlimited (Scale) plans. */
                        "X-RateLimit-Remaining"?: number;
                        /** @description Unix timestamp (seconds) at which the daily window resets. Omitted on unlimited (Scale) plans. */
                        "X-RateLimit-Reset"?: number;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ScoreMultiResponse"];
                    };
                };
                /** @description PAYMENT_REQUIRED — `ensemble` was requested on a Free/Starter plan. */
                402: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Validation error (`VALIDATION_ERROR`), or `MAX_ACTIVITIES_EXCEEDED` when the request lists more activities than the per-plan cap. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Rate limit exceeded for this endpoint + plan (`RATE_LIMITED`). Covers both the daily safety cap and the monthly usage quota — `detail.scope` is `daily` or `monthly_quota`. `Retry-After` is set on both. */
                429: {
                    headers: {
                        /** @description Seconds until the exceeded rate-limit window resets. Present on every 429 from a rate-limited route — both the daily safety-cap 429 (resets at 00:00 UTC) and the monthly-quota 429 (resets at 00:00 UTC on the 1st of next month). `detail.scope` on the body distinguishes `daily` vs `monthly_quota`. */
                        "Retry-After"?: number;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/score/historical": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Historical climatology scoring (Pro+)
         * @description Percentiles + exceedance + verdict frequency over ERA5 reanalysis. Each entry carries a historical-mode ConfidenceDetail block (see components.schemas.ConfidenceDetailHistorical).
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        activity: string;
                        location: components["schemas"]["GeoPoint"];
                        yearsRange: {
                            from: number;
                            to: number;
                        };
                        /** @enum {string} */
                        granularity: "month" | "week" | "day-of-year" | "daypart";
                        selector: {
                            month?: number;
                            weekOfYear?: number;
                            dayOfYear?: number;
                            /** @enum {string} */
                            daypart?: "morning" | "midday" | "afternoon" | "evening";
                        };
                        failOnMarineGap?: boolean;
                    };
                };
            };
            responses: {
                /** @description Percentiles + exceedance + verdict frequency (per-entry confidenceDetail: historical) */
                200: {
                    headers: {
                        /** @description Daily safety cap for this endpoint + plan (not the monthly billing quota). Omitted on unlimited (Scale) plans. */
                        "X-RateLimit-Limit"?: number;
                        /** @description Requests remaining in the current UTC-midnight daily window. Omitted on unlimited (Scale) plans. */
                        "X-RateLimit-Remaining"?: number;
                        /** @description Unix timestamp (seconds) at which the daily window resets. Omitted on unlimited (Scale) plans. */
                        "X-RateLimit-Reset"?: number;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            [key: string]: unknown;
                        };
                    };
                };
                /** @description PAYMENT_REQUIRED — historical scoring requires a Pro or Scale plan. */
                402: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description ACTIVITY_NOT_FOUND — no profile for the requested activity. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Validation error (`VALIDATION_ERROR`), `WINDOW_TOO_LARGE`, `INVALID_YEARS_RANGE`, or `MARINE_NOT_AVAILABLE` (marine data gap when `failOnMarineGap` is set). */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Rate limit exceeded for this endpoint + plan (`RATE_LIMITED`). Covers both the daily safety cap and the monthly usage quota — `detail.scope` is `daily` or `monthly_quota`. `Retry-After` is set on both. */
                429: {
                    headers: {
                        /** @description Seconds until the exceeded rate-limit window resets. Present on every 429 from a rate-limited route — both the daily safety-cap 429 (resets at 00:00 UTC) and the monthly-quota 429 (resets at 00:00 UTC on the 1st of next month). `detail.scope` on the body distinguishes `daily` vs `monthly_quota`. */
                        "Retry-After"?: number;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description ARCHIVE_UNAVAILABLE — the ERA5 historical archive provider is not configured / reachable on this deployment. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/score/portfolio": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Multi-spot portfolio scoring with joint variance */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        spots: {
                            location: components["schemas"]["GeoPoint"];
                            activity: string;
                            weight?: number;
                            spotId?: string;
                        }[];
                        yearsRange: {
                            from: number;
                            to: number;
                        };
                        /** @enum {string} */
                        granularity: "month" | "week" | "day-of-year" | "daypart";
                        selector: {
                            month?: number;
                            weekOfYear?: number;
                            dayOfYear?: number;
                            /** @enum {string} */
                            daypart?: "morning" | "midday" | "afternoon" | "evening";
                        };
                        correlation?: {
                            /** @enum {string} */
                            model?: "none" | "exponential";
                            lengthKm?: number;
                        };
                        cancellationThreshold?: number;
                    };
                };
            };
            responses: {
                /** @description Portfolio score + per-spot contributions */
                200: {
                    headers: {
                        /** @description Daily safety cap for this endpoint + plan (not the monthly billing quota). Omitted on unlimited (Scale) plans. */
                        "X-RateLimit-Limit"?: number;
                        /** @description Requests remaining in the current UTC-midnight daily window. Omitted on unlimited (Scale) plans. */
                        "X-RateLimit-Remaining"?: number;
                        /** @description Unix timestamp (seconds) at which the daily window resets. Omitted on unlimited (Scale) plans. */
                        "X-RateLimit-Reset"?: number;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            [key: string]: unknown;
                        };
                    };
                };
                /** @description PAYMENT_REQUIRED — portfolio scoring requires a Pro or Scale plan. */
                402: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description ACTIVITY_NOT_FOUND — a spot references an activity with no profile. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Validation error (`VALIDATION_ERROR`), `PORTFOLIO_TOO_LARGE` (more spots than the per-plan cap), or `INVALID_YEARS_RANGE`. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Rate limit exceeded for this endpoint + plan (`RATE_LIMITED`). Covers both the daily safety cap and the monthly usage quota — `detail.scope` is `daily` or `monthly_quota`. `Retry-After` is set on both. */
                429: {
                    headers: {
                        /** @description Seconds until the exceeded rate-limit window resets. Present on every 429 from a rate-limited route — both the daily safety-cap 429 (resets at 00:00 UTC) and the monthly-quota 429 (resets at 00:00 UTC on the 1st of next month). `detail.scope` on the body distinguishes `daily` vs `monthly_quota`. */
                        "Retry-After"?: number;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description ARCHIVE_UNAVAILABLE — the ERA5 historical archive provider is not configured / reachable on this deployment. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/score/explain-counterfactual": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Counterfactual analysis: binding constraint + sensitivities + best window/spot */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        activity: string;
                        spot: components["schemas"]["GeoPoint"];
                        window: components["schemas"]["TimeWindow"];
                        include?: {
                            marginal_sensitivities?: boolean;
                            binding_constraint?: boolean;
                            best_window_24h?: boolean;
                            best_nearby_spot_km?: number;
                            /** @description LLM explanation. Available on any plan (Anthropic BYOK) — resolves the tenant's own Anthropic key set via PUT /v1/tenant/llm-key; no key configured degrades to a deterministic template (natural_language.degraded_mode=true) rather than an error. */
                            natural_language?: boolean;
                        };
                    };
                };
            };
            responses: {
                /** @description binding_constraint + marginal_sensitivities + best_window_24h + best_nearby_spots + optional natural_language */
                200: {
                    headers: {
                        /** @description Daily safety cap for this endpoint + plan (not the monthly billing quota). Omitted on unlimited (Scale) plans. */
                        "X-RateLimit-Limit"?: number;
                        /** @description Requests remaining in the current UTC-midnight daily window. Omitted on unlimited (Scale) plans. */
                        "X-RateLimit-Remaining"?: number;
                        /** @description Unix timestamp (seconds) at which the daily window resets. Omitted on unlimited (Scale) plans. */
                        "X-RateLimit-Reset"?: number;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            [key: string]: unknown;
                        };
                    };
                };
                /** @description NOT_FOUND / ACTIVITY_NOT_FOUND — no profile for the activity. `detail` carries `valid_slugs` (see GET /v1/activities) plus a fuzzy `did_you_mean` suggestion when one catalog slug is a close match. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Validation error */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Rate limit exceeded for this endpoint + plan (`RATE_LIMITED`). Covers both the daily safety cap and the monthly usage quota — `detail.scope` is `daily` or `monthly_quota`. `Retry-After` is set on both. */
                429: {
                    headers: {
                        /** @description Seconds until the exceeded rate-limit window resets. Present on every 429 from a rate-limited route — both the daily safety-cap 429 (resets at 00:00 UTC) and the monthly-quota 429 (resets at 00:00 UTC on the 1st of next month). `detail.scope` on the body distinguishes `daily` vs `monthly_quota`. */
                        "Retry-After"?: number;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/decision": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Personalized go/no-go decision (any plan — Anthropic BYOK) */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** @description SHA256(user_id + secret)[:32], hex ≥32 chars. NEVER PII. */
                        user_pseudonym: string;
                        activity: string;
                        spot: components["schemas"]["GeoPoint"];
                        window: components["schemas"]["TimeWindow"];
                        user_profile?: {
                            /** @enum {string} */
                            experience?: "beginner" | "intermediate" | "advanced" | "expert";
                            weight_kg?: number;
                            /** @enum {string} */
                            risk_tolerance?: "conservative" | "moderate" | "aggressive";
                            owned_gear?: string[];
                        };
                        /** @default false */
                        training_consent?: boolean;
                    };
                };
            };
            responses: {
                /** @description score + verdict + decision block + degraded_mode + advisory_notice. Available on any plan; the LLM reasoning narrative requires the tenant's own Anthropic key (PUT /v1/tenant/llm-key) — without one, degraded_mode=true and a deterministic template is returned instead of an error. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            [key: string]: unknown;
                        };
                    };
                };
                /** @description No profile for activity. `detail` carries `valid_slugs` (see GET /v1/activities) plus a fuzzy `did_you_mean` suggestion when one catalog slug is a close match. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Validation error */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/decision/user-data/{pseudonym}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** GDPR Art. 17 right-to-erasure for a pseudonym */
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    pseudonym: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Deleted. Headers: X-Anonymized-Rows, X-Anonymized-Decision-Runs, X-Receipt */
                204: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/intelligence/explain": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * LLM narrative explanation of a score (L2c, any plan — Anthropic BYOK)
         * @description Requires the tenant to have its own Anthropic key set via PUT /v1/tenant/llm-key — no longer plan-gated. No key configured → 503 INTELLIGENCE_UNAVAILABLE.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        location: components["schemas"]["GeoPoint"];
                        scoreResult?: components["schemas"]["ScoreResponse"];
                        /** Format: uuid */
                        session_id?: string;
                        /** @enum {string} */
                        locale?: "en" | "it";
                        /** @enum {string} */
                        model?: "claude-haiku-4-5-20251001" | "claude-sonnet-4-6";
                    };
                };
            };
            responses: {
                /** @description Natural-language explanation */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            [key: string]: unknown;
                        };
                    };
                };
                /** @description ACTIVITY_NOT_FOUND (no profile for the activity) or SESSION_NOT_FOUND (the supplied `session_id` matched no scored session for this tenant). */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Validation error (`VALIDATION_ERROR`), or `SESSION_LOOKUP_UNAVAILABLE` when a `session_id` was supplied but session lookup is not wired on this deployment. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description LLM_BUDGET_EXCEEDED — the tenant's monthly LLM token budget is exhausted (distinct from the RATE_LIMITED daily/monthly request cap). */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description INTELLIGENCE_UNAVAILABLE — no Anthropic key is configured for this tenant (set one via PUT /v1/tenant/llm-key). */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/intelligence/briefing": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * LLM multi-slot briefing (L2c, any plan — Anthropic BYOK)
         * @description Requires the tenant to have its own Anthropic key set via PUT /v1/tenant/llm-key — no longer plan-gated. No key configured → 503 INTELLIGENCE_UNAVAILABLE.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        activity: string;
                        slots: {
                            [key: string]: unknown;
                        }[];
                        /** @enum {string} */
                        locale?: "en" | "it";
                        /** @enum {string} */
                        model?: "claude-haiku-4-5-20251001" | "claude-sonnet-4-6";
                    };
                };
            };
            responses: {
                /** @description Briefing text */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            [key: string]: unknown;
                        };
                    };
                };
                /** @description ACTIVITY_NOT_FOUND — no profile for the requested activity. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Validation error (`VALIDATION_ERROR`), or `MAX_BRIEFING_SLOTS_EXCEEDED` when the request lists more slots than allowed. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description LLM_BUDGET_EXCEEDED — the tenant's monthly LLM token budget is exhausted (distinct from the RATE_LIMITED daily/monthly request cap). */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description INTELLIGENCE_UNAVAILABLE — no Anthropic key is configured for this tenant (set one via PUT /v1/tenant/llm-key). */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenant/llm-key": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get the tenant's Anthropic key status (Anthropic BYOK)
         * @description Never returns the key — only whether one is set, its last 4 characters, and timestamps.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Masked key status */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            set: boolean;
                            last4?: string;
                            /** Format: date-time */
                            setAt?: string;
                            /** Format: date-time */
                            lastValidatedAt?: string | null;
                        };
                    };
                };
                /** @description BYOK storage not configured on this deployment */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        /**
         * Set/rotate the tenant's Anthropic API key (Anthropic BYOK)
         * @description Validates the key with one cheap Anthropic API call before storing. Encrypts at rest (AES-256-GCM); the plaintext key is NEVER echoed back by this or any other endpoint. Available to any authenticated plan. Rate-limited (this call itself makes one real Anthropic API request).
         */
        put: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** @description The tenant's own Anthropic API key (sk-ant-...). */
                        apiKey: string;
                    };
                };
            };
            responses: {
                /** @description Key validated, encrypted, and stored. */
                204: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Validation error, or Anthropic rejected the key (LLM_KEY_INVALID) */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Rate limited */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description BYOK storage or BYOK_MASTER_KEY not configured on this deployment */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        post?: never;
        /**
         * Remove the tenant's Anthropic key (Anthropic BYOK)
         * @description Hard-deletes the stored ciphertext. LLM routes revert to the no-key degraded/503 path for this tenant.
         */
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Key removed. */
                204: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description BYOK storage not configured on this deployment */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projections": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Climate-decadal activity viability projection (Scale)
         * @description Per-decade projection distributions. Each entry carries a climate-mode ConfidenceDetail block (see components.schemas.ConfidenceDetailClimate).
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        spot: {
                            location: components["schemas"]["GeoPoint"];
                            activity: string;
                            spotId?: string;
                        };
                        scenarios: ("SSP1-2.6" | "SSP2-4.5" | "SSP3-7.0" | "SSP5-8.5")[];
                        horizonDecades?: string[];
                        /** @enum {string} */
                        baselineDecade?: "2020s" | "2030s";
                    };
                };
            };
            responses: {
                /** @description Per-decade projection distributions (per-entry confidenceDetail: climate) */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            [key: string]: unknown;
                        };
                    };
                };
                /** @description Requires Scale plan */
                402: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Validation error */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/underwriting/quote": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Parametric underwriting quote (Scale)
         * @description Multi-currency `expectedPremium.byCurrency` — a mixed-currency portfolio returns per-currency stats with no FX conversion. `policy.spot.tier` / `policy.portfolio[i].tier` echo the resolved sub-spot tier (1/2/3) or null when no sub-spot covers the point; `tierSource` marks whether it came from the catalog YAML or L11's data-driven classifier.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        spot?: {
                            point: components["schemas"]["GeoPoint"];
                            activity: string;
                            spotId?: string;
                            payout: {
                                amount: number;
                                /** @enum {string} */
                                currency: "EUR" | "USD" | "GBP" | "CHF";
                            };
                        };
                        portfolio?: {
                            point: components["schemas"]["GeoPoint"];
                            activity: string;
                            spotId?: string;
                            payout: {
                                amount: number;
                                /** @enum {string} */
                                currency: "EUR" | "USD" | "GBP" | "CHF";
                            };
                        }[];
                        coverageWindow: {
                            monthFrom: number;
                            dayFrom: number;
                            monthTo: number;
                            dayTo: number;
                        };
                        trigger: {
                            /** @enum {string} */
                            kind: "scoreBelow";
                            scoreBelow: number;
                            consecutiveHours?: number;
                            cooldownHours?: number;
                            maxPayoutsPerYear?: number;
                        } | {
                            /** @enum {string} */
                            kind: "verdictAtOrBelow";
                            verdict: components["schemas"]["Verdict"];
                            consecutiveHours?: number;
                            cooldownHours?: number;
                            maxPayoutsPerYear?: number;
                        };
                        historicalYearsRange?: {
                            from: number;
                            to: number;
                        };
                        loadingFactor?: number;
                        calibrationConfidenceMin?: number;
                        forceIssue?: boolean;
                    };
                };
            };
            responses: {
                /** @description Premium + policy echo (with per-spot tier + tierSource) + bindable quote id when policy store is wired */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnderwritingQuoteResponse"];
                    };
                };
                /** @description Requires Scale plan */
                402: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description No profile for activity. `detail` carries `valid_slugs` (see GET /v1/activities) plus a fuzzy `did_you_mean` suggestion when one catalog slug is a close match. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Validation error / low confidence / invalid trigger */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description HistoricalProvider not configured */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/underwriting/quote/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetch a bindable quote by id (Scale)
         * @description Tenant-scoped read of a quote created via POST /v1/underwriting/quote. Returns the same body shape as the create response (with the optional `boundPolicyId` populated once the quote has been bound).
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Quote record (may include boundPolicyId when already bound) */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnderwritingQuoteResponse"];
                    };
                };
                /** @description Requires Scale plan */
                402: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Quote not found for this tenant */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Quote persistence not configured */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/underwriting/policy/bind": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Bind a parametric policy (Scale)
         * @description Convert a bindable quote (≤24h old) into a bound policy for a specific coverage year. Returns the serialised policy + the quoteId + optional `driftAdvisories` — a soft warning surfaced when the resolved cell has an open watch-level L9 drift event. A warning/critical drift event at bind time REFUSES the bind with 422 DRIFT_ACTIVE (see the 422 response). Fires the `underwriting.policy.bound` webhook on success. Supports the optional `Idempotency-Key` header (see parameter description) so a client-side retry after a network timeout can't double-bind.
         */
        post: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional client-generated key (unique per logical request, scoped to your tenant). A retry with the SAME key and the SAME request body replays the original response verbatim without re-executing the request. A retry with the same key and a DIFFERENT body, or one that arrives while the original is still in flight, returns 409 IDEMPOTENCY_KEY_CONFLICT. Claims expire after 24h. */
                    "Idempotency-Key"?: string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** Format: uuid */
                        quoteId: string;
                        coverageYear: number;
                        /** @enum {string} */
                        premiumCollection: "external" | "stripe" | "invoice_due";
                        premiumPaid?: number;
                    };
                };
            };
            responses: {
                /** @description Policy bound */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            policy: components["schemas"]["SerialisedPolicy"];
                            /** Format: uuid */
                            quoteId: string;
                            /** @description Soft warnings for cells with an open watch-level L9 drift event. Present only when non-empty. */
                            driftAdvisories?: {
                                spotIndex: number;
                                activity: string;
                                subSpotSlug: string;
                                /** @enum {string} */
                                severity: "watch";
                                /** Format: date-time */
                                since: string;
                            }[];
                        };
                    };
                };
                /** @description Requires Scale plan */
                402: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Quote not found for this tenant */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Quote already bound to another policy (QUOTE_ALREADY_BOUND), or IDEMPOTENCY_KEY_CONFLICT — a request with this Idempotency-Key is still in flight, or was already used with a different request body */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Validation error / quote expired / quote not issuable / catalog drift / DRIFT_ACTIVE (open warning or critical drift event on resolved cell — `detail.openDriftEvents` lists each blocking cell) */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Policy persistence not configured */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/underwriting/policy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List bound policies for the caller's tenant (Scale)
         * @description Paginated list of every bound policy owned by the calling tenant. Ordered by boundAt DESC.
         */
        get: {
            parameters: {
                query?: {
                    status?: "bound" | "triggered" | "settled" | "expired";
                    coverageYear?: number;
                    limit?: number;
                    cursor?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Bound policies for this tenant */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            policies: components["schemas"]["SerialisedPolicy"][];
                        };
                    };
                };
                /** @description Requires Scale plan */
                402: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Validation error */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Policy persistence not configured */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/underwriting/policy/{policyId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetch a single policy by id (Scale)
         * @description Read-only lookup. Cross-tenant policies return 404.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    policyId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Policy record + payout events */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            policy: components["schemas"]["SerialisedPolicy"];
                            events: components["schemas"]["SerialisedPayoutEvent"][];
                        };
                    };
                };
                /** @description Requires Scale plan */
                402: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Policy not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Policy persistence not configured */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/underwriting/policy/{policyId}/evaluate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Re-evaluate a bound policy against historical replay (Scale)
         * @description Runs the trigger walk against the historical archive for the policy's coverage year and inserts any newly detected payout events. No request body. Fires the `underwriting.policy.triggered` webhook the first time new events are inserted.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    policyId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Policy + payout events + counts of newly inserted / skipped */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            policy: components["schemas"]["SerialisedPolicy"];
                            events: components["schemas"]["SerialisedPayoutEvent"][];
                            inserted: number;
                            skipped: number;
                        };
                    };
                };
                /** @description Requires Scale plan */
                402: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Policy not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Policy in a terminal state (settled / expired) */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Policy persistence or HistoricalProvider not configured */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/underwriting/policy/{policyId}/settle": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Settle a bound policy (platform-ops only)
         * @description PLATFORM-OPS ONLY — requires the `platform_admin` scope (cross-tenant Goable/underwriter operation, not a policyholder self-service action). Records the settlement wire reference + freezes the payout, and fires the `underwriting.policy.settled` webhook. Normally invoked by the daily settlement cron; use manually only for out-of-band settlement.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    policyId: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        settlementReference: string;
                        /** Format: date-time */
                        settledAt?: string;
                    };
                };
            };
            responses: {
                /** @description Settled policy */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            policy: components["schemas"]["SerialisedPolicy"];
                        };
                    };
                };
                /** @description Requires Scale plan */
                402: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Missing scope: platform_admin */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Policy not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Validation error or policy not in a settleable state */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Policy persistence not configured */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/score/{sessionId}/outcome": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Report observed outcome for a scored session
         * @description Close the calibration loop for a specific scored session. Submit the actual outcome (ran/cancelled/no_show/rescheduled/note) of a /v1/score session. `{sessionId}` MUST be a `session_id` returned by a POST /v1/score response (i.e. a `scoring_audit_log` id); an unknown or cross-tenant id is rejected 404 (nothing is persisted). The write is SYNCHRONOUS and DURABLE: this endpoint routes through the SAME persist path as POST /v1/outcomes (the outcome row lands with `audit_log_id = {sessionId}`, joinable in the forecast-verification MV) and fires the same `outcome.created` webhook. It is NOT fire-and-forget and is NOT merely queued. The calibration pipeline + forecast verification + drift monitor consume these. Either endpoint works — use POST /v1/outcomes for un-sessioned or batch outcomes, this endpoint for an outcome tied to one specific scored session. Requires the `outcomes:write` scope (both live AND test keys carry it; a test key's outcomes persist and are listable but are quarantined — `is_test` — out of calibration). Supports the optional `Idempotency-Key` header (see parameter description) so a client-side retry can't record the same outcome twice. The `outcome.created` webhook payload for this path is identical to POST /v1/outcomes: it carries `auditLogId` (= {sessionId}), `occurredAt`, `activitySlug`, and `outcomeType` — there is no longer a bespoke `sessionId` key.
         */
        post: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional client-generated key (unique per logical request, scoped to your tenant). A retry with the SAME key and the SAME request body replays the original response verbatim without re-executing the request. A retry with the same key and a DIFFERENT body, or one that arrives while the original is still in flight, returns 409 IDEMPOTENCY_KEY_CONFLICT. Claims expire after 24h. */
                    "Idempotency-Key"?: string;
                };
                path: {
                    /** @description Session UUID returned in the /v1/score response metadata. */
                    sessionId: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** @enum {string} */
                        outcome_type: "ran" | "cancelled" | "rescheduled" | "no_show" | "note";
                        /**
                         * @description Structured cause when a session did not run as planned. Only 'weather' and 'safety' outcomes count as evidence against the forecast score and feed weather-suitability calibration; 'operational', 'customer_demand', 'mechanical', and 'unknown' are treated as business facts and excluded. Echoed on the outcome.created webhook.
                         * @enum {string}
                         */
                        reason_category?: "weather" | "operational" | "customer_demand" | "safety" | "mechanical" | "unknown";
                        detail?: {
                            [key: string]: unknown;
                        };
                    };
                };
            };
            responses: {
                /** @description Outcome persisted (synchronous + durable, written through the same path as POST /v1/outcomes with `audit_log_id = {sessionId}`; the `outcome.created` webhook has fired). Not a queued/deferred no-op. */
                202: {
                    headers: {
                        /** @description Daily safety cap for this endpoint + plan (not the monthly billing quota). Omitted on unlimited (Scale) plans. */
                        "X-RateLimit-Limit"?: number;
                        /** @description Requests remaining in the current UTC-midnight daily window. Omitted on unlimited (Scale) plans. */
                        "X-RateLimit-Remaining"?: number;
                        /** @description Unix timestamp (seconds) at which the daily window resets. Omitted on unlimited (Scale) plans. */
                        "X-RateLimit-Reset"?: number;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            [key: string]: unknown;
                        };
                    };
                };
                /** @description Missing scope: outcomes:write */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description SESSION_NOT_FOUND — `{sessionId}` matches no scored session for this tenant (unknown id, or a cross-tenant / /v1/score/multi / /v1/score/series session_id, which never write an audit row and are not linkable). Nothing is persisted. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description IDEMPOTENCY_KEY_CONFLICT — a request with this Idempotency-Key is still in flight, or was already used with a different request body */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Validation error */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Rate limit exceeded for this endpoint + plan (`RATE_LIMITED`). Covers both the daily safety cap and the monthly usage quota — `detail.scope` is `daily` or `monthly_quota`. `Retry-After` is set on both. */
                429: {
                    headers: {
                        /** @description Seconds until the exceeded rate-limit window resets. Present on every 429 from a rate-limited route — both the daily safety-cap 429 (resets at 00:00 UTC) and the monthly-quota 429 (resets at 00:00 UTC on the 1st of next month). `detail.scope` on the body distinguishes `daily` vs `monthly_quota`. */
                        "Retry-After"?: number;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/score/difficulty": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * L15 intrinsic-difficulty atlas lookup (Pro+)
         * @description Returns the per-dimension intrinsic difficulty curve δ(x) for the sub-spot the (activity, location) resolves to. Pure atlas read — no scoring, no weather fetch. 404 NO_DIFFICULTY_ATLAS when the sub-spot resolves but no atlas row exists yet (dormant cell — communicated honestly rather than synthesised).
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        activity: string;
                        location: components["schemas"]["GeoPoint"];
                    };
                };
            };
            responses: {
                /** @description Per-dimension intrinsic difficulty curves for the resolved sub-spot */
                200: {
                    headers: {
                        /** @description Daily safety cap for this endpoint + plan (not the monthly billing quota). Omitted on unlimited (Scale) plans. */
                        "X-RateLimit-Limit"?: number;
                        /** @description Requests remaining in the current UTC-midnight daily window. Omitted on unlimited (Scale) plans. */
                        "X-RateLimit-Remaining"?: number;
                        /** @description Unix timestamp (seconds) at which the daily window resets. Omitted on unlimited (Scale) plans. */
                        "X-RateLimit-Reset"?: number;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            resolved: {
                                /** @enum {string} */
                                level: "sub-spot" | "cluster" | "region" | "base";
                                slug: string;
                                sub_spot_slug?: string;
                                distance_to_sub_spot_m?: number;
                            };
                            dimensions: {
                                dimension: string;
                                grid: number[];
                                difficulty: number[];
                                discrimination_a: number;
                                cohort_hash: string;
                                /** Format: date-time */
                                computed_at: string;
                            }[];
                        };
                    };
                };
                /** @description PLAN_UPGRADE_REQUIRED — the difficulty atlas is gated to Pro+ (the `requirePlanAtLeast('pro')` middleware). */
                402: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description ACTIVITY_NOT_FOUND (no profile for the activity) or NOT_FOUND (the sub-spot resolved but no atlas row exists yet). */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Validation error */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Rate limit exceeded for this endpoint + plan (`RATE_LIMITED`). Covers both the daily safety cap and the monthly usage quota — `detail.scope` is `daily` or `monthly_quota`. `Retry-After` is set on both. */
                429: {
                    headers: {
                        /** @description Seconds until the exceeded rate-limit window resets. Present on every 429 from a rate-limited route — both the daily safety-cap 429 (resets at 00:00 UTC) and the monthly-quota 429 (resets at 00:00 UTC on the 1st of next month). `detail.scope` on the body distinguishes `daily` vs `monthly_quota`. */
                        "Retry-After"?: number;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description SERVICE_UNAVAILABLE — the difficulty atlas reader is not wired on this deployment. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/recommend-spot": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Spot recommender — inverse query (L10)
         * @description Given (activity, region center, radius, window) → top-K ranked sub-spots in the catalog. Composition of L1-L3 scoring + L4.6 confidence + L6 personal blend (Pro+, when pseudonym supplied). Plan caps: radius 25/50/200/1000 km, topK 5/10/20/50 across Free / Starter / Pro / Scale. Personalization Pro+ only. Hard-gated candidates (lightning ≥ 0.85, AQI hazardous) are dropped from results; `allGated=true` distinguishes 'all in-radius spots were unsafe' from 'no spots in radius at all'.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        activity: string;
                        regionCenter: components["schemas"]["GeoPoint"];
                        radiusKm: number;
                        topK: number;
                        window?: components["schemas"]["TimeWindow"];
                        /** @description Optional booking-platform-side pseudonym. When present, Pro+ tenants get personalization via the L6 cold-start blend (cap 0.5 weight). */
                        userPseudonym?: string;
                    };
                };
            };
            responses: {
                /** @description Ranked top-K sub-spots + observability metadata. The optional `coverage` field appears only on empty results from a catalog gap (not from hard-gating). */
                200: {
                    headers: {
                        /** @description Daily safety cap for this endpoint + plan (not the monthly billing quota). Omitted on unlimited (Scale) plans. */
                        "X-RateLimit-Limit"?: number;
                        /** @description Requests remaining in the current UTC-midnight daily window. Omitted on unlimited (Scale) plans. */
                        "X-RateLimit-Remaining"?: number;
                        /** @description Unix timestamp (seconds) at which the daily window resets. Omitted on unlimited (Scale) plans. */
                        "X-RateLimit-Reset"?: number;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            results?: {
                                spotSlug?: string;
                                name?: string;
                                location?: components["schemas"]["GeoPoint"];
                                distanceKm?: number;
                                score?: number;
                                effectiveScore?: number;
                                verdict?: string;
                                personalScore?: number | null;
                                personalWeight?: number;
                                rank?: number;
                            }[];
                            allGated?: boolean;
                            totalCandidates?: number;
                            rankedCandidates?: number;
                            effectiveRadiusKm?: number;
                            effectiveTopK?: number;
                            personalizationApplied?: boolean;
                            latencyMs?: number;
                            coverage?: {
                                /** @enum {string} */
                                status: "no_subspots_in_radius";
                                nearestSubSpot: {
                                    slug: string;
                                    name: string;
                                    distanceKm: number;
                                };
                                /** @enum {string} */
                                suggestedAction: "expand_radius";
                                suggestedRadiusKm: number;
                            } | {
                                /** @enum {string} */
                                status: "no_subspots_for_activity";
                                /** @enum {string} */
                                suggestedAction: "request_coverage";
                            };
                        };
                    };
                };
                /** @description Missing/invalid bearer token */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Plan limit exceeded (radius or topK above plan cap) */
                402: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Validation error or unknown activity */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Rate limit exceeded for this endpoint + plan (`RATE_LIMITED`). Covers both the daily safety cap and the monthly usage quota — `detail.scope` is `daily` or `monthly_quota`. `Retry-After` is set on both. */
                429: {
                    headers: {
                        /** @description Seconds until the exceeded rate-limit window resets. Present on every 429 from a rate-limited route — both the daily safety-cap 429 (resets at 00:00 UTC) and the monthly-quota 429 (resets at 00:00 UTC on the 1st of next month). `detail.scope` on the body distinguishes `daily` vs `monthly_quota`. */
                        "Retry-After"?: number;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Spatial resolver not wired */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/intelligence/edge-case": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * LLM analysis of a borderline / surprising score (L2c, any plan — Anthropic BYOK)
         * @description Asks the LLM to inspect a score that's near a verdict boundary or contradicts operator intuition. Returns a narrative + a structured `limiting_class` taxonomy entry. Requires the tenant's own Anthropic key (PUT /v1/tenant/llm-key) — no longer plan-gated.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        location: components["schemas"]["GeoPoint"];
                        scoreResult?: components["schemas"]["ScoreResponse"];
                        /** Format: uuid */
                        session_id?: string;
                        /** @enum {string} */
                        locale?: "en" | "it";
                        /** @enum {string} */
                        model?: "claude-haiku-4-5-20251001" | "claude-sonnet-4-6";
                    };
                };
            };
            responses: {
                /** @description Narrative + limiting_class */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            [key: string]: unknown;
                        };
                    };
                };
                /** @description Validation error */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description No Anthropic key configured for this tenant */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projections/portfolio": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Climate projections across a portfolio of spots (Scale) */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        spots: {
                            location: components["schemas"]["GeoPoint"];
                            activity: string;
                            spotId?: string;
                        }[];
                        scenarios: ("SSP1-2.6" | "SSP2-4.5" | "SSP3-7.0" | "SSP5-8.5")[];
                        horizonDecades?: string[];
                        /** @enum {string} */
                        baselineDecade?: "2020s" | "2030s";
                    };
                };
            };
            responses: {
                /** @description Per-spot per-decade projection distributions */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            [key: string]: unknown;
                        };
                    };
                };
                /** @description Requires Scale plan */
                402: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Validation error */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projections/adaptation-report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Climate adaptation report for an operator (Scale)
         * @description Combines projections across a portfolio + qualitative summary of which dimensions are likely to bind (wind shifts, water-temp shifts, etc.). Designed as input for a tourism-board adaptation plan.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        spots: ({
                            location: components["schemas"]["GeoPoint"];
                            activity: string;
                            spotId?: string;
                            subSpotSlug?: string;
                        } & {
                            [key: string]: unknown;
                        })[];
                        scenarios: ("SSP1-2.6" | "SSP2-4.5" | "SSP3-7.0" | "SSP5-8.5")[];
                        horizonDecades?: string[];
                    } & {
                        [key: string]: unknown;
                    };
                };
            };
            responses: {
                /** @description Adaptation report + binding-dimension summary */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            [key: string]: unknown;
                        };
                    };
                };
                /** @description Requires Scale plan */
                402: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Validation error */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/observations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Submit station observations for data assimilation (Pro+)
         * @description Push tenant-station observations (wind / wave / temperature / etc.) into the 0-6h assimilation window. The optimal-interpolation blending pulls them into forecast samples for nearby spots, improving short-horizon skill.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** Format: uuid */
                        stationId: string;
                        observations: {
                            /** Format: date-time */
                            observedAt: string;
                            /** @enum {string} */
                            variable: "wind_speed_kn" | "wind_dir_deg" | "wave_height_m" | "temp_c" | "sea_surface_temp_c" | "pressure_hpa" | "precip_mm";
                            value: number;
                            /** @enum {string} */
                            qualityFlag?: "verified" | "unflagged" | "flagged_low_quality";
                        }[];
                    };
                };
            };
            responses: {
                /** @description Accepted */
                202: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            [key: string]: unknown;
                        };
                    };
                };
                /** @description Requires Pro+ plan */
                402: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Station not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Station inactive */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Validation error / observation in future / variable mismatch */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Observation store not wired */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/observations/stations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List tenant stations */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of stations */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            [key: string]: unknown;
                        };
                    };
                };
                /** @description Station registry not wired */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        put?: never;
        /** Register a tenant observation station */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        name: string;
                        point: components["schemas"]["GeoPoint"];
                        altitudeM?: number;
                        variables: ("wind_speed_kn" | "wind_dir_deg" | "wave_height_m" | "temp_c" | "sea_surface_temp_c" | "pressure_hpa" | "precip_mm")[];
                        /** @enum {string} */
                        stationClass?: "verified" | "unflagged" | "flagged_low_quality";
                        updateCadenceMinutes?: number;
                        notes?: string;
                    };
                };
            };
            responses: {
                /** @description Station created */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            [key: string]: unknown;
                        };
                    };
                };
                /** @description Validation error */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Station registry not wired */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/observations/stations/{stationId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Update a station */
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    stationId: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        name?: string;
                        point?: components["schemas"]["GeoPoint"];
                        altitudeM?: number;
                        variables?: ("wind_speed_kn" | "wind_dir_deg" | "wave_height_m" | "temp_c" | "sea_surface_temp_c" | "pressure_hpa" | "precip_mm")[];
                        /** @enum {string} */
                        stationClass?: "verified" | "unflagged" | "flagged_low_quality";
                        updateCadenceMinutes?: number;
                        active?: boolean;
                        notes?: string;
                    };
                };
            };
            responses: {
                /** @description Updated station */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            [key: string]: unknown;
                        };
                    };
                };
                /** @description Station not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Validation error */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Station registry not wired */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        trace?: never;
    };
    "/v1/observations/stations/{stationId}/recent": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Recent observations for a tenant station
         * @description Returns up to `limit` most-recent observations submitted for the station (tenant-scoped). Useful for the tenant's own dashboard / debugging feed. Requires the `score:read` scope.
         */
        get: {
            parameters: {
                query?: {
                    limit?: number;
                };
                header?: never;
                path: {
                    stationId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Most-recent observations for this station (descending by observedAt) */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            observations: {
                                /** Format: uuid */
                                id: string;
                                /** Format: uuid */
                                stationId: string;
                                /** Format: date-time */
                                observedAt: string;
                                /** @enum {string} */
                                variable: "wind_speed_kn" | "wind_dir_deg" | "wave_height_m" | "temp_c" | "sea_surface_temp_c" | "pressure_hpa" | "precip_mm";
                                value: number;
                                /** @enum {string|null} */
                                qualityFlag?: "verified" | "unflagged" | "flagged_low_quality" | null;
                                /** Format: date-time */
                                ingestedAt: string;
                            }[];
                        };
                    };
                };
                /** @description Station not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Observation store not wired */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/public/signup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Self-service tenant signup (no auth)
         * @description Public endpoint, IP-rate-limited (3 attempts / 24h / IP). Creates a tenant + sends a magic-link to the contact email. Always returns 202 on success — never reveals whether an email is already registered. Optional Cloudflare Turnstile token strengthens the gate.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        displayName: string;
                        /** Format: email */
                        contactEmail: string;
                        /**
                         * @description Must be true — records ToS / Privacy / DPA acceptance.
                         * @enum {boolean}
                         */
                        acceptTerms: true;
                        turnstileToken?: string;
                    };
                };
            };
            responses: {
                /** @description Accepted — magic-link sent if signup valid */
                202: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            [key: string]: unknown;
                        };
                    };
                };
                /** @description Validation error */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description IP rate limit exceeded */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/public/sustainability-index": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Public Goable Sustainability Index (no auth, JSON-LD)
         * @description Public JSON-LD artefact of the Goable Sustainability Index (CC BY 4.0) — the LATEST PUBLISHED, frozen, signed annual report (or the report for `?year=N`). This is a stored, immutable document, not a live on-demand aggregate: no unpublished figure is ever served here. When nothing has been published yet (for the requested year, or at all), the response is the same document shape with zero zones/sessions and `publication: null` — the honest empty-state. Content-Type: application/ld+json. Edge-cached for 5 minutes.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Report year. Omit to get the most recently published year. */
                    year?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Sustainability Index document (JSON-LD), with publication metadata */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/ld+json": {
                            /** @example https://schema.org */
                            "@context": string;
                            /** @enum {string} */
                            "@type": "GoableSustainabilityIndex";
                            /** Format: date-time */
                            generatedAt: string;
                            period: {
                                /** Format: date-time */
                                from: string;
                                /** Format: date-time */
                                to: string;
                            };
                            methodology: {
                                indexFormula: string;
                                weights: {
                                    carbonNeutralShare: number;
                                    electrificationShare: number;
                                };
                                suppression: string;
                                notes: string;
                            };
                            overall: {
                                index: number;
                                totalSessions: number;
                                carbonNeutralSessions: number;
                                carbonPositiveSessions: number;
                                carbonNeutralShare: number;
                                zonesReleased: number;
                                zonesSuppressed: number;
                            };
                            zones: {
                                zoneKey: string;
                                label: string | null;
                                centroid: components["schemas"]["GeoPoint"] | null;
                                totalSessions: number;
                                carbonNeutralShare: number;
                                electrificationShare: number | null;
                                seasonalConcentration: number | null;
                                zoneIndex: number;
                            }[];
                            /** @enum {string} */
                            license: "CC BY 4.0";
                            attribution: string;
                            /** @description Signing/publication metadata for the frozen report. null when no report has been published for this period (the honest empty-state) — every other field above is then a zero-data placeholder, not a real figure. */
                            publication: null | {
                                year: number;
                                revision: number;
                                /** Format: date-time */
                                publishedAt: string;
                                signedBy: string;
                                methodologyVersion: string;
                            };
                        } & {
                            [key: string]: unknown;
                        };
                    };
                };
                /** @description Validation error */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Sustainability index publication store not wired */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/research/verification/export": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Public Stream F forecast verification export (no auth, JSONL)
         * @description Streamed newline-delimited JSON (`application/x-ndjson`) — one anonymised (activity × 1km² grid × weekly bucket) skill cell per line, followed by a trailing metadata line. CC BY 4.0. Governance: k≥10 contributor floor + 90-day publication lag + `research_eligible=true` filter enforced in the SQL reader.
         */
        get: {
            parameters: {
                query?: {
                    from?: string;
                    to?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Streamed JSONL — one cell per line + trailing meta line */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/x-ndjson": string;
                    };
                };
                /** @description Validation error */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Verification reader not wired */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/research/difficulty-atlas/export.jsonl": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Public L15 Difficulty Atlas export (no auth, JSONL)
         * @description Streamed newline-delimited JSON (`application/x-ndjson`) — one anonymised (activity × sub-spot × dimension) difficulty row per line, followed by a trailing metadata line. CC BY 4.0. First openly-available intrinsic-difficulty measurement for outdoor activities. Governance mirrors Stream F: k≥10 contributors + 90-day publication lag.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Streamed JSONL — one atlas row per line + trailing meta line */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/x-ndjson": string;
                    };
                };
                /** @description Difficulty atlas reader not wired */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/public/catalog-stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Open catalogue coverage stats (no auth)
         * @description Live coverage numbers for the open activity catalogue (CC BY 4.0). Returns totals across activities · sub-spots · clusters · regions · countries plus a per-activity breakdown with country codes + status (`seeded` ≥10 sub-spots / `partial` 1-9 / `empty` 0). Edge-cached for 5 minutes — new sub-spots ship via PR + release cycle, not at runtime. Same JSON the /catalog landing renders; expose this surface for marketing / partner sites that want to embed live numbers without scraping HTML.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Live coverage stats from the @goable-io/profiles-catalog package */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: date-time
                             * @description ISO timestamp the bundled JSON was computed at
                             */
                            computedAt: string;
                            /** @description Catalog package version (mirrors package.json) */
                            catalogVersion: string;
                            totals: {
                                activities: number;
                                subSpots: number;
                                clusters: number;
                                regions: number;
                                countries: number;
                            };
                            /** @description One entry per base profile, sorted DESC by subSpotCount. */
                            byActivity: {
                                slug?: string;
                                /** @enum {string} */
                                family?: "water" | "snow" | "air" | "land";
                                displayName?: string;
                                subSpotCount?: number;
                                clusterCount?: number;
                                countryCount?: number;
                                countries?: string[];
                                clusters?: {
                                    slug?: string;
                                    displayName?: string;
                                    countryCode?: string;
                                    subSpotCount?: number;
                                }[];
                                /**
                                 * @description seeded ≥10 sub-spots · partial 1-9 · empty 0
                                 * @enum {string}
                                 */
                                status?: "seeded" | "partial" | "empty";
                                /**
                                 * Format: date-time
                                 * @description Newest commit touching the activity dir (null when no sub-spots yet)
                                 */
                                lastUpdatedAt?: string | null;
                            }[];
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/outcomes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Report a standalone activity outcome
         * @description Submit an observed outcome — the operator-reported behavioural signal behind the calibration + research datasets. The write is SYNCHRONOUS and DURABLE (persisted before the 202 returns, then the `outcome.created` webhook fires). Use this endpoint for un-sessioned or batch outcomes; for an outcome tied to one specific scored session, POST /v1/score/{sessionId}/outcome is equivalent and derives the link for you. Either endpoint persists through the same path. To link an outcome here to a scored session, pass its POST /v1/score `session_id` as `audit_log_id`. Requires the `outcomes:write` scope (both live AND test keys carry it; a test key's outcomes persist and are listable but are quarantined — `is_test` — out of calibration). Supports the optional `Idempotency-Key` header (see parameter description) so a retried batch submission records each outcome exactly once.
         */
        post: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional client-generated key (unique per logical request, scoped to your tenant). A retry with the SAME key and the SAME request body replays the original response verbatim without re-executing the request. A retry with the same key and a DIFFERENT body, or one that arrives while the original is still in flight, returns 409 IDEMPOTENCY_KEY_CONFLICT. Claims expire after 24h. */
                    "Idempotency-Key"?: string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** Format: date-time */
                        occurred_at: string;
                        activity_slug: string;
                        /** @enum {string} */
                        outcome_type: "ran" | "cancelled" | "rescheduled" | "no_show" | "note";
                        /** @description Optional catalogue sub-spot slug. */
                        spot_id?: string;
                        /** @description Optional link back to a scored session — pass a `session_id` from a POST /v1/score response. It is verified against `scoring_audit_log` before persist: an id resolving to no scored session (e.g. a /v1/score/multi or /v1/score/series session_id, which never write an audit row) is rejected 404 AUDIT_LOG_NOT_FOUND rather than silently persisted as an orphan the verification MV drops. Omit it for an un-sessioned outcome. */
                        audit_log_id?: string;
                        detail?: {
                            [key: string]: unknown;
                        };
                        /**
                         * @description Stream G equipment-transition signal.
                         * @enum {string}
                         */
                        equipment_type?: "electric" | "combustion" | "manual";
                        /**
                         * @description Structured cause when a session did not run as planned. Only 'weather' and 'safety' outcomes count as evidence against the forecast score and feed weather-suitability calibration; 'operational', 'customer_demand', 'mechanical', and 'unknown' are treated as business facts and excluded.
                         * @enum {string}
                         */
                        reason_category?: "weather" | "operational" | "customer_demand" | "safety" | "mechanical" | "unknown";
                        /** @description Participants in the session. Captured and disclosed (e.g. average group size) but held out of the sustainability composite pending a site carrying-capacity baseline. */
                        group_size?: number;
                        /**
                         * @description Operator annual declaration of the facility's energy source.
                         * @enum {string}
                         */
                        facility_renewable_energy?: "renewable" | "mixed" | "grid" | "unknown";
                        /**
                         * @description How participants got to the session. Highest-materiality but lowest-substantiability signal (an operator estimate) — reported as an estimate, not a measured value.
                         * @enum {string}
                         */
                        access_mode?: "foot" | "bike" | "public_transport" | "car" | "boat" | "flight" | "mixed" | "unknown";
                        /**
                         * @description Whether the equipment used was rented/shared, owned, or a mix (circularity proxy).
                         * @enum {string}
                         */
                        equipment_provenance?: "rental_shared" | "owned" | "mixed" | "unknown";
                        /** @description Client-supplied lot / ingestion-run handle. Tag a batch of outcomes with a shared value so a later POST /v1/outcomes/void can recall exactly that lot if it was mislabelled. */
                        batch_ref?: string;
                    };
                };
            };
            responses: {
                /** @description Outcome persisted (synchronous + durable; the `outcome.created` webhook has fired). Not a queued/deferred no-op. */
                202: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            [key: string]: unknown;
                        };
                    };
                };
                /** @description Missing scope: outcomes:write */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description AUDIT_LOG_NOT_FOUND — the supplied `audit_log_id` resolves to no scored session for this tenant (unknown id, or a non-linkable /v1/score/multi or /v1/score/series session_id). Rejected rather than persisted as an orphan. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description IDEMPOTENCY_KEY_CONFLICT — a request with this Idempotency-Key is still in flight, or was already used with a different request body */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Validation error */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/outcomes/void": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Recall (void) a batch of previously-reported outcomes
         * @description Non-destructive 'lot recall'. When an integration mislabels a batch — e.g. tags operational cancellations as reason_category='weather' — pull that lot back here instead of deleting it. Matching rows are stamped voided (kept for audit) and drop out of the verification MV + cohort signal on the next refresh, so they stop influencing the engine. Scoped to the calling key's tenant. Idempotent — already-voided rows are skipped. At least one narrowing selector (batch_ref, audit_log_id, submitted_by_key_id, occurred_from, occurred_to) is REQUIRED so a recall can never blank a tenant's whole history. Requires the `outcomes:write` scope.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** @description Why the lot is being recalled — recorded on every voided row for audit. */
                        reason: string;
                        /** @description Recall the lot tagged with this batch_ref. */
                        batch_ref?: string;
                        /** @description Recall the single outcome linked to this scored session. */
                        audit_log_id?: string;
                        /** @description Recall everything a given API key submitted (combine with occurred_from/to). */
                        submitted_by_key_id?: string;
                        /** Format: date-time */
                        occurred_from?: string;
                        /** Format: date-time */
                        occurred_to?: string;
                        /**
                         * @description Narrow the recall to a single outcome_type.
                         * @enum {string}
                         */
                        outcome_type?: "ran" | "cancelled" | "rescheduled" | "no_show" | "note";
                        /**
                         * @description Narrow the recall to a single reason_category — e.g. void only the rows a dev mislabelled 'weather'.
                         * @enum {string}
                         */
                        reason_category?: "weather" | "operational" | "customer_demand" | "safety" | "mechanical" | "unknown";
                    };
                };
            };
            responses: {
                /** @description Number of rows newly voided by this recall. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            voided: number;
                        };
                    };
                };
                /** @description Missing scope: outcomes:write */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Validation error, or no narrowing selector provided */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/audit/export": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Export the caller's own score + outcome audit history
         * @description Tenant-scoped export of your own scoring_audit_log activity (one row per /v1/score call, with any linked outcome inline), date-range filtered. The tenant is always the calling API key's tenant — there is no way to request another tenant's data. Outcomes reported via the free-standing POST /v1/outcomes (i.e. not linked to a specific score via audit_log_id) are not included. Offset-paginated; `X-Total-Count` on every response carries the total row count for the window.
         */
        get: {
            parameters: {
                query: {
                    from: string;
                    to: string;
                    format?: "csv" | "json";
                    limit?: number;
                    offset?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description CSV (format=csv) or JSON (format=json, default) export of the window. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            rows: {
                                [key: string]: unknown;
                            }[];
                            meta: {
                                total: number;
                                limit: number;
                                offset: number;
                                window: {
                                    from?: string;
                                    to?: string;
                                };
                            };
                        };
                        "text/csv": string;
                    };
                };
                /** @description Validation error, `to` before `from`, or WINDOW_TOO_LARGE (range exceeds 366 days) */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Audit export is not configured */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/legal/{kind}/current": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetch the current published legal document (no auth)
         * @description Public read of the currently-published version of a legal document (Terms of Service, Privacy Policy, DPA, SLA, Acceptable Use, Cookie Policy). Returns the full body + content hash + published timestamp. Used by the signup flow + marketing site to render always-current legal copy without hardcoding it.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Legal document kind. */
                    kind: "terms_of_service" | "privacy_policy" | "data_processing_agreement" | "sla" | "acceptable_use" | "cookie_policy";
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description The current published document of the requested kind */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            document: {
                                /** Format: uuid */
                                id: string;
                                kind: string;
                                version: string;
                                title: string;
                                body: string;
                                contentHash: string;
                                status: string;
                                /** Format: date-time */
                                createdAt: string;
                                /** Format: date-time */
                                publishedAt: string | null;
                            };
                        };
                    };
                };
                /** @description Unknown document kind, or no published document */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Legal document store not wired */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        GeoPoint: {
            /** @example 36.0133 */
            lat: number;
            /** @example -5.6044 */
            lng: number;
        };
        TimeWindow: {
            /** Format: date-time */
            from: string;
            /** Format: date-time */
            to: string;
        };
        Error: {
            /**
             * @description Machine-readable error code — the stable field to switch on (the human `message` is not stable and not localized). The enum is the canonical registry from the API's `httpErrors.ts`; a client should still keep a generic fallback for a code added by a future release.
             *
             *     The three 402 'upgrade needed' codes are distinct and NOT interchangeable:
             *     - `PAYMENT_REQUIRED` — a specific premium capability was requested on a plan that doesn't include it (e.g. ensemble scoring, or historical/portfolio scoring, on Free/Starter). Emitted inline by /v1/score, /v1/score/series, /v1/score/multi, /v1/score/historical, /v1/score/portfolio, /v1/underwriting/*, /v1/projections.
             *     - `PLAN_UPGRADE_REQUIRED` — a whole endpoint is gated below a minimum plan tier (the `requirePlanAtLeast` middleware). Emitted by e.g. /v1/score/difficulty and other Pro+/Scale-gated routes.
             *     - `PLAN_LIMIT_EXCEEDED` — the plan is allowed but a per-plan numeric cap was exceeded (e.g. recommend radiusKm / topK). Emitted by /v1/recommend-spot; carries `detail.maxKm` / `detail.maxTopK`.
             * @enum {string}
             */
            error: "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "VALIDATION_ERROR" | "RATE_LIMITED" | "PLAN_UPGRADE_REQUIRED" | "PLAN_LIMIT_EXCEEDED" | "PAYMENT_REQUIRED" | "SESSION_NOT_FOUND" | "AUDIT_LOG_NOT_FOUND" | "ACTIVITY_NOT_FOUND" | "API_KEY_NOT_FOUND" | "TENANT_NOT_FOUND" | "PAID_PLAN_REQUIRES_STRIPE_CUSTOMER" | "CUSTOM_TENANT_STRIPE_CONFLICT" | "STRIPE_CUSTOMER_TAKEN" | "UNKNOWN_SCOPES" | "SESSION_LOOKUP_UNAVAILABLE" | "MAX_BRIEFING_SLOTS_EXCEEDED" | "OUT_OF_EDGE_CASE_RANGE" | "LLM_BUDGET_EXCEEDED" | "LLM_KEY_INVALID" | "WINDOW_TOO_LARGE" | "FORECAST_HORIZON_EXCEEDED" | "PORTFOLIO_TOO_LARGE" | "MAX_ACTIVITIES_EXCEEDED" | "ARCHIVE_UNAVAILABLE" | "INVALID_YEARS_RANGE" | "MARINE_NOT_AVAILABLE" | "INVALID_TRIGGER" | "QUOTE_NOT_FOUND" | "QUOTE_EXPIRED" | "QUOTE_ALREADY_BOUND" | "POLICY_NOT_FOUND" | "POLICY_STATE_TRANSITION" | "POLICY_STATE" | "QUOTE_NOT_ISSUABLE" | "CATALOG_DRIFT" | "DRIFT_ACTIVE" | "HISTORICAL_UNAVAILABLE" | "CLIMATE_UNAVAILABLE" | "PROJECTION_UNAVAILABLE" | "WEBHOOK_INVALID_SIGNATURE" | "SPOT_NOT_PRECOMPUTED" | "PAYLOAD_TOO_LARGE" | "IDEMPOTENCY_KEY_CONFLICT" | "INTERNAL_SERVER_ERROR" | "SERVICE_UNAVAILABLE" | "INTELLIGENCE_UNAVAILABLE" | "ADMIN_BOOTSTRAP_DISABLED" | "PERSISTENCE_UNAVAILABLE";
            message?: string;
            issues?: {
                [key: string]: unknown;
            }[];
            detail?: {
                [key: string]: unknown;
            };
        };
        /** @enum {string} */
        Verdict: "unsafe" | "not_feasible" | "poor" | "marginal" | "fair" | "favorable" | "excellent";
        ScoreResponse: {
            /**
             * Format: uuid
             * @description Stable id for this scored session (the `scoring_audit_log` row). Returned on every /v1/score response. Pass it back as `audit_log_id` on POST /v1/outcomes (or as the `:id` on POST /v1/score/:id/outcome) to link the observed outcome to this exact forecast, closing the calibration loop.
             */
            session_id: string;
            score: number;
            verdict: components["schemas"]["Verdict"];
            /**
             * @description How much to trust this `score` — a [0,1] multiplicative product of `forecast_skill` × `provider_agreement` × `profile_maturity` × `hierarchical_calibration` × `coverage` (see `confidenceDetail` for the individual factors). It is HORIZON- and CALIBRATION-sensitive:
             *
             *     - `forecast_skill` now DECAYS with forecast lead time (the gap between issuance and the scored target time), the way operational NWP skill degrades: nowcast ≈ 0.90, ~0.78 at 24h, ~0.69 at 72h, ~0.60 at 7 days, ~0.51 at the ~16-day forecast limit. A near-term verdict therefore carries HIGHER confidence than a far-out one for the same spot. (This is a cold-start prior keyed on lead time, NOT yet a measurement of per-stratum skill — it is superseded factor-for-factor once measured skill is wired.)
             *     - `provider_agreement` defaults to 1.0 for the single-provider case: there is no penalty for the mere absence of a second opinion. A value < 1.0 appears only when ≥2 consensus constituents actually returned samples and diverged.
             *     - `profile_maturity` reflects catalog maturity (provisional 0.75 → reviewed 0.85 → calibrated 0.95) and RISES as a profile is outcome-calibrated.
             *
             *     NOTE — intentional output shift: because `forecast_skill` decays with horizon and the cold-start factors were raised, `confidence` values differ from earlier releases. A near-term score now sits around ~0.55–0.62 (not the old ~0.41 flat baseline), and far-out scores read lower than near-term ones for the same location. This supersedes the previous documentation that described confidence as flat / independent of horizon / non-decaying. If you display or threshold on `confidence`, re-check your thresholds.
             */
            confidence: number;
            /**
             * @description Explicit discriminator for why `score`/`verdict` came out the way they did. 'forecast' = the normal path, every profile gate passed. 'gated' = a hard gate (safety or feasibility) tripped — `score` is forced to 0, but `breakdown`/`physics` still carry the real per-dimension conditions (each breakdown entry's `contribution` is zeroed, since nothing contributed to the gated 0, while `suitability`/`hasData` and the physics values stay populated) so a no-go response shows WHY. 'no_data' = no weather samples were available at all, so `breakdown`/`physics` are genuinely empty. Do not infer gate/no-data from `breakdown` emptiness — a gate trip populates `breakdown` too; read this field instead.
             * @enum {string}
             */
            scoreBasis: "forecast" | "gated" | "no_data";
            breakdown: ({
                name?: string;
                /** @description The raw physical reading for this dimension, in its native unit — this is the operational number to show an operator. Units are per-dimension: wind is KNOTS (e.g. `wind_speed`), wave height METRES (`wave` / `wave_height`), wave period SECONDS (`wave_period`), temperature °C (`air_temp_comfort`, `water_temp`), visibility KM (`visibility`), direction DEGREES. (The engine's full derived `summary` block is intentionally not returned; read operational numbers from here.) */
                value?: number;
                /** @description 0-1 desirability of `value` for this activity (the profile curve's output) — good for a per-dimension green/amber/red indicator. Distinct from `value`: `value` is the measurement, `suitability` is how good that measurement is. */
                suitability?: number;
                weight?: number;
                /** @description This dimension's weighted contribution to `score`. Zeroed on a `scoreBasis: "gated"` response — nothing contributed to a gated 0 (Σcontribution = 0 = score) — even though `suitability`/`hasData` above still reflect the real conditions. */
                contribution?: number;
                hasData?: boolean;
                /** @description True when this dimension's metric carries a feasibility gate — a HARD prerequisite. Below/above its threshold the activity is impossible and the whole score is gated to 0, rather than this dimension merely being weighted. Lets a go/no-go client tell hard prerequisites from soft weighted dimensions straight from the breakdown. Present from catalog v2.4.0 (false on older catalogs). */
                prerequisite?: boolean;
            } & {
                [key: string]: unknown;
            })[];
            physics: {
                [key: string]: unknown;
            };
            alerts: ({
                /** @enum {string} */
                level?: "info" | "warning" | "critical";
                /** @description Stable, machine-readable alert identifier — the field to key a UI, an icon map, or a localized message off (NOT `description`, which is English debug prose and is not localized). Deliberately an open string, not a closed enum: engine codes are fixed in source (NO_DATA, MISSING_DIMENSION_DATA, SAFETY_GATE_UNEVALUATED, SCORE_FLOORED, SAFETY_DATA_UNAVAILABLE, FEASIBILITY_GATE_OBSERVATION_OVERRIDE, and the observed-safety codes ACTIVE_THUNDERSTORM_RISK / ELEVATED_LIGHTNING_RISK / AQI_HAZARDOUS / AQI_VERY_UNHEALTHY / AQI_UNHEALTHY_FOR_ENDURANCE), while gate-trip codes come from the activity profile's catalog and are stable within a profiles-catalog major version (e.g. water sports: NO_RIDABLE_WIND, GALE_FORCE_WIND, HEAVY_RAIN, LOW_VISIBILITY, FLAT_NO_SURF, EXTREME_SURF, HIGH_WIND, STRONG_WIND, RIP_CURRENT_HAZARD, HIGH_SEAS, POOR_SURFACE_VISIBILITY, POOR_UNDERWATER_VISIBILITY, STRONG_CURRENT_UNSAFE). Map known codes; keep a generic fallback for codes added by a future catalog version. */
                code?: string;
                /** @description Human-readable English explanation of the alert. Debug / fallback copy only — it is NOT localized. Localize your UI off `code`, not this field. */
                description?: string;
                /**
                 * @description Why this alert matters: 'safety' = a danger dimension; 'feasibility' = impossible at any skill level (e.g. no rideable wind). On a gate-trip (critical) alert it explains the no-go. Also present on the safety-advisory warnings SAFETY_GATE_UNEVALUATED and SAFETY_DATA_UNAVAILABLE (always 'safety'), so a consumer can treat 'a safety check did not run' distinctly from an ordinary data gap. Absent on non-safety informational alerts. Present from catalog v2.4.0 (gate trips) / contract v0.5 (safety advisories).
                 * @enum {string}
                 */
                kind?: "safety" | "feasibility";
                /** @description Machine-readable slug for the specific hazard, gate, or dimension this alert is about — the field to disambiguate two alerts that share the same `code`. Two SAFETY_DATA_UNAVAILABLE warnings on one response carry subject 'lightning' and 'air_quality' respectively, so a consumer can tell which safety gate went unevaluated without parsing the English `description`. On a gate-trip alert it is the gate's metric name (e.g. 'wind_speed_kn'); on the consolidated SAFETY_GATE_UNEVALUATED advisory it is the comma-joined metric slug(s). Open string, not a closed enum — new hazards/metrics add new values. Present from contract v0.5. */
                subject?: string;
            } & {
                [key: string]: unknown;
            })[];
            eco: {
                [key: string]: unknown;
            };
            /** @description Present on ensemble requests */
            distribution?: {
                [key: string]: unknown;
            };
            confidenceDetail?: components["schemas"]["ConfidenceDetailForecast"];
            calibration_provenance?: components["schemas"]["CalibrationProvenance"] | null;
            assimilation?: {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        };
        ScoreSeriesResponse: {
            /**
             * Format: uuid
             * @description Correlation id for this time-series call. Always returned. NOTE: like /v1/score/multi and unlike POST /v1/score, this is NOT linkable — /v1/score/series does not write a `scoring_audit_log` row, so passing it as `audit_log_id` on POST /v1/outcomes is rejected 404. Only single POST /v1/score session_ids close the calibration loop.
             */
            session_id: string;
            /** @description Resolved catalog profile slug for the requested activity. Always returned. */
            profile_slug: string;
            /**
             * @description Bucket granularity used for the series (defaults to `hourly` when the request omits it). Always returned.
             * @enum {string}
             */
            granularity: "hourly" | "3-hourly" | "daily";
            series: ({
                /** Format: date-time */
                timestamp: string;
                score: number;
                verdict: components["schemas"]["Verdict"];
                confidence: number;
                /** @description Per-bucket scoring alerts (same shape as /v1/score and /v1/score-multi). A bucket forced to unsafe/0 carries its gate reason here — alerts[].kind = 'safety' | 'feasibility'; alerts[].subject disambiguates same-`code` alerts (e.g. 'lightning' vs 'air_quality'). */
                alerts: ({
                    /** @enum {string} */
                    level?: "info" | "warning" | "critical";
                    code?: string;
                    description?: string;
                    /** @enum {string} */
                    kind?: "safety" | "feasibility";
                    subject?: string;
                } & {
                    [key: string]: unknown;
                })[];
            } & {
                [key: string]: unknown;
            })[];
        } & {
            [key: string]: unknown;
        };
        ScoreMultiResponse: {
            /**
             * Format: uuid
             * @description Correlation id for this multi-activity call. Always returned. NOTE: unlike a POST /v1/score `session_id`, this is NOT linkable — /v1/score/multi does not write a `scoring_audit_log` row, so passing it as `audit_log_id` on POST /v1/outcomes is rejected 404. Only single POST /v1/score session_ids close the calibration loop.
             */
            session_id: string;
            location?: components["schemas"]["GeoPoint"];
            results: ({
                activity: string;
                profile_slug?: string;
                score?: number;
                verdict?: components["schemas"]["Verdict"];
                confidence?: number;
                breakdown?: ({
                    name?: string;
                    value?: number;
                    suitability?: number;
                    weight?: number;
                    contribution?: number;
                    hasData?: boolean;
                    /** @description True when this dimension's metric carries a feasibility gate (a HARD prerequisite) — see /v1/score breakdown[].prerequisite. Present from catalog v2.4.0. */
                    prerequisite?: boolean;
                } & {
                    [key: string]: unknown;
                })[];
                /** @description Present on ensemble requests */
                distribution?: {
                    [key: string]: unknown;
                };
                /** @description Per-activity scoring alerts (same shape as /v1/score). verdict = 'not_feasible' already distinguishes an impossible-but-not-dangerous read (e.g. no rideable wind) from 'unsafe'; alerts[].kind = 'feasibility' on the triggering alert carries the same signal for callers that want the underlying reason. alerts[].subject disambiguates same-`code` alerts (e.g. 'lightning' vs 'air_quality'). */
                alerts?: ({
                    /** @enum {string} */
                    level?: "info" | "warning" | "critical";
                    code?: string;
                    description?: string;
                    /** @enum {string} */
                    kind?: "safety" | "feasibility";
                    subject?: string;
                } & {
                    [key: string]: unknown;
                })[];
                /** @description "ACTIVITY_NOT_FOUND" when the activity slug does not resolve. */
                error?: string;
            } & {
                [key: string]: unknown;
            })[];
            /** @description Activity slugs sorted by score descending; errored activities are omitted. */
            rankedByScore?: string[];
        } & {
            [key: string]: unknown;
        };
        CalibrationProvenance: {
            /** @enum {string} */
            level?: "sub-spot" | "cluster" | "region" | "base";
            slug?: string;
            scoring_profile_slug?: string;
            sub_spot_slug?: string;
            distance_to_sub_spot_m?: number;
            /** @enum {integer} */
            tier?: 1 | 2 | 3;
            /** @enum {string} */
            tier_source?: "catalog" | "classifier";
        };
        CalibrationProvenanceSummary: {
            /** @enum {string} */
            level: "base" | "region" | "cluster" | "sub-spot";
            n_local: number | null;
            shrinkage_weight_from_parent: number | null;
        };
        DriftFlag: {
            /** @enum {string} */
            severity: "watch" | "warning" | "critical";
            /** Format: date-time */
            since_timestamp: string;
            cell: {
                activity: string;
                sub_spot: string | null;
                horizon_h: number;
            };
            /** @enum {string} */
            metric: "decision_bss";
            /** @enum {string} */
            reference_type: "operator_outcome";
            days_in_decline: number;
            recalibration_triggered: boolean;
        };
        ConfidenceDetail: components["schemas"]["ConfidenceDetailForecast"] | components["schemas"]["ConfidenceDetailHistorical"] | components["schemas"]["ConfidenceDetailClimate"];
        ConfidenceDetailForecast: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            mode: "forecast";
            /** @description [0,1] skill factor in the confidence fold. It now DECAYS with forecast lead time (nowcast ≈ 0.90, ~0.78 at 24h, ~0.69 at 72h, ~0.60 at 7 days, ~0.51 at the ~16-day limit) rather than being flat, so a near-term bucket scores higher than a far-out one. This is a cold-start prior keyed on lead time, not yet a measurement of per-stratum skill; it is replaced factor-for-factor when measured skill is available. */
            forecast_skill: number;
            /** @description [0,1] agreement across consensus constituents. Defaults to 1.0 for the single-provider (or unmeasured) case — no penalty for the absence of a second opinion; < 1.0 only when ≥2 constituents returned samples and diverged. */
            provider_agreement: number;
            /** @description [0,1] catalog-maturity factor: provisional 0.75 → reviewed 0.85 → calibrated 0.95. RISES as the activity profile is outcome-calibrated. */
            profile_maturity: number;
            hierarchical_calibration: number;
            calibration_provenance?: components["schemas"]["CalibrationProvenanceSummary"];
            skill_calibration?: {
                applied: boolean;
                n_train: number;
                cohort_hash: string;
                scalar: number;
            };
            drift_flag?: components["schemas"]["DriftFlag"];
        } & {
            [key: string]: unknown;
        };
        ConfidenceDetailHistorical: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            mode: "historical";
            sample_size_confidence: number;
            base_climatology_quality: number;
            calibration_confidence: number;
            hierarchical_calibration: number;
            calibration_provenance?: components["schemas"]["CalibrationProvenanceSummary"];
            drift_flag?: components["schemas"]["DriftFlag"];
        } & {
            [key: string]: unknown;
        };
        ConfidenceDetailClimate: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            mode: "climate";
            model_spread: number;
            bias_correction_residual: number;
            scenario_uncertainty: number;
            horizon_uncertainty: number;
            hierarchical_calibration: number;
            calibration_provenance?: components["schemas"]["CalibrationProvenanceSummary"];
            drift_flag?: components["schemas"]["DriftFlag"];
        } & {
            [key: string]: unknown;
        };
        SerialisedPolicy: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            tenantId: string;
            /** Format: uuid */
            quoteId: string;
            /** @enum {string} */
            status: "bound" | "triggered" | "settled" | "expired";
            /** @description Null for mixed-currency portfolios; the breakdown lives on the underlying quote. */
            payoutAmount?: number | null;
            payoutCurrency?: ("EUR" | "USD" | "GBP" | "CHF") | null;
            premiumPaid?: number | null;
            /** @enum {string} */
            premiumCollection: "external" | "stripe" | "invoice_due";
            coverageWindow: {
                monthFrom: number;
                dayFrom: number;
                monthTo: number;
                dayTo: number;
            };
            coverageYear: number;
            /** @description Frozen at bind time — same shape as the quote's normalised trigger. */
            trigger: {
                [key: string]: unknown;
            };
            /** @description Frozen snapshot of the per-spot profile + payout terms — decouples the policy from later catalog changes. */
            policyTerms: {
                [key: string]: unknown;
            };
            /** Format: date-time */
            boundAt: string;
            /** Format: date-time */
            triggeredAt: string | null;
            /** Format: date-time */
            settledAt: string | null;
            /** Format: date-time */
            expiredAt: string | null;
            settlementReference: string | null;
        };
        SerialisedPayoutEvent: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            policyId: string;
            spotIndex: number;
            /** Format: date-time */
            eventStartAt: string;
            /** Format: date-time */
            eventEndAt: string;
            hoursFired: number;
            payoutAmount: number;
            /** @enum {string} */
            payoutCurrency: "EUR" | "USD" | "GBP" | "CHF";
            /** Format: date-time */
            detectedAt: string;
            /** @enum {string} */
            evaluationSource: "manual" | "scheduled";
        };
        UnderwritingQuoteResponse: {
            policy: {
                coverageWindow: {
                    monthFrom: number;
                    dayFrom: number;
                    monthTo: number;
                    dayTo: number;
                };
                /** @description Normalised trigger echoed back with defaulted consecutiveHours/cooldownHours. */
                trigger: {
                    [key: string]: unknown;
                };
                historicalYearsRange: {
                    from: number;
                    to: number;
                };
                spot?: {
                    resolvedProfileSlug: string;
                    point: components["schemas"]["GeoPoint"];
                    spotId?: string;
                    payout: {
                        amount: number;
                        /** @enum {string} */
                        currency: "EUR" | "USD" | "GBP" | "CHF";
                    };
                    /**
                     * @description Sub-spot tier (1/2/3) applied to the tier risk multiplier; null when no sub-spot resolved.
                     * @enum {integer|null}
                     */
                    tier?: 1 | 2 | 3 | null;
                    /**
                     * @description Provenance of the tier: 'catalog' from profile YAML, 'classifier' from L11 confidence=1.0 override, null when no tier applied.
                     * @enum {string|null}
                     */
                    tierSource?: "catalog" | "classifier" | null;
                };
                portfolio?: {
                    resolvedProfileSlug: string;
                    point: components["schemas"]["GeoPoint"];
                    spotId?: string;
                    payout: {
                        amount: number;
                        /** @enum {string} */
                        currency: "EUR" | "USD" | "GBP" | "CHF";
                    };
                    /**
                     * @description Sub-spot tier (1/2/3) applied to the tier risk multiplier; null when no sub-spot resolved.
                     * @enum {integer|null}
                     */
                    tier?: 1 | 2 | 3 | null;
                    /**
                     * @description Provenance of the tier: 'catalog' from profile YAML, 'classifier' from L11 confidence=1.0 override, null when no tier applied.
                     * @enum {string|null}
                     */
                    tierSource?: "catalog" | "classifier" | null;
                }[];
            } & {
                [key: string]: unknown;
            };
            expectedPayouts: {
                byCurrency: {
                    EUR?: {
                        mean: number;
                        p10: number;
                        p50: number;
                        p90: number;
                        perYear: number[];
                        varianceStability: number;
                    };
                    USD?: {
                        mean: number;
                        p10: number;
                        p50: number;
                        p90: number;
                        perYear: number[];
                        varianceStability: number;
                    };
                    GBP?: {
                        mean: number;
                        p10: number;
                        p50: number;
                        p90: number;
                        perYear: number[];
                        varianceStability: number;
                    };
                    CHF?: {
                        mean: number;
                        p10: number;
                        p50: number;
                        p90: number;
                        perYear: number[];
                        varianceStability: number;
                    };
                };
            };
            expectedPremium: {
                byCurrency: {
                    EUR?: {
                        fair: number;
                        loaded: number;
                        /** @description Weighted-average tier risk multiplier applied across spots in this currency (1.0 when no sub-spot). */
                        tierMultiplierWeightedAvg: number;
                    };
                    USD?: {
                        fair: number;
                        loaded: number;
                        /** @description Weighted-average tier risk multiplier applied across spots in this currency (1.0 when no sub-spot). */
                        tierMultiplierWeightedAvg: number;
                    };
                    GBP?: {
                        fair: number;
                        loaded: number;
                        /** @description Weighted-average tier risk multiplier applied across spots in this currency (1.0 when no sub-spot). */
                        tierMultiplierWeightedAvg: number;
                    };
                    CHF?: {
                        fair: number;
                        loaded: number;
                        /** @description Weighted-average tier risk multiplier applied across spots in this currency (1.0 when no sub-spot). */
                        tierMultiplierWeightedAvg: number;
                    };
                };
                loadingFactor: number;
            };
            modelConfidence: number;
            /** @enum {string} */
            advisoryLevel: "high_confidence" | "moderate_confidence" | "low_confidence";
            issuable: boolean;
            notes: string[];
            /** @description HistoricalScoreDistribution — object for single spot, array for portfolio. */
            underlying: {
                [key: string]: unknown;
            } | {
                [key: string]: unknown;
            }[];
            /**
             * Format: uuid
             * @description Present when the policy store is wired — pass to /v1/underwriting/policy/bind to bind this quote.
             */
            quoteId?: string;
            /**
             * Format: date-time
             * @description ISO timestamp after which the quote can no longer be bound.
             */
            expiresAt?: string;
            /**
             * Format: uuid
             * @description Present on GET after the quote has been bound — the resulting policy id.
             */
            boundPolicyId?: string;
        } & {
            [key: string]: unknown;
        };
        /** @enum {string} */
        WebhookEvent: "outcome.created" | "drift.fired" | "drift.resolved" | "calibration.completed" | "billing.subscription_updated" | "recommendation.completed" | "underwriting.policy.bound" | "underwriting.policy.triggered" | "underwriting.policy.settled";
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
