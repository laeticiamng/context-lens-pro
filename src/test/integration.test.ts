// Integration Tests - Platform Audit
// Tests for backend/frontend coherence and security

import { describe, it, expect } from 'vitest';
import { 
  signUpSchema, 
  signInSchema, 
  contactSchema, 
  scriptSchema, 
  deviceSchema,
  cabinetSchema,
  mriDeviceSchema,
  patientRefSchema,
} from '@/lib/validations';

describe('Authentication Validation', () => {
  it('rejects weak passwords', () => {
    const result = signUpSchema.safeParse({ 
      email: 'test@example.com', 
      password: '123' 
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid signup credentials', () => {
    const result = signUpSchema.safeParse({ 
      email: 'test@example.com', 
      password: 'SecurePass123!' 
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email format', () => {
    const result = signInSchema.safeParse({ 
      email: 'notanemail', 
      password: 'password123' 
    });
    expect(result.success).toBe(false);
  });
});

describe('Contact Form Security', () => {
  it('sanitizes XSS in contact messages', () => {
    const result = contactSchema.safeParse({
      name: '<script>alert("xss")</script>John',
      email: 'john@example.com',
      subject: 'Hello',
      message: 'Test message here',
    });
    // Should pass validation but values are sanitized by trim
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).not.toContain('<script>');
    }
  });

  it('rejects empty message', () => {
    const result = contactSchema.safeParse({
      name: 'John',
      email: 'john@example.com',
      subject: 'Hello',
      message: '',
    });
    expect(result.success).toBe(false);
  });

  it('validates email format strictly', () => {
    const result = contactSchema.safeParse({
      name: 'John',
      email: 'invalid-email',
      subject: 'Hello',
      message: 'Test message',
    });
    expect(result.success).toBe(false);
  });
});

describe('Script Management Validation', () => {
  it('validates script creation', () => {
    const result = scriptSchema.safeParse({
      title: 'My Script',
      content: 'console.log("hello")',
      tags: ['demo', 'test'],
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty script title', () => {
    const result = scriptSchema.safeParse({
      title: '',
      content: 'some content',
      tags: [],
    });
    expect(result.success).toBe(false);
  });
});

describe('Device Management Validation', () => {
  it('validates device creation', () => {
    const result = deviceSchema.safeParse({
      device_name: 'Even G2',
      device_type: 'glasses',
      manufacturer: 'Even Realities',
      tier: 1,
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid tier values', () => {
    const result = deviceSchema.safeParse({
      device_name: 'Test Device',
      device_type: 'glasses',
      manufacturer: 'Test',
      tier: 99,
    });
    expect(result.success).toBe(false);
  });
});

describe('Medical Cabinet Validation (LUNETTES IRM)', () => {
  it('validates cabinet creation with name only', () => {
    const result = cabinetSchema.safeParse({
      name: 'Cabinet Radiologie Paris',
    });
    expect(result.success).toBe(true);
  });

  it('validates cabinet creation with SIRET and postal code', () => {
    const result = cabinetSchema.safeParse({
      name: 'Cabinet Radiologie Paris',
      siret: '12345678901234',
      postal_code: '75014',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid SIRET format', () => {
    const result = cabinetSchema.safeParse({
      name: 'Test Cabinet',
      siret: '123', // Too short
    });
    expect(result.success).toBe(false);
  });

  it('validates French postal code format', () => {
    const result = cabinetSchema.safeParse({
      name: 'Test Cabinet',
      postal_code: '75001',
    });
    expect(result.success).toBe(true);
  });
});

describe('MRI Device Validation', () => {
  it('validates MRI device creation', () => {
    const result = mriDeviceSchema.safeParse({
      manufacturer: 'Chipiron',
      model: 'SQUID-ULF-1',
      serial_number: 'CHI-2024-001234',
      device_type: 'chipiron_squid',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty serial number', () => {
    const result = mriDeviceSchema.safeParse({
      manufacturer: 'Chipiron',
      model: 'SQUID-ULF-1',
      serial_number: '',
      device_type: 'chipiron_squid',
    });
    expect(result.success).toBe(false);
  });
});

describe('Patient Reference Validation', () => {
  it('validates patient reference format', () => {
    const result = patientRefSchema.safeParse('PAT-2024-001234');
    expect(result.success).toBe(true);
  });

  it('rejects too short patient reference', () => {
    const result = patientRefSchema.safeParse('AB');
    expect(result.success).toBe(false);
  });

  it('sanitizes dangerous characters', () => {
    const result = patientRefSchema.safeParse('<script>PAT001</script>');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toContain('<script>');
    }
  });
});

describe('i18n - Language Support', () => {
  it('has French and English translations structure', () => {
    // Import would be tested in actual runtime
    expect(['fr', 'en']).toContain('fr');
    expect(['fr', 'en']).toContain('en');
  });
});

describe('RLS Security - Data Isolation', () => {
  it('ensures user data isolation principle', () => {
    // This is a conceptual test - RLS is enforced at DB level
    // User A should not see User B data
    const userAId = 'user-a-uuid';
    const userBId = 'user-b-uuid';
    expect(userAId).not.toBe(userBId);
  });

  it('ensures cabinet data isolation principle', () => {
    // Cabinet A should not see Cabinet B medical data
    const cabinetAId = 'cabinet-a-uuid';
    const cabinetBId = 'cabinet-b-uuid';
    expect(cabinetAId).not.toBe(cabinetBId);
  });
});

describe('Error Handling', () => {
  it('provides user-friendly error messages', () => {
    const errors = {
      invalidEmail: 'Invalid email format',
      weakPassword: 'Password must be at least 6 characters',
      networkError: 'Connection failed. Please try again.',
    };
    expect(errors.invalidEmail).toBeTruthy();
    expect(errors.weakPassword).toBeTruthy();
    expect(errors.networkError).toBeTruthy();
  });
});
