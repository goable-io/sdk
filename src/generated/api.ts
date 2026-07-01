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
                    };
                };
            };
            responses: {
                /** @description Score 0-100 + verdict + confidence + eco + calibration_provenance */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ScoreResponse"];
                    };
                };
                /** @description Plan upgrade required (ensemble on Free/Starter) */
                402: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description No profile for activity */
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
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ScoreSeriesResponse"];
                    };
                };
                /** @description No profile for activity */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Validation error / window too large */
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
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ScoreMultiResponse"];
                    };
                };
                /** @description Validation error / max activities exceeded */
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
    "/v1/score/historical": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Historical climatology scoring (Pro+) */
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
                /** @description Percentiles + exceedance + verdict frequency */
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
                /** @description Requires Pro+ plan */
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
                            /** @description LLM explanation (Pro+) */
                            natural_language?: boolean;
                        };
                    };
                };
            };
            responses: {
                /** @description binding_constraint + marginal_sensitivities + best_window_24h + best_nearby_spots + optional natural_language */
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
                /** @description natural_language=true requires Pro+ */
                402: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description No profile for activity */
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
    "/v1/decision": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Personalized go/no-go decision (Pro+) */
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
                /** @description score + verdict + decision block + degraded_mode + advisory_notice */
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
                /** @description Requires Pro+ plan */
                402: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description No profile for activity */
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
        /** LLM narrative explanation of a score (L2c, Pro+) */
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
                /** @description Requires Pro+ plan */
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
    "/v1/intelligence/briefing": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** LLM multi-slot briefing (L2c, Pro+) */
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
                /** @description Requires Pro+ plan */
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
    "/v1/projections": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Climate-decadal activity viability projection (Scale) */
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
                /** @description Per-decade projection distributions */
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
        /** Parametric underwriting quote (Scale) */
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
                            location: components["schemas"]["GeoPoint"];
                            activity: string;
                            spotId?: string;
                        };
                        portfolio?: {
                            location: components["schemas"]["GeoPoint"];
                            activity: string;
                            spotId?: string;
                        }[];
                        coverageWindow: {
                            monthFrom: number;
                            dayFrom: number;
                            monthTo: number;
                            dayTo: number;
                        } & {
                            [key: string]: unknown;
                        };
                        payout?: {
                            amount: number;
                            /** @enum {string} */
                            currency: "EUR" | "USD" | "GBP" | "CHF";
                        };
                    } & {
                        [key: string]: unknown;
                    };
                };
            };
            responses: {
                /** @description Premium + bindable policy terms */
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
    "/v1/underwriting/bind": {
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
         * @description Convert a recent /v1/underwriting/quote into a bound policy. Submit the quoteId (≤24h old); returns a policyId + immutable cohortHash anchoring the bound weather sample set.
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
                        quoteId: string;
                        premiumConfirmation?: {
                            [key: string]: unknown;
                        };
                    } & {
                        [key: string]: unknown;
                    };
                };
            };
            responses: {
                /** @description Bound policy id + cohort hash + settlement schedule */
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
                /** @description Quote expired or not found */
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
    "/v1/underwriting/evaluate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Read-only payout projection for a bound policy (Scale)
         * @description Returns the current accrued shortfall + projected payout for a bound policy. Does NOT settle — settlement runs automatically on a cron at policy expiry.
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
                        policyId: string;
                    };
                };
            };
            responses: {
                /** @description Accrued shortfall + projected payout per currency */
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
                /** @description Policy not found */
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
         * @description Close the calibration loop. Submit the actual outcome (ran/cancelled/no_show/rescheduled/note) of a /v1/score session. The calibration pipeline + forecast verification + drift monitor consume these. Requires the `outcomes:write` scope (live keys carry it by default; test keys don't).
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
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
                        detail?: {
                            [key: string]: unknown;
                        };
                    };
                };
            };
            responses: {
                /** @description Accepted (queued for the next calibration batch) */
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
                /** @description Session not found */
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
         * Skill-conditioned scoring
         * @description Same scoring engine, but conditioned on a rider/operator skill level. Returns the score curve as a function of skill so a booking flow can branch ("good for beginners" vs "experts only").
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
                        window?: components["schemas"]["TimeWindow"];
                        /** @description Skill points (0-1) to score. Defaults to 5 quantile points. */
                        riderSkillLevels?: number[];
                    };
                };
            };
            responses: {
                /** @description Score per skill level + difficulty band */
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
                /** @description No profile for activity */
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
         * LLM analysis of a borderline / surprising score (L2c, Pro+)
         * @description Asks the LLM to inspect a score that's near a verdict boundary or contradicts operator intuition. Returns a narrative + a structured `limiting_class` taxonomy entry.
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
                /** @description Requires Pro+ plan */
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
         * Submit station observation for data assimilation (Pro+)
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
                        /** Format: date-time */
                        observedAt: string;
                        values: {
                            [key: string]: number;
                        };
                        qualityFlags?: {
                            [key: string]: unknown;
                        };
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
            };
        };
        put?: never;
        /** Register a tenant observation station (Pro+) */
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
                        location: components["schemas"]["GeoPoint"];
                        elevationM?: number;
                        metadata?: {
                            [key: string]: unknown;
                        };
                    } & {
                        [key: string]: unknown;
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
                /** @description Requires Pro+ plan */
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
        /** Update a station (Pro+) */
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
                        location?: components["schemas"]["GeoPoint"];
                        elevationM?: number;
                        metadata?: {
                            [key: string]: unknown;
                        };
                    } & {
                        [key: string]: unknown;
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
            };
        };
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
            /** @description Machine-readable error code */
            error: string;
            message?: string;
            issues?: {
                [key: string]: unknown;
            }[];
            detail?: {
                [key: string]: unknown;
            };
        };
        /** @enum {string} */
        Verdict: "unsafe" | "poor" | "marginal" | "fair" | "favorable" | "excellent";
        ScoreResponse: {
            score: number;
            verdict: components["schemas"]["Verdict"];
            confidence: number;
            breakdown: ({
                dimension?: string;
                score?: number;
                weight?: number;
                contribution?: number;
            } & {
                [key: string]: unknown;
            })[];
            physics: {
                [key: string]: unknown;
            };
            alerts: ({
                code?: string;
                severity?: string;
                message?: string;
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
            confidenceDetail?: {
                [key: string]: unknown;
            };
            calibration_provenance?: {
                [key: string]: unknown;
            };
            assimilation?: {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        };
        ScoreSeriesResponse: {
            series: ({
                /** Format: date-time */
                at?: string;
                score: number;
                verdict: components["schemas"]["Verdict"];
            } & {
                [key: string]: unknown;
            })[];
        } & {
            [key: string]: unknown;
        };
        ScoreMultiResponse: {
            results: ({
                activity: string;
                score: number;
                verdict: components["schemas"]["Verdict"];
            } & {
                [key: string]: unknown;
            })[];
        } & {
            [key: string]: unknown;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
