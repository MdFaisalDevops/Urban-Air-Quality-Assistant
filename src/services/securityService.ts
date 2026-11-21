/**
 * Security Service - Safe and Responsible Implementation
 * Follows OWASP recommendations for prompt injection defense, XSS mitigation, and rate limiting.
 */

export interface SecurityValidationResult {
  isValid: boolean;
  sanitizedText: string;
  threatDetected?: string;
}

export class SecurityService {
  private static MAX_PROMPT_LENGTH = 1200;
  private static MIN_PROMPT_LENGTH = 2;

  // Known prompt injection and jailbreak signatures
  private static INJECTION_PATTERNS = [
    /ignore\s+(all\s+)?(previous|above|prior)\s+instructions/i,
    /disregard\s+(all\s+)?(previous|above|prior)\s+instructions/i,
    /system\s+prompt\s+override/i,
    /you\s+are\s+now\s+in\s+developer\s+mode/i,
    /act\s+as\s+(dan|jailbreak|unrestricted)/i,
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /onerror\s*=/gi,
    /onload\s*=/gi,
  ];

  // Rate limiting tracker (client-side protection against spam/exhaustion)
  private static requestTimestamps: number[] = [];
  private static RATE_LIMIT_MAX_REQUESTS = 15;
  private static RATE_LIMIT_WINDOW_MS = 60000; // 15 requests per minute

  /**
   * Sanitizes text to prevent Cross-Site Scripting (XSS)
   */
  public static sanitizeHtml(input: string): string {
    if (!input) return '';
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Validates and sanitizes user prompt inputs before sending to GenAI
   */
  public static validatePrompt(input: string): SecurityValidationResult {
    if (!input || typeof input !== 'string') {
      return { isValid: false, sanitizedText: '', threatDetected: 'Prompt cannot be empty.' };
    }

    const trimmed = input.trim();

    if (trimmed.length < this.MIN_PROMPT_LENGTH) {
      return { isValid: false, sanitizedText: '', threatDetected: 'Prompt is too short.' };
    }

    if (trimmed.length > this.MAX_PROMPT_LENGTH) {
      return {
        isValid: false,
        sanitizedText: trimmed.substring(0, this.MAX_PROMPT_LENGTH),
        threatDetected: `Prompt exceeds maximum allowed length of ${this.MAX_PROMPT_LENGTH} characters.`,
      };
    }

    // Check for prompt injection signatures
    for (const pattern of this.INJECTION_PATTERNS) {
      if (pattern.test(trimmed)) {
        return {
          isValid: false,
          sanitizedText: trimmed.replace(pattern, '[BLOCKED]'),
          threatDetected: 'Potential prompt injection or unsafe directive detected.',
        };
      }
    }

    // Clean control characters while preserving valid newlines & punctuation
    const sanitized = trimmed.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    return {
      isValid: true,
      sanitizedText: sanitized,
    };
  }

  /**
   * Enforces client-side rate limiting to prevent resource exhaustion
   */
  public static checkRateLimit(): { allowed: boolean; waitSeconds?: number } {
    const now = Date.now();
    // Purge timestamps older than the window
    this.requestTimestamps = this.requestTimestamps.filter(
      (ts) => now - ts < this.RATE_LIMIT_WINDOW_MS
    );

    if (this.requestTimestamps.length >= this.RATE_LIMIT_MAX_REQUESTS) {
      const oldest = this.requestTimestamps[0];
      const waitSeconds = Math.ceil((this.RATE_LIMIT_WINDOW_MS - (now - oldest)) / 1000);
      return { allowed: false, waitSeconds: Math.max(1, waitSeconds) };
    }

    this.requestTimestamps.push(now);
    return { allowed: true };
  }

  /**
   * Validates Gemini API Key format (starts with AIza and has appropriate length)
   */
  public static isValidApiKeyFormat(key: string): boolean {
    if (!key) return false;
    const cleanKey = key.trim();
    return cleanKey.startsWith('AIza') && cleanKey.length >= 35 && cleanKey.length <= 45;
  }

  /**
   * Safely masks API key for display (e.g. AIzaSy...x89A)
   */
  public static maskApiKey(key: string): string {
    if (!key || key.length < 10) return '••••••••';
    return `${key.slice(0, 6)}••••••••${key.slice(-4)}`;
  }
}

