export type HazardRiskLevel = 'low' | 'moderate' | 'high' | 'assembly';

export type HazardArea = {
  id: string;
  name: string;
  riskLevel: HazardRiskLevel;
  description: string;
  iconKey: 'shield' | 'triangle' | 'heart' | 'building' | 'users' | 'route';
};

export const HAZARD_AREAS: HazardArea[] = [
  { id: 'main-gate', name: 'Main Gate', riskLevel: 'moderate', description: 'Maintain controlled entry checks during dismissal hours.', iconKey: 'shield' },
  { id: 'covered-court', name: 'Covered Court', riskLevel: 'low', description: 'Routine monitoring for crowd flow and slip hazards.', iconKey: 'users' },
  { id: 'clinic', name: 'Clinic', riskLevel: 'assembly', description: 'Primary first-aid holding and support area.', iconKey: 'heart' },
  { id: 'main-building', name: 'Main Building', riskLevel: 'high', description: 'Watch stairwells and power rooms during severe weather.', iconKey: 'building' },
  { id: 'assembly-area', name: 'Assembly Area', riskLevel: 'assembly', description: 'Designated gathering point for evacuation and roll call.', iconKey: 'users' },
  { id: 'evacuation-route', name: 'Evacuation Route', riskLevel: 'moderate', description: 'Keep lanes open and clear for fast movement.', iconKey: 'route' },
];
