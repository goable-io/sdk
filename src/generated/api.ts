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
                                /** @description This activity's scoring dimensions, each carrying its metric, unit, weight, and whether it is a hard feasibility prerequisite — enough to render a per-dimension breakdown without guessing units from metric names. */
                                dimensions: {
                                    /**
                                     * @description The dimension's bare profile identifier. NOT end-user-facing text: a snake_case join key (e.g. `wind_speed`), never a display label — do NOT render it in a UI. IDENTICAL to `breakdown[].name` in a /v1/score response (join `breakdown[].name` === `dimensions[].name`; do NOT normalise case or underscores). Distinct from `metric` below, the unit-suffixed metric slug. For joining breakdown rows to units prefer `metric` (a /v1/score breakdown entry now also carries `metric`, drawn from the same closed `Metric` vocabulary as `alerts[].subject`); `name` remains valid for `weight`/`prerequisite`.
                                     * @example wind_speed
                                     */
                                    name: string;
                                    /**
                                     * @description The catalog metric this dimension scores — the unit-suffixed metric slug from the closed, versioned `Metric` vocabulary. The SAME value a PROFILE gate-trip alert carries in `alerts[].subject` AND that a /v1/score `breakdown[].metric` carries (join `alerts[].subject` === `dimensions[].metric` === `breakdown[].metric` to localise a gate subject / attach a unit from ONE table). Distinct from `name` above (the bare join key).
                                     * @example wind_speed_kn
                                     */
                                    metric: string;
                                    /**
                                     * @description Physical unit string (e.g. "knots", "m", "°C") for a physical metric; `null` when the metric is DIMENSIONLESS (an index / category / phase / score / factor / multiplier / proxy — NOT a percentage; probabilities/likelihoods are 0..1 dimensionless by design, so decide client-side whether to render ×100). Never inferred from the metric name — read from the server's canonical metric→unit registry. Closed set of current + reserved unit tokens (null = dimensionless index); adding a token is a contract change, so consumers may map exhaustively. `MED` = Minimal Erythemal Dose (the standard erythemal UV-exposure unit; carried by the `uv_dose_med` metric). `%` is RESERVED: no dimension emits it today (humidity / cloud-cover / precip-probability are not yet exposed as dimensions) — it is in the enum now so its first real use is not a breaking change. Convention note: current tokens mix spelled-out ("knots", "seconds") and symbolic ("m", "km", "°C") forms; any future normalisation of that would itself be breaking, so map the tokens verbatim.
                                     * @example knots
                                     * @enum {string|null}
                                     */
                                    unit: "knots" | "degrees" | "m" | "km" | "seconds" | "°C" | "mm/h" | "mm" | "kg/m³" | "hPa" | "MED" | "%" | null;
                                    /**
                                     * @description This dimension's scoring weight (0-1).
                                     * @example 0.4
                                     */
                                    weight: number;
                                    /** @description True when this dimension's metric carries a `kind: "feasibility"` gate — a HARD prerequisite that gates the whole score to 0 below/above its threshold, rather than merely being weighted (mirrors the scoring engine's feasibility-metric set). */
                                    prerequisite: boolean;
                                }[];
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
                                /** @description This activity's scoring dimensions, each carrying its metric, unit, weight, and whether it is a hard feasibility prerequisite — enough to render a per-dimension breakdown without guessing units from metric names. */
                                dimensions: {
                                    /**
                                     * @description The dimension's bare profile identifier. NOT end-user-facing text: a snake_case join key (e.g. `wind_speed`), never a display label — do NOT render it in a UI. IDENTICAL to `breakdown[].name` in a /v1/score response (join `breakdown[].name` === `dimensions[].name`; do NOT normalise case or underscores). Distinct from `metric` below, the unit-suffixed metric slug. For joining breakdown rows to units prefer `metric` (a /v1/score breakdown entry now also carries `metric`, drawn from the same closed `Metric` vocabulary as `alerts[].subject`); `name` remains valid for `weight`/`prerequisite`.
                                     * @example wind_speed
                                     */
                                    name: string;
                                    /**
                                     * @description The catalog metric this dimension scores — the unit-suffixed metric slug from the closed, versioned `Metric` vocabulary. The SAME value a PROFILE gate-trip alert carries in `alerts[].subject` AND that a /v1/score `breakdown[].metric` carries (join `alerts[].subject` === `dimensions[].metric` === `breakdown[].metric` to localise a gate subject / attach a unit from ONE table). Distinct from `name` above (the bare join key).
                                     * @example wind_speed_kn
                                     */
                                    metric: string;
                                    /**
                                     * @description Physical unit string (e.g. "knots", "m", "°C") for a physical metric; `null` when the metric is DIMENSIONLESS (an index / category / phase / score / factor / multiplier / proxy — NOT a percentage; probabilities/likelihoods are 0..1 dimensionless by design, so decide client-side whether to render ×100). Never inferred from the metric name — read from the server's canonical metric→unit registry. Closed set of current + reserved unit tokens (null = dimensionless index); adding a token is a contract change, so consumers may map exhaustively. `MED` = Minimal Erythemal Dose (the standard erythemal UV-exposure unit; carried by the `uv_dose_med` metric). `%` is RESERVED: no dimension emits it today (humidity / cloud-cover / precip-probability are not yet exposed as dimensions) — it is in the enum now so its first real use is not a breaking change. Convention note: current tokens mix spelled-out ("knots", "seconds") and symbolic ("m", "km", "°C") forms; any future normalisation of that would itself be breaking, so map the tokens verbatim.
                                     * @example knots
                                     * @enum {string|null}
                                     */
                                    unit: "knots" | "degrees" | "m" | "km" | "seconds" | "°C" | "mm/h" | "mm" | "kg/m³" | "hPa" | "MED" | "%" | null;
                                    /**
                                     * @description This dimension's scoring weight (0-1).
                                     * @example 0.4
                                     */
                                    weight: number;
                                    /** @description True when this dimension's metric carries a `kind: "feasibility"` gate — a HARD prerequisite that gates the whole score to 0 below/above its threshold, rather than merely being weighted (mirrors the scoring engine's feasibility-metric set). */
                                    prerequisite: boolean;
                                }[];
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
                                verdict?: components["schemas"]["Verdict"];
                                personalScore?: number | null;
                                personalWeight?: number;
                                /** @description Count of the caller's own recorded outcomes at this spot that fed the personalization weighting (0 when no personalization context). Always returned. */
                                personalOutcomes?: number;
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
        /**
         * @description Go/no-go verdict. Three semantic groups — DANGER, NO-GO, and QUALITY — deliberately kept distinct so a consumer can colour them differently and a red 'danger' badge never loses its weight:
         *
         *     • `unsafe` = DANGER. Reserved EXCLUSIVELY for a SAFETY gate trip (a real evaluated hazard — lightning/AQI/a profile safety gate). It is NEVER assigned to a merely-poor score or a no-data window. So `unsafe` ⟺ danger: safe to colour red on its own.
         *     • `not_feasible` = can't be done / can't be judged, but NOBODY is in danger. Emitted for a feasibility gate trip (e.g. no rideable wind) AND for a no-data window (`scoreBasis:"no_data"` — the activity couldn't be assessed here). A grey 'not possible' read, not a red one.
         *     • `poor` < `marginal` < `fair` < `favorable` < `excellent` = QUALITY bands for a scored, feasible window. `poor` is the worst quality band (a usable-but-terrible day, including a score that floors to 0 without any gate) — NOT danger.
         *
         *     Colour guidance: red ⟺ `unsafe` OR the presence of a `kind:"safety"` alert (a low-confidence non-gated `unsafe` does not exist — see `scoreBasis`); grey ⟺ `not_feasible`; a quality ramp for `poor`..`excellent`. This mapping changed in contract v0.6: previously a no-data window and a uniformly-poor 0 also read `unsafe`, conflating danger with 'bad'/'unknown'.
         *
         *     IMPLICATION (verifiable in one line) — `unsafe` is produced ONLY by a hard SAFETY gate trip, and every gate trip sets `scoreBasis:"gated"` with `confidence` pinned to 1. So on /v1/score: `unsafe` ⟹ `scoreBasis:"gated"` ⟹ `confidence` = `confidence_ceiling` = `confidence_normalized` = 1, always. (On /v1/score-multi and /v1/score-series the per-item `scoreBasis` is not surfaced, but `confidence` = 1 on an `unsafe` item still holds.)
         * @enum {string}
         */
        Verdict: "unsafe" | "not_feasible" | "poor" | "marginal" | "fair" | "favorable" | "excellent";
        ScoreResponse: {
            /**
             * Format: uuid
             * @description Stable id for this scored session (the `scoring_audit_log` row). Returned on every /v1/score response. Pass it back as `audit_log_id` on POST /v1/outcomes (or as the `:id` on POST /v1/score/:id/outcome) to link the observed outcome to this exact forecast, closing the calibration loop.
             */
            session_id: string;
            /** @description Resolved catalog profile slug for the requested activity. Always returned. */
            profile_slug: string;
            /** @description Engine version that produced this score (matches the audit row's `engine_version`). This single version tracks BOTH engine behaviour (the score/confidence maths) AND the API schema — it is the same value as the OpenAPI `info.version` — so a bump means re-check BOTH: 'the numbers may have moved → recalibrate thresholds' AND 'the shape may have changed → update types'. You do NOT need to send it on POST /v1/outcomes: link the outcome with `audit_log_id` (this call's `session_id`) and the server resolves the engine version from the audit row it recorded at score time — `session_id` stays your single key. */
            engine_version: string;
            /** @description 0-100 suitability score. IMPORTANT for display: a `0` is NOT always 'terrible quality' — on `scoreBasis:"no_data"` it means 'unknown' (no samples), and on `scoreBasis:"gated"` it means 'forced no-go' (a hazard/infeasibility), not a graded 0. If you neutralise/hide the numeric score on a no-go, key that on `scoreBasis !== "forecast"` (i.e. BOTH `"gated"` AND `"no_data"`) — NOT on `"gated"` alone. As of contract v0.6 a no-data window reads `verdict:"not_feasible"` (was `unsafe`), so `"no_data"` now flows through the normal result path far more often than before; a consumer that hid the 0 only on `"gated"` will otherwise start rendering "0/100" on no-data reads. */
            score: number;
            verdict: components["schemas"]["Verdict"];
            /** @description Fraction of scoring weight whose dimensions had real (non-fallback) input data. */
            dataCoverage: number;
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
            /** @description The maximum `confidence` this profile + spot can currently reach — the product of the two STRUCTURALLY-capped factors, `profile_maturity × hierarchical_calibration`. ALWAYS present and strictly > 0 on a forecast read, so a consumer can rely on it as a divisor (for `confidence / confidence_ceiling`) or as a floor reference. The per-request factors (forecast_skill, provider_agreement, coverage) are all ≤ 1, so `confidence ≤ confidence_ceiling` always holds on the forecast path (on a gate trip both are the deterministic 1). Normalise `confidence / confidence_ceiling` ∈ [0,1] instead of hard-coding an absolute threshold that silently expires as a profile matures (provisional→reviewed→calibrated) or a spot gains local calibration — or read the server-computed `confidence_normalized` directly. Present on BOTH forecast AND ensemble reads (of /v1/score, /v1/score-multi and /v1/score-series): the ensemble confidence is folded through the same profile_maturity × hierarchical_calibration structure and its spread-derived agreement factor is ≤ 1, so `confidence ≤ confidence_ceiling` holds on the ensemble path too. */
            confidence_ceiling: number;
            /** @description Server-computed `confidence / confidence_ceiling` ∈ [0,1] — surfaced so consumers don't each re-implement the division (div-by-zero, rounding). Use this for a 'degraded vs the best achievable here' read; use raw `confidence` for an absolute-certainty floor (a 0.38 confidence on a 0.40-ceiling spot normalizes to ~0.95 but is still only 38% certain). Present wherever `confidence_ceiling` is (forecast AND ensemble reads of /v1/score, /v1/score-multi, /v1/score-series). */
            confidence_normalized: number;
            /**
             * @description Explicit discriminator for why `score`/`verdict` came out the way they did. 'forecast' = the normal path, every profile gate passed. 'gated' = a hard gate (safety or feasibility) tripped — `score` is forced to 0, but `breakdown`/`physics` still carry the real per-dimension conditions (each breakdown entry's `contribution` is zeroed, since nothing contributed to the gated 0, while `suitability`/`hasData` and the physics values stay populated) so a no-go response shows WHY. 'no_data' = no weather samples were available at all, so `breakdown`/`physics` are genuinely empty. Do not infer gate/no-data from `breakdown` emptiness — a gate trip populates `breakdown` too; read this field instead.
             *
             *     INVARIANT — a `gated` response is a CERTAIN no-go: `score` is exactly 0, `verdict` is `unsafe` (a SAFETY gate) or `not_feasible` (a FEASIBILITY gate), and `confidence` = `confidence_ceiling` = `confidence_normalized` = exactly 1. A hard gate trip is a deterministic outcome, NEVER a low-confidence one — so a gated no-go can never arrive with a low `confidence`. Consumers that suppress low-confidence numbers can rely on this: a gate-trip no-go always clears any confidence floor. Independently, a `kind:"safety"` alert is emitted from the hazard evaluation itself, decoupled from `confidence`, so a safety signal is never filtered out by a confidence threshold. NOTE: `unsafe` is produced ONLY by a safety gate trip (never by a low score or a no-data window — see the `Verdict` schema), so a non-gated `unsafe` does not exist; a poor scored day is `poor`, a no-data window is `not_feasible`.
             * @enum {string}
             */
            scoreBasis: "forecast" | "gated" | "no_data";
            breakdown: ({
                /**
                 * @description The dimension's bare profile identifier. NOT end-user-facing text: it is a snake_case join key (e.g. `wind_speed`), never a display label — do NOT render it in a UI. IDENTICAL to `dimensions[].name` in GET /v1/activities, and distinct from the unit-suffixed `metric` (e.g. `wind_speed_kn`). For joining to units / a per-dimension detail view prefer `metric` below (drawn from the closed, versioned `Metric` vocabulary shared with `dimensions[].metric` and `alerts[].subject`); `name` remains a valid join to `dimensions[].name` for `weight`/`prerequisite`.
                 * @example wind_speed
                 */
                name?: string;
                /**
                 * @description The dimension's underlying METRIC — the closed, versioned join key drawn from the fixed `Metric` vocabulary, IDENTICAL to `dimensions[].metric` in GET /v1/activities and to a profile gate's `alerts[].subject`. This is the STABLE key for joining a breakdown row to its `unit` (via `dimensions[].metric` → `dimensions[].unit`) or to a per-dimension detail view — preferred over `name` for that purpose because it is the same vocabulary the safety `subject` uses, so hazard + dimension keys localise from ONE table. Present from contract v0.6.
                 * @example wind_speed_kn
                 */
                metric?: string;
                /** @description The raw physical reading for this dimension, in its native unit — the operational number to show an operator. The unit is NOT declared here: read it from `dimensions[].unit` in GET /v1/activities, joined on `metric` (this entry's `metric` === `dimensions[].metric`) — that registry-generated field is the single machine-readable source of truth for units, so this prose never repeats (and can never drift from) it. (The engine's full derived `summary` block is intentionally not returned; read operational numbers from here.) */
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
                 * @description What FAMILY this alert belongs to: 'safety' = a danger dimension; 'feasibility' = impossible at any skill level (e.g. no rideable wind). Present on every safety alert — gate trips AND the safety advisories (SAFETY_GATE_UNEVALUATED, SAFETY_DATA_UNAVAILABLE), always 'safety'. IMPORTANT: 'safety' does NOT by itself mean danger — a safety check that could not run also carries kind:'safety'. Use `evaluated` to tell an evaluated danger (red) from an unchecked hazard (amber); do NOT colour red off `kind` alone. Absent on non-safety informational alerts. Present from catalog v2.4.0 (gate trips) / contract v0.5 (safety advisories).
                 * @enum {string}
                 */
                kind?: "safety" | "feasibility";
                /** @description Machine-readable slug for the specific hazard, gate, or dimension this alert is about — the field to disambiguate two alerts that share the same `code`. The UNIVERSAL safety hazards have stable, documentable subject slugs — `"lightning"` and `"air_quality"` — carried by both their gate-trip alerts and their SAFETY_DATA_UNAVAILABLE advisories; treat these two as the known safety-subject set (the SDK exports them). Two SAFETY_DATA_UNAVAILABLE warnings carry subject 'lightning' and 'air_quality' respectively; SAFETY_GATE_UNEVALUATED is emitted once PER unrun gate, each carrying a single slug (never a delimited list, so there is no format to parse). On a PROFILE gate-trip alert it is the gate's metric name (e.g. 'wind_speed_kn'), GUARANTEED to be drawn from the SAME `Metric` vocabulary as `dimensions[].metric` in GET /v1/activities — it is exactly the tripped gate's metric. So once you have fetched a profile's `dimensions` you know the finite set of gate subjects it can emit, and can localise hazard + gate subjects from ONE table instead of two that drift. Still typed as an open string (not a closed enum) for forward-compatibility as the catalog's metric set grows — keep a generic fallback. NOTE: today a metric slug embeds its unit (`wind_speed_kn`); the unit also travels as `dimensions[].unit`, so to localise a subject you currently parse the suffix. Stripping the unit from the slug (`wind_speed` + `unit:"knots"`) is a catalog-wide breaking change on the roadmap, not in this release. Present from contract v0.5. */
                subject?: string;
                /** @description For safety alerts only (kind:'safety'): did the safety gate actually run? true = the gate ran — on a critical alert it TRIPPED (dangerous conditions found → colour red), on a warning alert it found an elevated-but-not-critical condition. false = the gate could NOT be evaluated because its input was absent (SAFETY_GATE_UNEVALUATED, SAFETY_DATA_UNAVAILABLE) — the hazard is UNKNOWN, not absent (→ colour amber, never red). Orthogonal to `kind`: a consumer deciding 'dangerous vs merely unchecked' MUST branch on `evaluated`. Absent on non-safety alerts. Present from contract v0.6. */
                evaluated?: boolean;
                /**
                 * @description For the lightning safety alert only (kind:'safety', subject:'lightning', evaluated:true): what the danger signal is based on. 'observed' = real observed strikes were detected near the point and factored into the gate (you MAY say 'observed lightning'). 'forecast' = forecast convective instability only (CAPE / lifted index); no observed strikes contributed — do NOT claim observed, and never write 'no lightning' off this. One uniform field across /v1/score, /v1/score-multi and /v1/score-series, so the observed-vs-forecast decision does not depend on reading the optional eco.lightning_observation block. Absent on the SAFETY_DATA_UNAVAILABLE (evaluated:false) lightning advisory and on every non-lightning alert. NOTE: on /v1/score-series this is ALWAYS 'forecast' — observed strikes are a nowcast (current strikes near the point) and are not looked up per forecast bucket, so a series can never say 'observed'; use /v1/score or /v1/score-multi for a now-read where 'observed' can appear. Present from contract v0.6.
                 * @enum {string}
                 */
                source?: "observed" | "forecast";
            } & {
                [key: string]: unknown;
            })[];
            /**
             * @description Best-effort OBSERVED context attached to the score. Where a live in-situ/satellite reading was in range, these blocks carry the real measurement that VALIDATED or OVERRODE the forecast value the score was computed from — provenance a consumer can surface as a "measured X at Y km" annotation. Every sub-block is OPTIONAL and station-dependent: a block is present only when a relevant gauge / moored buoy / satellite pass / station was in range and fresh for this request, so absence means "nothing observed nearby", never "conditions absent". Only the sub-fields documented here are contract-frozen; the rest of `eco` is still evolving and rides under `additionalProperties` — do NOT treat unlisted keys as stable.
             *
             *     TWO observed-SST sources, deliberately distinct: `buoy_validation.sst.observed_c` is the nearest moored-buoy IN-SITU physical measurement and is AUTHORITATIVE for a "measured N°C at K km" display when present; `sst_validation.observed_c` is the satellite/model observation used when no buoy is in range. A consumer wanting a measured local water temperature should prefer `buoy_validation.sst` when present, else fall back to `sst_validation`. Disambiguate on `source_type` (`in_situ_observation` vs `satellite_observation`) and compare `source_distance_km`.
             */
            eco: {
                /** @description Wind strength on the Beaufort scale (0..12) derived from the scored wind speed. Present when a wind signal was available for this activity. */
                wind_beaufort?: number;
                /** @description Deep-water wave energy flux in kW per metre of crest, derived from significant height and period. Present for wave-driven activities where a wave signal was available. */
                wave_energy_kw_per_m?: number;
                /**
                 * @description Coarse energy band for the conditions ('low' | 'moderate' | 'high'). Always present — the one non-optional eco field.
                 * @enum {string}
                 */
                energy_class?: "low" | "moderate" | "high";
                /** @description True when the activity is human/wind/wave-powered with no motorised propulsion. Static catalog trait, present when known for the profile. */
                carbon_neutral?: boolean;
                /**
                 * @description How much specialised gear the activity requires ('none' | 'low' | 'medium' | 'high'). Static catalog trait, present when known for the profile.
                 * @enum {string}
                 */
                equipment_dependency?: "none" | "low" | "medium" | "high";
                /** @description Number of weeks per year the activity is typically in season at this kind of location. Static catalog trait, present when known. */
                typical_season_weeks?: number;
                /**
                 * @description How sensitive the site is to visitor load / crowding pressure ('low' | 'medium' | 'high'). Static catalog trait, present when known for the profile.
                 * @enum {string}
                 */
                carrying_capacity_sensitivity?: "low" | "medium" | "high";
                /** @description Moon phase and the day's golden-hour boundaries, computed from location + window for every score. Present on essentially every score; relevant to night dives, dawn/dusk sessions and photography-driven timing. Individual sub-fields are omitted when not computable. */
                astronomy?: {
                    /** @description Synodic lunar phase in [0,1): 0 = new moon, 0.25 = first quarter, 0.5 = full moon, 0.75 = last quarter. This is the PHASE, NOT the illuminated fraction (which would read 1.0 at full moon, not 0.5). */
                    moon_phase?: number;
                    /** @description ISO 8601 timestamp at which the morning golden hour ends. */
                    golden_hour_morning_end?: string;
                    /** @description ISO 8601 timestamp at which the evening golden hour begins. */
                    golden_hour_evening_start?: string;
                } & {
                    [key: string]: unknown;
                };
                /** @description Static break/bottom characterisation for the spot. Present for surf-type profiles at a catalogued break. */
                bathymetry?: {
                    /** @description Catalogued break/spot name. */
                    spot: string;
                    /** @description Sea-bed type at the break (e.g. reef, sand, point). */
                    bottom_type: string;
                    /** @description Water depth at the break, m. */
                    depth_at_break_m: number;
                    /** @description Break-quality scaling factor applied for this bottom/spot. */
                    quality_multiplier: number;
                } & {
                    [key: string]: unknown;
                };
                /** @description Convective lightning-risk annotation. Present when a lightning-proximity signal was computed for this request. Advisory or gating per `gate_decision`. */
                lightning_advisory?: {
                    /** @description Blended lightning proximity/risk score. */
                    proximity_score: number;
                    /**
                     * @description 'GATED' = the risk tripped a safety gate; 'ADVISORY' = surfaced as a warning only.
                     * @enum {string}
                     */
                    gate_decision: "GATED" | "ADVISORY";
                    /** @description Human-readable reason for the decision, or null when none applies. */
                    reason: string | null;
                } & {
                    [key: string]: unknown;
                };
                /** @description Air-quality annotation. Present when an AQI signal was available for this request. Advisory or gating per `gate_decision`. */
                air_quality_advisory?: {
                    /** @description Air Quality Index value. */
                    aqi: number;
                    /**
                     * @description AQI category band the value falls into.
                     * @enum {string}
                     */
                    category: "good" | "moderate" | "unhealthy_sensitive" | "unhealthy" | "very_unhealthy" | "hazardous";
                    /**
                     * @description 'GATED' = AQI tripped a safety gate; 'ADVISORY' = surfaced as a warning; 'OK' = within acceptable limits.
                     * @enum {string}
                     */
                    gate_decision: "GATED" | "ADVISORY" | "OK";
                    /** @description Human-readable reason for the decision, or null when none applies. */
                    reason: string | null;
                } & {
                    [key: string]: unknown;
                };
                /** @description Coastal visibility hazards — sea-fog likelihood and a storm-surge proxy. Present when a coastal signal was computed for this request. */
                coastal_advisory?: {
                    /** @description Estimated likelihood of sea fog (0..1). */
                    sea_fog_likelihood: number;
                    /** @description Proxy indicator for storm-surge potential. */
                    storm_surge_proxy: number;
                    /** @description Combined estimated visibility in metres, when computable. */
                    combined_visibility_m?: number;
                } & {
                    [key: string]: unknown;
                };
                /** @description Wave-breaking characterisation at the spot. Present for surf-type profiles where a wave signal and bathymetry allowed classification. */
                breaker_classification?: {
                    /**
                     * @description Breaker type produced by the wave/bathymetry combination.
                     * @enum {string}
                     */
                    type: "spilling" | "plunging" | "collapsing" | "surging";
                    /** @description Breaking wave height, m. */
                    height_m: number;
                    /** @description Derived surf-quality score. */
                    surf_quality: number;
                } & {
                    [key: string]: unknown;
                };
                /** @description L1e — freeze-thaw + recent-precipitation rockfall risk. Present only for land/snow scores where a rockfall-history reader was wired AND the best-effort 7-day archive fetch succeeded. Advisory only: it annotates the score, it does not gate it. */
                rockfall_advisory?: {
                    /** @description Rockfall risk index (0..1) from `@goable-io/physics` alpine.rockfallRiskIndex. */
                    risk_index: number;
                    /**
                     * @description Risk band the index falls into.
                     * @enum {string}
                     */
                    band: "low" | "moderate" | "elevated" | "high";
                } & {
                    [key: string]: unknown;
                };
                /** @description Satellite/model observed sea-surface temperature (CMEMS), used as the SST reference when NO in-situ buoy is in range. Present only when a nearby satellite SST observation existed for this request. Broad coverage but not a local physical measurement — prefer `buoy_validation.sst` for a "measured" display when that block is present. */
                sst_validation?: {
                    /**
                     * @description Always `satellite_observation` — disambiguates this from the in-situ `buoy_validation.sst`.
                     * @enum {string}
                     */
                    source_type: "satellite_observation";
                    /** @description Observed satellite SST in °C. */
                    observed_c: number;
                    /** @description The forecast SST in °C this observation was compared against. */
                    forecast_c: number;
                    /** @description True when the observation agreed with the forecast (within tolerance). */
                    validated: boolean;
                    /** @description True when the observation replaced the forecast value in the samples scored. */
                    overridden: boolean;
                    /** @description Distance from the request point to the satellite observation, km. */
                    source_distance_km: number;
                } & {
                    [key: string]: unknown;
                };
                /** @description Nearest moored-buoy IN-SITU reading. When present, its `sst` sub-block is the AUTHORITATIVE measured local water temperature (prefer it over `sst_validation`). One buoy reading carries independently-gated `wave`/`sst`/`wind` sub-blocks; each sub-block is present only when that variable was actually compared, and each can have OVERRIDDEN the forecast. Present only when a fresh moored buoy was in range for this request. */
                buoy_validation?: {
                    /**
                     * @description Always `in_situ_observation` — the disambiguator marking this a physical measurement.
                     * @enum {string}
                     */
                    source_type: "in_situ_observation";
                    /** @description Identifier of the moored buoy that produced the reading. */
                    station_id: string;
                    /** @description Distance from the request point to the buoy, km. */
                    source_distance_km: number;
                    /** @description ISO 8601 timestamp of the buoy observation. */
                    observed_at: string;
                    /** @description In-situ measured sea-surface temperature — authoritative for a "measured N°C" display when present. */
                    sst?: {
                        /** @description Measured water temperature in °C. */
                        observed_c: number;
                        /** @description Forecast SST compared against, °C. */
                        forecast_c: number;
                        /** @description True when observation agreed with the forecast. */
                        validated: boolean;
                        /** @description True when the observation replaced the forecast in the scored samples. */
                        overridden: boolean;
                    } & {
                        [key: string]: unknown;
                    };
                    /** @description In-situ measured wave state. Kept loose — additional observed_*\/forecast_* variables may be added under additionalProperties. */
                    wave?: {
                        /** @description True when observation agreed with the forecast. */
                        validated?: boolean;
                        /** @description Measured significant wave height, m. */
                        observed_m?: number;
                        /** @description Forecast wave height compared against, m. */
                        forecast_m?: number;
                        /** @description True when the observation replaced the forecast in the scored samples. */
                        overridden?: boolean;
                    } & {
                        [key: string]: unknown;
                    };
                    /** @description In-situ measured wind. */
                    wind?: {
                        /** @description True when observation agreed with the forecast. */
                        validated: boolean;
                        /** @description Measured wind speed, m/s. */
                        observed_ms: number;
                        /** @description Forecast wind speed compared against, m/s. */
                        forecast_ms: number;
                        /** @description True when the observation replaced the forecast in the scored samples. */
                        overridden: boolean;
                    } & {
                        [key: string]: unknown;
                    };
                    /** @description Buoy-supplied wave period in seconds, when the reading carried it. */
                    observed_wave_period_s?: number;
                    /** @description Buoy-supplied wave direction in degrees, when the reading carried it. */
                    observed_wave_direction_deg?: number;
                } & {
                    [key: string]: unknown;
                };
                /** @description In-situ tide NOWCAST at the nearest fresh gauge — describes the tide NOW, says nothing about a future window. Present only when a fresh tide gauge was in range. `observed_level_m` rides along as provenance relative to `datum`; the meaningful, datum-independent signals are `trend`/`rate_m_per_h`/`range_position`, each omitted when recent history is too thin to state honestly. */
                tide_observed?: {
                    /**
                     * @description Always `in_situ_observation`.
                     * @enum {string}
                     */
                    source_type: "in_situ_observation";
                    /** @description Latest observed water level relative to `datum`, m. Provenance only — prefer the relative nowcast fields. */
                    observed_level_m: number;
                    /** @description Reference datum for `observed_level_m` (often the gauge's own station zero). */
                    datum: string;
                    /** @description Identifier of the tide gauge. */
                    station_id: string;
                    /** @description Distance from the request point to the gauge, km. */
                    source_distance_km: number;
                    /** @description Age of the latest reading, minutes. */
                    stale_minutes: number;
                    /**
                     * @description Direction of recent movement; `slack` near a high/low turn. Omitted when history is too thin.
                     * @enum {string}
                     */
                    trend?: "rising" | "falling" | "slack";
                    /** @description Signed rate of change, m/h (positive rising, negative falling). Omitted when history is too thin. */
                    rate_m_per_h?: number;
                    /** @description Position within the recent tidal range: 0 = recent low-water mark, 1 = recent high-water mark. Omitted when range is too thin to be meaningful. */
                    range_position?: number;
                } & {
                    [key: string]: unknown;
                };
                /** @description In-situ METAR station reading. Carries independently-gated `wind`/`visibility` sub-blocks, each present only when that variable was actually compared. Present only when a fresh METAR station was in range for this request. */
                metar_validation?: {
                    /**
                     * @description Always `in_situ_observation`.
                     * @enum {string}
                     */
                    source_type: "in_situ_observation";
                    /** @description Identifier of the METAR station. */
                    station_id: string;
                    /** @description Distance from the request point to the station, km. */
                    source_distance_km: number;
                    /** @description ISO 8601 timestamp of the METAR observation. */
                    observed_at: string;
                    /** @description In-situ measured wind, present only when wind was compared. */
                    wind?: {
                        /** @description True when observation agreed with the forecast. */
                        validated: boolean;
                        /** @description Measured wind speed, m/s. */
                        observed_ms: number;
                        /** @description Forecast wind speed compared against, m/s. */
                        forecast_ms: number;
                        /** @description True when the observation replaced the forecast in the scored samples. */
                        overridden: boolean;
                    } & {
                        [key: string]: unknown;
                    };
                    /** @description In-situ measured visibility, present only when visibility was compared. */
                    visibility?: {
                        /** @description True when observation agreed with the forecast. */
                        validated: boolean;
                        /** @description Measured visibility, km. */
                        observed_km: number;
                        /** @description Forecast visibility compared against, km. */
                        forecast_km: number;
                        /** @description True when the observation replaced the forecast in the scored samples. */
                        overridden: boolean;
                    } & {
                        [key: string]: unknown;
                    };
                } & {
                    [key: string]: unknown;
                };
                /** @description CMEMS ocean-colour provenance for the water-clarity index. Present whenever the clarity dimension was computed. `source` distinguishes a measured satellite Kd490 (with distance + valid date) from the rainfall-proxy fallback. */
                cmems_clarity?: {
                    /**
                     * @description 'measured_ocean_colour' = satellite Kd490 observation; 'proxy' = rainfall-derived fallback when no ocean-colour reading was in range.
                     * @enum {string}
                     */
                    source: "measured_ocean_colour" | "proxy";
                    /** @description Derived water-clarity index used in scoring. */
                    water_clarity_index: number;
                    /** @description Measured diffuse attenuation coefficient Kd490 (m^-1); present only for the measured source. */
                    kd490_m_inv?: number;
                    /** @description Distance from the request point to the ocean-colour observation, km (measured source only). */
                    source_distance_km?: number;
                    /** @description Valid date of the ocean-colour observation (measured source only). */
                    valid_date?: string;
                } & {
                    [key: string]: unknown;
                };
                /** @description CMEMS surface-current provenance for tidal current speed. Present whenever a current value was produced. `source` records whether the value came from the harmonic model only, a measured CMEMS surface current, or the safety-conservative max of both. */
                cmems_current?: {
                    /**
                     * @description 'harmonic' = model only; 'cmems_surface_current' = measured fill where the harmonic model is blind; 'combined' = safety-conservative max of both.
                     * @enum {string}
                     */
                    source: "harmonic" | "cmems_surface_current" | "combined";
                    /** @description Tidal/surface current speed, knots. */
                    tidal_current_speed_kn: number;
                    /** @description Distance from the request point to the CMEMS current observation, km (measured/combined only). */
                    source_distance_km?: number;
                    /** @description Valid date of the CMEMS current observation (measured/combined only). */
                    valid_date?: string;
                } & {
                    [key: string]: unknown;
                };
                /** @description #2 (funnel-spot false no-go fix) — one entry per feasibility gate whose FORECAST value would have tripped the gate while a fresh, nearby METAR/buoy wind observation was on the rideable side of that same boundary, so the observed wind was substituted into the scored samples instead of collapsing the score to 0. The resulting score is a genuine (typically low/marginal) value computed from the real observed wind — this array exists purely to explain WHY the day scored low-and-not-zero, never to imply the score was boosted. Deliberately independent of the *_validation blocks' own `wind.overridden` (a fixed m/s threshold): this can be non-empty even when that correction never fired, because the divergence that matters here is 'which side of the gate boundary'. Only wind metrics are covered today. Present (non-empty) only when such an override occurred; otherwise absent. */
                feasibility_gate_overrides?: ({
                    /** @description The feasibility metric that would have tripped (e.g. wind_speed_kn). */
                    metric: string;
                    /** @description Gate reason code that would have fired (e.g. NO_RIDABLE_WIND). */
                    reason_code: string;
                    /** @description The gate boundary value, knots. */
                    gate_value_kn: number;
                    /** @description The forecast value that would have tripped the gate, knots. */
                    forecast_kn: number;
                    /** @description The observed wind speed substituted into the scored samples, knots. */
                    observed_kn: number;
                    /**
                     * @description Always `in_situ_observation` — the observation is a physical measurement.
                     * @enum {string}
                     */
                    source_type: "in_situ_observation";
                    /**
                     * @description Which in-situ network supplied the observation.
                     * @enum {string}
                     */
                    source: "metar" | "buoy";
                    /** @description Identifier of the observing station/buoy. */
                    station_id: string;
                    /** @description Distance from the request point to the station, km. */
                    source_distance_km: number;
                    /** @description ISO 8601 timestamp of the observation. */
                    observed_at: string;
                } & {
                    [key: string]: unknown;
                })[];
                /** @description F4 — satellite (CMEMS) wave observation used to VALIDATE or OVERRIDE the forecast wave height. Present only when a nearby, fresh CMEMS wave observation existed for this request. `observed_period_s`/`observed_direction_deg` ride along only when the CMEMS reading carried those variables. */
                cmems_wave_validation?: {
                    /**
                     * @description Always `satellite_observation`.
                     * @enum {string}
                     */
                    source_type: "satellite_observation";
                    /** @description True when the observation agreed with the forecast (within tolerance). */
                    validated: boolean;
                    /** @description Observed significant wave height, m. */
                    observed_height_m: number;
                    /** @description Forecast wave height compared against, m. */
                    forecast_height_m: number;
                    /** @description True when the observation replaced the forecast in the scored samples. */
                    overridden: boolean;
                    /** @description Distance from the request point to the observation, km. */
                    source_distance_km: number;
                    /** @description Observed wave period, s (only when the reading carried it). */
                    observed_period_s?: number;
                    /** @description Observed wave direction, degrees (only when the reading carried it). */
                    observed_direction_deg?: number;
                } & {
                    [key: string]: unknown;
                };
                /** @description F3 — in-situ lightning-strike observation. Present only when an active strike reader was wired AND a nearby, fresh strike observation existed for this request. `applied: true` means the strike-derived proximity was the (tied-or-)winning contributor to the final blended lightning proximity — i.e. real strikes, not CAPE/LI, drove the reported value. */
                lightning_observation?: {
                    /**
                     * @description Always `in_situ_observation`.
                     * @enum {string}
                     */
                    source_type: "in_situ_observation";
                    /** @description Number of strikes observed within range/window. */
                    strike_count: number;
                    /** @description Distance to the nearest observed strike, km. */
                    nearest_km: number;
                    /** @description ISO 8601 timestamp of the most recent observed strike. */
                    most_recent_at: string;
                    /** @description True when the strike-derived proximity drove the reported lightning proximity score. */
                    applied: boolean;
                } & {
                    [key: string]: unknown;
                };
                /** @description Phase 2 §4.4 — VALIDATE-ONLY provenance for GloFAS-modeled river discharge near the spot. Present only when an active river-discharge reader was wired AND a nearby, fresh GloFAS reading existed for this request. `source_type` is `forecast_model` (GloFAS discharge is a hydrological forecast, NOT an in-situ observation, so the value reads `modeled_*`), and `overridden` is always false — the engine has no discharge variable to override. */
                river_validation?: {
                    /**
                     * @description Always `forecast_model` — GloFAS discharge is a hydrological forecast, not an observation.
                     * @enum {string}
                     */
                    source_type: "forecast_model";
                    /** @description True when the modeled discharge was within the expected/tolerated range. */
                    validated: boolean;
                    /** @description GloFAS-modeled river discharge, m^3/s. */
                    modeled_discharge_m3s: number;
                    /**
                     * @description Always false — validate-only; there is no discharge variable in the engine to override.
                     * @enum {boolean}
                     */
                    overridden: false;
                    /** @description Identifier of the GloFAS reach/station. */
                    station_id: string;
                    /** @description Distance from the request point to the reach, km. */
                    source_distance_km: number;
                    /** @description Age of the reading, minutes. */
                    stale_minutes: number;
                } & {
                    [key: string]: unknown;
                };
                /** @description Phase 2 §4.3 — VALIDATE-ONLY provenance for ERA5-Land-modeled snow near the spot. Present only when an active snow-cover reader was wired AND a nearby, fresh ERA5-Land reading existed for this request. `source_type` is `reanalysis` (ERA5-Land is a reanalysis product, NOT an in-situ/satellite observation, so values read `modeled_*`), and `overridden` is always false. `forecast_snow_depth_m`/`delta_m` are present only when both the modeled value and a forecast snow depth existed. */
                snow_validation?: {
                    /**
                     * @description Always `reanalysis` — ERA5-Land is a reanalysis product, not an observation.
                     * @enum {string}
                     */
                    source_type: "reanalysis";
                    /** @description True when the modeled snow was within the expected/tolerated range. */
                    validated: boolean;
                    /** @description ERA5-Land modeled fractional snow cover, percent. */
                    modeled_fractional_cover_pct: number;
                    /** @description ERA5-Land modeled snow depth, m (when available). */
                    modeled_snow_depth_m?: number;
                    /** @description ERA5-Land modeled snow water equivalent, mm (when available). */
                    modeled_swe_mm?: number;
                    /** @description Forecast snow depth compared against, m (only when both existed). */
                    forecast_snow_depth_m?: number;
                    /** @description Gap between modeled and forecast snow depth, m (only when both existed). */
                    delta_m?: number;
                    /**
                     * @description Always false — validate-only; the engine has no snow variable to override.
                     * @enum {boolean}
                     */
                    overridden: false;
                    /** @description Identifier of the ERA5-Land cell/station. */
                    station_id: string;
                    /** @description Distance from the request point to the cell, km. */
                    source_distance_km: number;
                    /** @description Age of the reading, minutes. */
                    stale_minutes: number;
                } & {
                    [key: string]: unknown;
                };
                /** @description English PROSE summary of the swell's origin. NOT localized and NOT a stable structured field — it is human-readable debug/annotation copy whose wording may change. Do not parse it or key UI off it; treat it as display-only English text. */
                swell_origin_summary?: string;
            } & {
                [key: string]: unknown;
            };
            /** @description Present on ensemble requests */
            distribution?: {
                [key: string]: unknown;
            };
            confidenceDetail?: components["schemas"]["ConfidenceDetailForecast"];
            /** @description Provenance of any spatial hierarchical calibration applied to the score. Optional: the key is ABSENT (never null) when no spatial resolver is wired or no calibration was applied. */
            calibration_provenance?: components["schemas"]["CalibrationProvenance"];
            /** @description Pro+ output — present ONLY when the caller passed `rider_skill_level` AND a difficulty atlas existed for at least one of the profile's dimensions on the resolved sub-spot. Communicates how much knowing the rider's skill moved the verdict. */
            skillConditioned?: {
                /** @description The rider skill level the score was conditioned on. */
                level: string;
                /** @description The main `score` field of this response (skill-conditioned). */
                score: number;
                /** @description What the population curve (today's default) would have produced. */
                populationScore: number;
                /** @description score − populationScore. Negative = skill assumption lowered it (beginner at hard conditions); positive = skill assumption raised it (expert recognising favourable conditions). */
                shift: number;
                /** @description Cohort hash from the atlas row whose δ produced the conditioned curve. Same value as `confidenceDetail.skill_calibration.cohort_hash`. */
                cohort_hash: string;
            };
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
            /** @description Engine version that produced these scores. This single version tracks BOTH engine behaviour (the score/confidence maths) AND the API schema — it is the same value as the OpenAPI `info.version` — so a bump means re-check BOTH calibration thresholds AND types. NOTE: /v1/score/multi and /v1/score/series do NOT write an audit row (no linkable `audit_log_id`), so this response field is how you capture the engine version for a multi/series read. */
            engine_version: string;
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
                confidence_ceiling?: number;
                /** @description Server-computed `confidence / confidence_ceiling` ∈ [0,1] — a 'degraded vs the best achievable here' read consumers don't each re-implement; use raw `confidence` for an absolute-certainty floor. Present on both forecast and ensemble buckets. */
                confidence_normalized?: number;
                /** @description Fraction of scoring weight whose dimensions had real (non-fallback) input data. */
                dataCoverage?: number;
                /** @description Per-bucket scoring alerts (same shape as /v1/score and /v1/score-multi). A bucket forced to unsafe/0 carries its gate reason here — alerts[].kind = 'safety' | 'feasibility'; alerts[].subject disambiguates same-`code` alerts (e.g. 'lightning' vs 'air_quality'). */
                alerts: ({
                    /** @enum {string} */
                    level?: "info" | "warning" | "critical";
                    code?: string;
                    description?: string;
                    /** @enum {string} */
                    kind?: "safety" | "feasibility";
                    subject?: string;
                    evaluated?: boolean;
                    /**
                     * @description For the lightning safety alert only (kind:'safety', subject:'lightning', evaluated:true): what the danger signal is based on. 'observed' = real observed strikes were detected near the point and factored into the gate (you MAY say 'observed lightning'). 'forecast' = forecast convective instability only (CAPE / lifted index); no observed strikes contributed — do NOT claim observed, and never write 'no lightning' off this. One uniform field across /v1/score, /v1/score-multi and /v1/score-series, so the observed-vs-forecast decision does not depend on reading the optional eco.lightning_observation block. Absent on the SAFETY_DATA_UNAVAILABLE (evaluated:false) lightning advisory and on every non-lightning alert. NOTE: on /v1/score-series this is ALWAYS 'forecast' — observed strikes are a nowcast (current strikes near the point) and are not looked up per forecast bucket, so a series can never say 'observed'; use /v1/score or /v1/score-multi for a now-read where 'observed' can appear. Present from contract v0.6.
                     * @enum {string}
                     */
                    source?: "observed" | "forecast";
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
            /** @description Engine version that produced these scores. This single version tracks BOTH engine behaviour (the score/confidence maths) AND the API schema — it is the same value as the OpenAPI `info.version` — so a bump means re-check BOTH calibration thresholds AND types. NOTE: /v1/score/multi and /v1/score/series do NOT write an audit row (no linkable `audit_log_id`), so this response field is how you capture the engine version for a multi/series read. */
            engine_version: string;
            location?: components["schemas"]["GeoPoint"];
            results: ({
                activity: string;
                profile_slug?: string;
                score?: number;
                verdict?: components["schemas"]["Verdict"];
                confidence?: number;
                confidence_ceiling?: number;
                /** @description Server-computed `confidence / confidence_ceiling` ∈ [0,1] — a 'degraded vs the best achievable here' read consumers don't each re-implement; use raw `confidence` for an absolute-certainty floor. Present on both forecast and ensemble reads; absent only on error rows. */
                confidence_normalized?: number;
                /** @description Fraction of scoring weight whose dimensions had real (non-fallback) input data. */
                dataCoverage?: number;
                breakdown?: ({
                    /** @description Bare profile join key — NOT end-user-facing text. See /v1/score breakdown[].name; prefer `metric` for unit joins. */
                    name?: string;
                    /** @description The dimension's metric from the closed `Metric` vocabulary — IDENTICAL to `dimensions[].metric` / `alerts[].subject`; the stable key to attach a unit or a per-dimension detail view. See /v1/score breakdown[].metric. Present from contract v0.6. */
                    metric?: string;
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
                    evaluated?: boolean;
                    /**
                     * @description For the lightning safety alert only (kind:'safety', subject:'lightning', evaluated:true): what the danger signal is based on. 'observed' = real observed strikes were detected near the point and factored into the gate (you MAY say 'observed lightning'). 'forecast' = forecast convective instability only (CAPE / lifted index); no observed strikes contributed — do NOT claim observed, and never write 'no lightning' off this. One uniform field across /v1/score, /v1/score-multi and /v1/score-series, so the observed-vs-forecast decision does not depend on reading the optional eco.lightning_observation block. Absent on the SAFETY_DATA_UNAVAILABLE (evaluated:false) lightning advisory and on every non-lightning alert. NOTE: on /v1/score-series this is ALWAYS 'forecast' — observed strikes are a nowcast (current strikes near the point) and are not looked up per forecast bucket, so a series can never say 'observed'; use /v1/score or /v1/score-multi for a now-read where 'observed' can appear. Present from contract v0.6.
                     * @enum {string}
                     */
                    source?: "observed" | "forecast";
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
            /** @description [0,1] fraction of scoring weight whose dimensions had real (non-fallback) input data (see the response's `dataCoverage`). Always emitted. Folded (smoothstep-shaped) into `confidence`, so a partial-data forecast reads correctly less confident; 1.0 = full coverage (no penalty). */
            data_coverage: number;
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
            /** @description [0,1] fraction of scoring weight whose dimensions had real (non-fallback) input data (see the response's `dataCoverage`). Always emitted. Folded (smoothstep-shaped) into the historical `confidence`; 1.0 = full coverage (no penalty). */
            data_coverage: number;
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
