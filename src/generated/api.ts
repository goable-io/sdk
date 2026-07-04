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
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ScoreResponse"];
                    };
                };
                /** @description Plan upgrade required (ensemble or rider_skill_level on Free/Starter) */
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
                /** @description No profile for activity */
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
         * @description Convert a bindable quote (≤24h old) into a bound policy for a specific coverage year. Returns the serialised policy + the quoteId + optional `driftAdvisories` — a soft warning surfaced when the resolved cell has an open watch-level L9 drift event. A warning/critical drift event at bind time REFUSES the bind with 422 DRIFT_ACTIVE (see the 422 response). Fires the `underwriting.policy.bound` webhook on success.
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
                /** @description Quote already bound to another policy */
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
                /** @description Requires Pro+ plan */
                402: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description No profile for activity, or no atlas row for the resolved sub-spot */
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
         * @description Public JSON-LD artefact of the Goable Sustainability Index (CC BY 4.0). Session-weighted 0-100 index across zones plus per-zone breakdowns. Governed by k-anonymity (default k≥10) + a 90-day publication lag in the underlying reader — no additional privacy work required for the public surface. Content-Type: application/ld+json. Edge-cached for 5 minutes.
         */
        get: {
            parameters: {
                query: {
                    /** @description Inclusive start of the reporting period. */
                    from: string;
                    /** @description Exclusive end of the reporting period. */
                    to: string;
                    /** @description Zone grid cell edge length in km (default: reader-configured). */
                    zoneKm?: number;
                    /** @description k-anonymity threshold: zones with fewer than k sessions are suppressed. */
                    k?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Sustainability Index document (JSON-LD) */
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
                /** @description Sustainability index reader not wired */
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
            confidenceDetail?: components["schemas"]["ConfidenceDetailForecast"];
            calibration_provenance?: components["schemas"]["CalibrationProvenance"] | null;
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
        };
        ConfidenceDetail: components["schemas"]["ConfidenceDetailForecast"] | components["schemas"]["ConfidenceDetailHistorical"] | components["schemas"]["ConfidenceDetailClimate"];
        ConfidenceDetailForecast: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            mode: "forecast";
            forecast_skill: number;
            provider_agreement: number;
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
