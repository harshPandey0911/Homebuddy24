/**
 * Centralized Theme Colors Configuration
 * Separate themes for User and Vendor modules
 * Update colors here to change theme across entire app
 * 
 * Usage:
 * - User module: import { userTheme } from '../../../../theme'
 * - Vendor module: import { vendorTheme } from '../../../../theme'
 * - Worker module: import { workerTheme } from '../../../../theme'
 */

// Homestr LOGO Core Brand Colors
const brand = {
  teal: '#0F4A44', // Dark Forest Green/Teal from screenshot
  yellow: 'var(--brand-yellow)',
  orange: 'var(--brand-orange)',
  gradient: 'linear-gradient(135deg, #0F4A44 0%, #0D3D38 100%)',
  conic: 'conic-gradient(from 0deg, #0F4A44, #FACC15, #F97316, #0F4A44)'
};

// User Theme Colors
const userTheme = {
  backgroundGradient: 'var(--bg-gradient)',
  gradient: brand.gradient,
  headerGradient: 'linear-gradient(180deg, #0F4A44 0%, #0D3D38 100%)',
  headerBg: '#0F4A44',
  button: '#0F4A44',
  primary: '#0F4A44',
  icon: '#0F4A44',
  cardShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  cardBorder: '1px solid rgba(0, 0, 0, 0.05)',
  brand: brand
};

// Vendor Theme Colors
const vendorTheme = {
  backgroundGradient: 'var(--bg-gradient)',
  gradient: brand.gradient,
  headerGradient: brand.teal,
  accentGradient: 'linear-gradient(135deg, #0F4A44 0%, #0D3D38 100%)',
  button: brand.teal,
  primary: brand.teal,
  icon: brand.teal,
  brand: brand
};

// Worker Theme Colors
const workerTheme = {
  backgroundGradient: 'var(--bg-gradient)',
  gradient: brand.gradient,
  headerGradient: brand.teal,
  button: brand.teal,
  primary: brand.teal,
  icon: brand.teal,
  brand: brand
};

// Default theme (for backward compatibility)
const themeColors = userTheme;

// Export all themes
export { userTheme, vendorTheme, workerTheme, brand };
export default themeColors;


