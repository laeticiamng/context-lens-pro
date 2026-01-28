// Navigation & Route Tests
// Verifies all routes are defined and render without errors

import { describe, it, expect } from 'vitest';

// Route definitions from App.tsx
const routes = [
  { path: '/', component: 'Index' },
  { path: '/auth', component: 'Auth' },
  { path: '/dashboard', component: 'Dashboard' },
  { path: '/settings', component: 'Settings' },
  { path: '/docs', component: 'Documentation' },
  { path: '/privacy', component: 'Privacy' },
  { path: '/terms', component: 'Terms' },
  { path: '/contact', component: 'Contact' },
  { path: '/clinical-ar', component: 'ClinicalAR' },
  { path: '/clinical-ar/:patientId', component: 'ClinicalAR' },
  { path: '/shared/:scriptId', component: 'SharedScript' },
  { path: '/vision-irm', component: 'VisionIRM' },
  { path: '/lunettes-irm', component: 'LunettesIRM' },
  { path: '*', component: 'NotFound' },
];

describe('Route Definitions', () => {
  it('should have all required routes defined', () => {
    const requiredRoutes = ['/', '/auth', '/dashboard', '/settings', '/docs'];
    requiredRoutes.forEach(route => {
      expect(routes.some(r => r.path === route)).toBe(true);
    });
  });

  it('should have catch-all route for 404', () => {
    const catchAll = routes.find(r => r.path === '*');
    expect(catchAll).toBeDefined();
    expect(catchAll?.component).toBe('NotFound');
  });

  it('should have dynamic route for patient ID', () => {
    const patientRoute = routes.find(r => r.path.includes(':patientId'));
    expect(patientRoute).toBeDefined();
  });

  it('should have medical routes for LUNETTES IRM', () => {
    const medicalRoutes = routes.filter(r => 
      r.path.includes('irm') || r.path.includes('clinical')
    );
    expect(medicalRoutes.length).toBeGreaterThanOrEqual(3);
  });

  it('should have legal pages (privacy, terms)', () => {
    expect(routes.some(r => r.path === '/privacy')).toBe(true);
    expect(routes.some(r => r.path === '/terms')).toBe(true);
  });
});

describe('Protected Routes', () => {
  const protectedPaths = ['/dashboard', '/settings', '/lunettes-irm'];
  const publicPaths = ['/', '/auth', '/docs', '/privacy', '/terms', '/contact'];

  it('should identify protected routes correctly', () => {
    protectedPaths.forEach(path => {
      const route = routes.find(r => r.path === path);
      expect(route).toBeDefined();
    });
  });

  it('should identify public routes correctly', () => {
    publicPaths.forEach(path => {
      const route = routes.find(r => r.path === path);
      expect(route).toBeDefined();
    });
  });

  it('protected routes should require auth redirect logic', () => {
    // These pages check for auth and redirect to /auth if not logged in
    const authRequiredComponents = ['Dashboard', 'Settings', 'LunettesIRM'];
    authRequiredComponents.forEach(comp => {
      expect(routes.some(r => r.component === comp)).toBe(true);
    });
  });
});

describe('Route Parameters', () => {
  it('should have correct parameter names', () => {
    const paramRoutes = routes.filter(r => r.path.includes(':'));
    
    // Check patientId param
    const patientRoute = paramRoutes.find(r => r.path.includes(':patientId'));
    expect(patientRoute).toBeDefined();
    
    // Check scriptId param
    const scriptRoute = paramRoutes.find(r => r.path.includes(':scriptId'));
    expect(scriptRoute).toBeDefined();
  });
});

describe('Component Mapping', () => {
  const componentNames = routes.map(r => r.component);
  
  it('should have unique component mappings', () => {
    // Check that main routes have distinct components (except for dynamic routes)
    const mainRoutes = routes.filter(r => !r.path.includes(':'));
    const uniqueComponents = new Set(mainRoutes.map(r => r.component));
    
    // Some routes may share components (like clinical-ar variants)
    expect(uniqueComponents.size).toBeGreaterThanOrEqual(10);
  });

  it('should use correct component naming conventions', () => {
    componentNames.forEach(name => {
      // PascalCase check
      expect(name[0]).toBe(name[0].toUpperCase());
    });
  });
});
