import { createHash } from "node:crypto";
import {
  getProfessionalProfileLabel,
  type WaitlistLead,
} from "@/lib/validations";

const turnstileVerifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const googleScriptTimeoutMs = 8_000;
const minSubmissionTimeMs = 1_800;
const maxClientClockSkewMs = 10_000;
const rateLimitRules = [
  { name: "ip", limit: 8, windowMs: 10 * 60 * 1000 },
  { name: "email", limit: 3, windowMs: 60 * 60 * 1000 },
] as const;

type RateLimitRule = (typeof rateLimitRules)[number];
type RateBucket = {
  count: number;
  resetAt: number;
};

type TurnstileResponse = {
  success?: boolean;
  hostname?: string;
  "error-codes"?: string[];
};

export type TurnstileVerification =
  | { success: true; status: "verified" | "dev-bypass"; hostname?: string }
  | {
      success: false;
      status: "missing-secret" | "missing-token" | "failed" | "unavailable";
      errorCodes?: string[];
    };

export type WaitlistRequestMetadata = {
  createdAt: string;
  ip?: string;
  userAgent?: string;
  turnstileStatus: TurnstileVerification["status"];
};

export class WaitlistIntegrationError extends Error {
  constructor(
    readonly code: "missing-config" | "webhook-failed",
    message: string,
  ) {
    super(message);
    this.name = "WaitlistIntegrationError";
  }
}

const rateBuckets = new Map<string, RateBucket>();
let warnedMissingTurnstileSecret = false;
let warnedMissingGoogleScript = false;

export function getTurnstileSiteKey() {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";
}

export function getClientIp(headers: Headers) {
  const cfConnectingIp = headers.get("cf-connecting-ip")?.trim();
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }

  const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || undefined;
}

export function checkWaitlistTiming(startedAt: number | undefined, now = Date.now()) {
  if (typeof startedAt !== "number") {
    return process.env.NODE_ENV === "production"
      ? { allowed: false, reason: "missing-started-at" as const }
      : { allowed: true, reason: "dev-missing-started-at" as const };
  }

  const elapsedMs = now - startedAt;
  if (elapsedMs < minSubmissionTimeMs || elapsedMs < -maxClientClockSkewMs) {
    return { allowed: false, reason: "too-fast" as const };
  }

  return { allowed: true, reason: "ok" as const };
}

export function checkWaitlistRateLimit({
  ip,
  email,
  now = Date.now(),
}: {
  ip?: string;
  email: string;
  now?: number;
}) {
  const checks = [
    { rule: rateLimitRules[0], identifier: ip ?? "unknown" },
    { rule: rateLimitRules[1], identifier: email },
  ];

  pruneRateBuckets(now);

  for (const check of checks) {
    const bucket = getRateBucket(check.rule, check.identifier, now);
    if (bucket.count >= check.rule.limit) {
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
      };
    }
  }

  for (const check of checks) {
    const bucket = getRateBucket(check.rule, check.identifier, now);
    bucket.count += 1;
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

export async function verifyTurnstileToken(token: string | undefined, ip?: string): Promise<TurnstileVerification> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      return { success: false, status: "missing-secret" };
    }

    warnMissingTurnstileSecret();
    return { success: true, status: "dev-bypass" };
  }

  if (!token) {
    return { success: false, status: "missing-token" };
  }

  try {
    const response = await fetch(turnstileVerifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        response: token,
        ...(ip ? { remoteip: ip } : {}),
      }),
    });
    const result = (await response.json()) as TurnstileResponse;

    if (response.ok && result.success) {
      return { success: true, status: "verified", hostname: result.hostname };
    }

    return {
      success: false,
      status: "failed",
      errorCodes: result["error-codes"] ?? [],
    };
  } catch (error) {
    console.error("Turnstile validation failed", error);
    return { success: false, status: "unavailable" };
  }
}

export async function registerWaitlistLead(lead: WaitlistLead, metadata: WaitlistRequestMetadata) {
  const webhookUrl = process.env.GOOGLE_SCRIPT_WEBHOOK_URL?.trim();
  const secret = process.env.GOOGLE_SCRIPT_SECRET?.trim();

  if (!webhookUrl || !secret) {
    if (process.env.NODE_ENV !== "production") {
      warnMissingGoogleScript();
      return { persisted: false };
    }

    throw new WaitlistIntegrationError(
      "missing-config",
      "Google Apps Script webhook is not configured.",
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), googleScriptTimeoutMs);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        email: lead.email,
        professionalProfile: getProfessionalProfileLabel(lead.profile),
        privacyAccepted: lead.privacyAccepted,
        source: lead.source ? `darquis.com/${lead.source}` : "darquis.com",
        userAgent: truncate(metadata.userAgent ?? "", 500),
        ip: hashIp(metadata.ip, secret),
        createdAt: metadata.createdAt,
        turnstileStatus: metadata.turnstileStatus,
        notes: "ip contains a salted SHA-256 hash, not the raw IP address.",
      }),
      signal: controller.signal,
    });
    const responseBody = await readJsonResponse(response);

    if (!response.ok || isExplicitFailure(responseBody)) {
      throw new WaitlistIntegrationError(
        "webhook-failed",
        `Google Apps Script returned ${response.status}.`,
      );
    }

    return { persisted: true };
  } catch (error) {
    if (error instanceof WaitlistIntegrationError) {
      throw error;
    }

    throw new WaitlistIntegrationError(
      "webhook-failed",
      error instanceof Error ? error.message : "Google Apps Script request failed.",
    );
  } finally {
    clearTimeout(timeout);
  }
}

function getRateBucket(rule: RateLimitRule, identifier: string, now: number) {
  const key = `${rule.name}:${identifier}`;
  const existing = rateBuckets.get(key);

  if (existing && existing.resetAt > now) {
    return existing;
  }

  const bucket = { count: 0, resetAt: now + rule.windowMs };
  rateBuckets.set(key, bucket);
  return bucket;
}

function pruneRateBuckets(now: number) {
  if (rateBuckets.size < 200) {
    return;
  }

  for (const [key, bucket] of rateBuckets) {
    if (bucket.resetAt <= now) {
      rateBuckets.delete(key);
    }
  }
}

function hashIp(ip: string | undefined, salt: string) {
  if (!ip) {
    return "";
  }

  return `sha256:${createHash("sha256").update(`${salt}:${ip}`).digest("hex")}`;
}

function truncate(value: string, maxLength: number) {
  return value.length > maxLength ? value.slice(0, maxLength) : value;
}

async function readJsonResponse(response: Response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function isExplicitFailure(responseBody: unknown) {
  return (
    responseBody !== null &&
    typeof responseBody === "object" &&
    "success" in responseBody &&
    (responseBody as { success?: unknown }).success === false
  );
}

function warnMissingTurnstileSecret() {
  if (warnedMissingTurnstileSecret) {
    return;
  }

  warnedMissingTurnstileSecret = true;
  console.warn(
    "Darquis waitlist: TURNSTILE_SECRET_KEY is not configured. Development requests bypass Turnstile; production rejects them.",
  );
}

function warnMissingGoogleScript() {
  if (warnedMissingGoogleScript) {
    return;
  }

  warnedMissingGoogleScript = true;
  console.warn(
    "Darquis waitlist: GOOGLE_SCRIPT_WEBHOOK_URL or GOOGLE_SCRIPT_SECRET is missing. Development requests are accepted without persistence.",
  );
}
