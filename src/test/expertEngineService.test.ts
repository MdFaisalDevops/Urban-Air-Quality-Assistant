import { describe, it, expect } from 'vitest';
import { ExpertEngineService } from '../services/expertEngineService';
import { INDIAN_CITIES_STATIONS } from '../data/citiesData';

describe('ExpertEngineService Rule-Based Domain AI', () => {
  const delhi = INDIAN_CITIES_STATIONS.find((c) => c.id === 'delhi-anand-vihar')!;
  const kolkata = INDIAN_CITIES_STATIONS.find((c) => c.id === 'kolkata-victoria')!;

  it('responds with DIY air purifier construction guidance on purifier queries', () => {
    const res = ExpertEngineService.generateExpertResponse('how do I build a DIY purifier?', delhi);
    expect(res.source).toBe('expert_engine');
    expect(res.text).toContain('DIY High-CADR Air Purifier');
    expect(res.text).toContain('Table/Box Fan');
    expect(res.text).toContain('H13 HEPA');
    expect(res.suggestions).toBeDefined();
    expect(res.suggestions!.length).toBeGreaterThanOrEqual(3);
  });

  it('explains atmospheric winter inversion and safe venting times', () => {
    const res = ExpertEngineService.generateExpertResponse('when can I open windows for fresh air?', delhi);
    expect(res.source).toBe('expert_engine');
    expect(res.text).toContain('Winter Temperature Inversion');
    expect(res.text).toContain('1:00 PM – 3:15 PM');
    expect(res.text).toContain('Solar Venting Window');
  });

  it('provides specialized guidance for infants and elderly individuals', () => {
    const res = ExpertEngineService.generateExpertResponse('how to protect my infant child and elderly grandparents?', kolkata);
    expect(res.source).toBe('expert_engine');
    expect(res.text).toContain('Infants & Seniors');
    expect(res.text).toContain('Clean Air Sanctuary Room');
    expect(res.text).toContain('mosquito coil');
  });

  it('gives N95/FFP2 certification advice for mask queries', () => {
    const res = ExpertEngineService.generateExpertResponse('which mask should I buy for smog?', delhi);
    expect(res.source).toBe('expert_engine');
    expect(res.text).toContain('N95');
    expect(res.text).toContain('FFP2');
    expect(res.text).toContain('Cloth masks');
  });

  it('provides RWA community action blueprint for guard heating and leaf composting', () => {
    const res = ExpertEngineService.generateExpertResponse('how can our community stop night guard trash burning?', delhi);
    expect(res.source).toBe('expert_engine');
    expect(res.text).toContain('RWA Action Blueprint');
    expect(res.text).toContain('Quartz/Infrared booth heaters');
    expect(res.text).toContain('Leaf Composting');
  });

  it('provides comprehensive multi-point smart advisory as default fallback', () => {
    const res = ExpertEngineService.generateExpertResponse('what should I do in general today?', delhi);
    expect(res.source).toBe('expert_engine');
    expect(res.text).toContain('VayuMitra Smart Advisory');
    expect(res.text).toContain(delhi.name);
    expect(res.suggestions).toBeDefined();
  });
});
