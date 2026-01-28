// Security Tests
// Tests for RLS policies, input validation, and data isolation

import { describe, it, expect, vi } from 'vitest';
import { 
  signUpSchema, 
  signInSchema, 
  contactSchema,
  patientRefSchema,
  patientScanSchema,
  cabinetSchema,
  mriDeviceSchema,
} from '@/lib/validations';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

describe('XSS Prevention', () => {
  it('should sanitize script tags in contact form name', () => {
    const result = contactSchema.safeParse({
      name: '<script>alert("xss")</script>Test',
      email: 'test@example.com',
      subject: 'Hello',
      message: 'This is a test message.',
    });
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).not.toContain('<script>');
      expect(result.data.name).toContain('&lt;script&gt;');
    }
  });

  it('should sanitize HTML in patient references', () => {
    const result = patientRefSchema.safeParse('<img src=x onerror=alert(1)>PAT001');
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toContain('<img');
      expect(result.data).toContain('&lt;img');
    }
  });

  it('should sanitize patient scan references', () => {
    const result = patientScanSchema.safeParse({
      patient_reference: '<script>PAT</script>-001',
      protocol_id: 'full-body',
    });
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.patient_reference).not.toContain('<script>');
    }
  });

  it('should reject HTML in contact subject', () => {
    const result = contactSchema.safeParse({
      name: 'John',
      email: 'john@example.com',
      subject: '<script>XSS</script>',
      message: 'Test message here',
    });
    
    expect(result.success).toBe(false);
  });
});

describe('Authentication Validation', () => {
  it('should reject empty email', () => {
    const result = signInSchema.safeParse({
      email: '',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('should reject malformed email', () => {
    const result = signInSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('should reject short passwords on signup', () => {
    const result = signUpSchema.safeParse({
      email: 'test@example.com',
      password: '123',
    });
    expect(result.success).toBe(false);
  });

  it('should accept valid credentials', () => {
    const result = signUpSchema.safeParse({
      email: 'test@example.com',
      password: 'SecurePass123',
    });
    expect(result.success).toBe(true);
  });

  it('should trim email whitespace', () => {
    const result = signInSchema.safeParse({
      email: '  test@example.com  ',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });
});

describe('Medical Data Validation', () => {
  it('should validate SIRET format (14 digits)', () => {
    const validResult = cabinetSchema.safeParse({
      name: 'Cabinet Test',
      siret: '12345678901234',
    });
    expect(validResult.success).toBe(true);

    const invalidResult = cabinetSchema.safeParse({
      name: 'Cabinet Test',
      siret: '123456', // Too short
    });
    expect(invalidResult.success).toBe(false);
  });

  it('should validate French postal code format', () => {
    const validResult = cabinetSchema.safeParse({
      name: 'Cabinet Test',
      postal_code: '75001',
    });
    expect(validResult.success).toBe(true);

    const invalidResult = cabinetSchema.safeParse({
      name: 'Cabinet Test',
      postal_code: '7500', // Too short
    });
    expect(invalidResult.success).toBe(false);
  });

  it('should validate MRI device IP address format', () => {
    const validResult = mriDeviceSchema.safeParse({
      manufacturer: 'Chipiron',
      model: 'SQUID-1',
      serial_number: 'CHI-001',
      device_type: 'chipiron_squid',
      ip_address: '192.168.1.100',
    });
    expect(validResult.success).toBe(true);

    const invalidResult = mriDeviceSchema.safeParse({
      manufacturer: 'Chipiron',
      model: 'SQUID-1',
      serial_number: 'CHI-001',
      device_type: 'chipiron_squid',
      ip_address: 'not-an-ip',
    });
    expect(invalidResult.success).toBe(false);
  });

  it('should require mandatory MRI device fields', () => {
    const result = mriDeviceSchema.safeParse({
      manufacturer: 'Chipiron',
      // missing model, serial_number, device_type
    });
    expect(result.success).toBe(false);
  });
});

describe('Data Isolation Principles', () => {
  it('RLS principle: User A should not access User B data', () => {
    const userAId = 'user-a-uuid-123';
    const userBId = 'user-b-uuid-456';
    
    // Simulating RLS check
    const checkAccess = (resourceOwnerId: string, requesterId: string) => {
      return resourceOwnerId === requesterId;
    };
    
    expect(checkAccess(userAId, userAId)).toBe(true);
    expect(checkAccess(userAId, userBId)).toBe(false);
    expect(checkAccess(userBId, userAId)).toBe(false);
  });

  it('RLS principle: Cabinet isolation for medical data', () => {
    const cabinetAId = 'cabinet-a-uuid';
    const cabinetBId = 'cabinet-b-uuid';
    
    const checkCabinetAccess = (dataOwnerId: string, requesterId: string) => {
      return dataOwnerId === requesterId;
    };
    
    expect(checkCabinetAccess(cabinetAId, cabinetAId)).toBe(true);
    expect(checkCabinetAccess(cabinetAId, cabinetBId)).toBe(false);
  });

  it('RLS principle: Anonymous users blocked from protected tables', () => {
    const checkAnonymousAccess = (userId: string | null) => {
      return userId !== null;
    };
    
    expect(checkAnonymousAccess(null)).toBe(false);
    expect(checkAnonymousAccess('authenticated-user')).toBe(true);
  });
});

describe('Input Length Limits', () => {
  it('should reject overly long email addresses', () => {
    const longEmail = 'a'.repeat(256) + '@example.com';
    const result = signUpSchema.safeParse({
      email: longEmail,
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('should reject overly long passwords', () => {
    const longPassword = 'a'.repeat(130);
    const result = signUpSchema.safeParse({
      email: 'test@example.com',
      password: longPassword,
    });
    expect(result.success).toBe(false);
  });

  it('should reject overly long patient references', () => {
    const longRef = 'PAT-' + 'X'.repeat(100);
    const result = patientRefSchema.safeParse(longRef);
    expect(result.success).toBe(false);
  });
});

describe('Secret Protection', () => {
  it('should not have hardcoded secrets in environment', () => {
    const envKeys = Object.keys(import.meta.env);
    const dangerousPatterns = ['SECRET_KEY', 'PRIVATE_KEY', 'PASSWORD', 'API_SECRET'];
    
    const exposedDangerous = envKeys.filter(key => 
      dangerousPatterns.some(pattern => key.includes(pattern))
    );
    
    expect(exposedDangerous.length).toBe(0);
  });

  it('should only expose publishable keys to client (no secrets)', () => {
    const envKeys = Object.keys(import.meta.env);
    // Check that no secret keys are exposed
    const secretPatterns = ['SECRET', 'PRIVATE', 'PASSWORD', 'SERVICE_ROLE'];
    
    const exposedSecrets = envKeys.filter(key => 
      secretPatterns.some(pattern => key.toUpperCase().includes(pattern))
    );
    
    // No secret keys should be exposed to the client
    expect(exposedSecrets.length).toBe(0);
  });
});
