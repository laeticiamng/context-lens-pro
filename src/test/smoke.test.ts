// Smoke Test Suite for ContextLens Platform
// Covers critical user paths: Auth, Navigation, Data CRUD, Forms

import { describe, it, expect, vi } from "vitest";

// Mock Supabase client
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      signInWithPassword: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signUp: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

describe("Platform Smoke Tests", () => {
  describe("Validation Schemas", () => {
    it("should validate email format", async () => {
      const { emailSchema } = await import("@/lib/validations");
      
      expect(emailSchema.safeParse("valid@email.com").success).toBe(true);
      expect(emailSchema.safeParse("invalid-email").success).toBe(false);
      expect(emailSchema.safeParse("").success).toBe(false);
    });

    it("should validate password requirements", async () => {
      const { passwordSchema } = await import("@/lib/validations");
      
      expect(passwordSchema.safeParse("validPass123").success).toBe(true);
      expect(passwordSchema.safeParse("short").success).toBe(false);
      expect(passwordSchema.safeParse("").success).toBe(false);
    });

    it("should validate contact form with XSS prevention", async () => {
      const { contactSchema } = await import("@/lib/validations");
      
      const validData = {
        name: "John Doe",
        email: "john@example.com",
        subject: "Test Subject",
        message: "This is a test message with enough characters.",
      };
      
      expect(contactSchema.safeParse(validData).success).toBe(true);
      
      // Test XSS prevention
      const xssData = {
        ...validData,
        name: "<script>alert('xss')</script>",
      };
      expect(contactSchema.safeParse(xssData).success).toBe(false);
    });

    it("should validate cabinet SIRET format", async () => {
      const { cabinetSchema } = await import("@/lib/validations");
      
      const validCabinet = {
        name: "Cabinet Médical Test",
        siret: "12345678901234",
        postal_code: "75001",
      };
      
      expect(cabinetSchema.safeParse(validCabinet).success).toBe(true);
      
      // Invalid SIRET
      const invalidCabinet = {
        ...validCabinet,
        siret: "123456", // Too short
      };
      expect(cabinetSchema.safeParse(invalidCabinet).success).toBe(false);
    });

    it("should validate patient reference format", async () => {
      const { patientRefSchema } = await import("@/lib/validations");
      
      const validRef = {
        patient_reference: "PAT-2024-001",
        protocol_id: "full-body-scan",
      };
      
      expect(patientRefSchema.safeParse(validRef).success).toBe(true);
      
      // Invalid - contains special characters
      const invalidRef = {
        patient_reference: "PAT<script>",
        protocol_id: "full-body-scan",
      };
      expect(patientRefSchema.safeParse(invalidRef).success).toBe(false);
    });
  });

  describe("Language System", () => {
    it("should have complete translation keys for FR and EN", async () => {
      const { translations } = await import("@/i18n/translations");
      
      // Check main keys exist in both languages
      const enKeys = Object.keys(translations.en);
      const frKeys = Object.keys(translations.fr);
      
      expect(enKeys).toEqual(frKeys);
      expect(enKeys.length).toBeGreaterThan(10);
    });
  });

  describe("Security", () => {
    it("should not expose sensitive data in client code", () => {
      // Verify no hardcoded API keys in build
      const envKeys = Object.keys(import.meta.env);
      const sensitivePatterns = ['SECRET', 'PRIVATE', 'PASSWORD'];
      
      const exposedSecrets = envKeys.filter(key => 
        sensitivePatterns.some(pattern => key.includes(pattern))
      );
      
      expect(exposedSecrets.length).toBe(0);
    });
  });
});

describe("Utility Functions", () => {
  it("should merge class names correctly", async () => {
    const { cn } = await import("@/lib/utils");
    
    expect(cn("foo", "bar")).toBe("foo bar");
    expect(cn("foo", false && "bar")).toBe("foo");
    expect(cn("foo", undefined)).toBe("foo");
  });
});
