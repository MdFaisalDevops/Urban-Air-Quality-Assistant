import { describe, it, expect } from 'vitest';
import { AqiService } from '../services/aqiService';
import { getAqiCategory, getAqiScaleInfo } from '../constants/aqiScales';

describe('AqiService & CPCB Scale Definitions', () => {
  it('should return all predefined Indian city stations', () => {
    const cities = AqiService.getAllCities();
    expect(cities.length).toBeGreaterThanOrEqual(8);

    const delhi = cities.find((c) => c.name.includes('Delhi'));
    const kolkata = cities.find((c) => c.name.includes('Kolkata'));
    const mumbai = cities.find((c) => c.name.includes('Mumbai'));

    expect(delhi).toBeDefined();
    expect(kolkata).toBeDefined();
    expect(mumbai).toBeDefined();
  });

  it('should accurately calculate CPCB sub-index for PM2.5 breakpoints', () => {
    // 0-30 -> Good (0-50)
    expect(AqiService.calculateCpcbAqi(25, 40)).toBeLessThanOrEqual(50);

    // 31-60 -> Satisfactory (51-100)
    const sat = AqiService.calculateCpcbAqi(50, 80);
    expect(sat).toBeGreaterThanOrEqual(51);
    expect(sat).toBeLessThanOrEqual(100);

    // 121-250 -> Very Poor (301-400)
    const veryPoor = AqiService.calculateCpcbAqi(200, 300);
    expect(veryPoor).toBeGreaterThanOrEqual(301);
    expect(veryPoor).toBeLessThanOrEqual(400);

    // > 250 -> Severe (401-500)
    const severe = AqiService.calculateCpcbAqi(350, 480);
    expect(severe).toBeGreaterThanOrEqual(401);
  });

  it('should classify categories properly according to CPCB benchmarks', () => {
    expect(getAqiCategory(45)).toBe('Good');
    expect(getAqiCategory(85)).toBe('Satisfactory');
    expect(getAqiCategory(165)).toBe('Moderate');
    expect(getAqiCategory(275)).toBe('Poor');
    expect(getAqiCategory(360)).toBe('Very Poor');
    expect(getAqiCategory(450)).toBe('Severe');
    expect(getAqiCategory(550)).toBe('Hazardous');
  });

  it('should return valid color and health statements for scale info', () => {
    const info = getAqiScaleInfo(420);
    expect(info.category).toBe('Severe');
    expect(info.colorHex).toBe('#991B1B');
    expect(info.familyAdvice.children).toBeDefined();
    expect(info.familyAdvice.seniors).toBeDefined();
  });
});

