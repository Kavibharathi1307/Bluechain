import type {
  Alert,
  AiRecommendation,
  DegradationAlert,
  EvidenceSubmission,
  HealthBreakdown,
  RestorationSite,
  StatSummary,
  TrendPoint,
  VegetationHistory,
} from '../types'

// ---------------------------------------------------------------------------
// Restoration Sites — realistic mock data for Indian coastal restoration
// This is the single source of truth. Swap this array for a real API call
// in src/lib/projects.ts and everything else stays the same.
// ---------------------------------------------------------------------------

export const sites: RestorationSite[] = [
  {
    id: 'SR-001',
    name: 'Sundarbans Mangrove Recovery',
    region: 'Sundarbans Delta',
    state: 'West Bengal',
    areaHa: 12400,
    ecosystem: 'Mangroves',
    healthScore: 82,
    healthStatus: 'good',
    status: 'Active',
    vegetationCover: 86,
    speciesCount: 64,
    carbonSequestered: 18200,
    progress: 74,
    lastVerified: '2 hours ago',
    description:
      'Community-led mangrove afforestation across the Sundarbans delta, focusing on erosion-prone islands and salt-tolerant pioneer species.',
    riskLevel: 'medium',
    verificationStatus: 'verified',
    plantsReported: 425000,
    estimatedSurvival: 78,
    coordinates: { lat: 21.9497, lng: 88.882 },
    startDate: '2022-03-15',
    projectManager: 'Dr. Meera Sen',
    phases: [
      {
        id: 'SB-P1',
        label: 'Site Preparation & Baseline Survey',
        status: 'completed',
        date: 'Mar 2022',
        detail:
          'Hydrology mapping and baseline biodiversity assessment completed across 9 islands.',
      },
      {
        id: 'SB-P2',
        label: 'Nursery Development',
        status: 'completed',
        date: 'Aug 2022',
        detail:
          'Four community nurseries established, producing 425,000 saplings of Avicennia and Rhizophora.',
      },
      {
        id: 'SB-P3',
        label: 'Mass Planting',
        status: 'completed',
        date: 'Jun 2023',
        detail:
          'Primary planting drive completed; gap-planting continues in low-survival micro-basins.',
      },
      {
        id: 'SB-P4',
        label: 'Growth Monitoring & Verification',
        status: 'in-progress',
        date: 'Ongoing',
        detail:
          'Quarterly NDVI sweeps and on-ground transect verification by partner NGOs.',
      },
    ],
    recentActivity: [
      {
        id: 'SB-A1',
        type: 'verification',
        title: 'Quarterly verification passed',
        detail:
          'NDVI composite improved 4.2 points; 12 ground transects verified.',
        timestamp: '2 hours ago',
        actor: 'System · AI model',
      },
      {
        id: 'SB-A2',
        type: 'survey',
        title: 'Species census complete',
        detail:
          '64 species recorded, including a Ganges dolphin sighting near zone D.',
        timestamp: 'Yesterday',
        actor: 'Dr. Meera Sen',
      },
      {
        id: 'SB-A3',
        type: 'alert',
        title: 'Cyclone surge risk flagged',
        detail:
          'Low-pressure system may bring a coastal surge exceeding 0.6 m within 72 hours.',
        timestamp: '11 hours ago',
        actor: 'IMD Feed',
      },
      {
        id: 'SB-A4',
        type: 'planting',
        title: 'Gap planting in plot E-3',
        detail: '3,200 saplings added to low-survival micro-basins.',
        timestamp: '3 days ago',
        actor: 'Field Crew · Zone 2',
      },
    ],
  },
  {
    id: 'SR-002',
    name: 'Gulf of Mannar Coral Regeneration',
    region: 'Gulf of Mannar',
    state: 'Tamil Nadu',
    areaHa: 3200,
    ecosystem: 'Coral Reef',
    healthScore: 74,
    healthStatus: 'good',
    status: 'Active',
    vegetationCover: 71,
    speciesCount: 48,
    carbonSequestered: 6400,
    progress: 62,
    lastVerified: '5 hours ago',
    description:
      'Coral nursery and outplanting program across the Gulf of Mannar biosphere reserve, centred on framework-building Acropora species.',
    riskLevel: 'medium',
    verificationStatus: 'verified',
    plantsReported: 186000,
    estimatedSurvival: 74,
    coordinates: { lat: 9.1573, lng: 79.3165 },
    startDate: '2021-11-02',
    projectManager: 'R. Surya Prakash',
    phases: [
      {
        id: 'GM-P1',
        label: 'Site Assessment',
        status: 'completed',
        date: 'Nov 2021',
        detail:
          'Reef condition and turbidity baseline surveyed across candidate nursery sites.',
      },
      {
        id: 'GM-P2',
        label: 'Nursery & Fragmentation',
        status: 'completed',
        date: 'Feb 2022',
        detail:
          'Underwater nursery lines established and 12,000 coral fragments attached.',
      },
      {
        id: 'GM-P3',
        label: 'Outplanting',
        status: 'completed',
        date: 'Dec 2022',
        detail:
          'Outplanting onto reef substrate completed across the northern sector.',
      },
      {
        id: 'GM-P4',
        label: 'Growth & Bleaching Monitoring',
        status: 'in-progress',
        date: 'Ongoing',
        detail:
          'Weekly sea-surface temperature tracking and monthly quadrat surveys.',
      },
    ],
    recentActivity: [
      {
        id: 'GM-A1',
        type: 'survey',
        title: 'Bleaching check — clear',
        detail:
          'Sea-surface temperature below threshold; no bleaching signs detected.',
        timestamp: '5 hours ago',
        actor: 'Dr. Kavya Nair',
      },
      {
        id: 'GM-A2',
        type: 'verification',
        title: 'Reef health satellite pass',
        detail: 'Live coral cover up 3.1 points on monitored transects.',
        timestamp: 'Yesterday',
        actor: 'System · AI model',
      },
      {
        id: 'GM-A3',
        type: 'maintenance',
        title: 'Nursery lines cleaned',
        detail: 'Macroalgal overgrowth removed from 40 nursery lines.',
        timestamp: '2 days ago',
        actor: 'Diving Team',
      },
    ],
  },
  {
    id: 'SR-003',
    name: 'Chilika Lake Wetland Rehabilitation',
    region: 'Chilika Lagoon',
    state: 'Odisha',
    areaHa: 6800,
    ecosystem: 'Wetland',
    healthScore: 66,
    healthStatus: 'moderate',
    status: 'Monitoring',
    vegetationCover: 58,
    speciesCount: 41,
    carbonSequestered: 8900,
    progress: 55,
    lastVerified: '1 day ago',
    description:
      "Hydrological restoration of India's largest brackish lagoon, combining channel dredging with reed and sedge planting along the southern inlet.",
    riskLevel: 'high',
    verificationStatus: 'pending',
    plantsReported: 248000,
    estimatedSurvival: 62,
    coordinates: { lat: 19.7218, lng: 85.3165 },
    startDate: '2023-01-20',
    projectManager: 'Anil Mishra',
    phases: [
      {
        id: 'CL-P1',
        label: 'Lagoon Health Assessment',
        status: 'completed',
        date: 'Jan 2023',
        detail:
          'Water quality, sediment and biodiversity baseline captured across the lagoon.',
      },
      {
        id: 'CL-P2',
        label: 'Channel Restoration',
        status: 'completed',
        date: 'Sep 2023',
        detail:
          'Southern inlet dredged to restore tidal flushing and reduce siltation.',
      },
      {
        id: 'CL-P3',
        label: 'Wetland Planting',
        status: 'in-progress',
        date: 'May 2024',
        detail:
          'Reed and sedge planting along restored shorelines and island fringes.',
      },
      {
        id: 'CL-P4',
        label: 'Long-term Monitoring',
        status: 'planned',
        date: 'Planned',
        detail:
          'Seasonal bird census, water quality and vegetation trend monitoring.',
      },
    ],
    recentActivity: [
      {
        id: 'CL-A1',
        type: 'alert',
        title: 'Salinity spike detected',
        detail:
          'Salinity rose 18% above baseline near the southern inlet; seasonal runoff suspected.',
        timestamp: '38 minutes ago',
        actor: 'Sensor Network',
      },
      {
        id: 'CL-A2',
        type: 'survey',
        title: 'Migratory bird count below norm',
        detail:
          'Monthly census reports 12% fewer wintering species than the 5-year average.',
        timestamp: '6 hours ago',
        actor: 'Field Crew · Zone 1',
      },
      {
        id: 'CL-A3',
        type: 'planting',
        title: 'Planting milestone reached',
        detail: '200,000th reed sapling planted along the western shore.',
        timestamp: '4 days ago',
        actor: 'Anil Mishra',
      },
    ],
  },
  {
    id: 'SR-004',
    name: 'Pichavaram Mangrove Restoration',
    region: 'Cauvery Delta',
    state: 'Tamil Nadu',
    areaHa: 2100,
    ecosystem: 'Mangroves',
    healthScore: 58,
    healthStatus: 'at-risk',
    status: 'At Risk',
    vegetationCover: 47,
    speciesCount: 33,
    carbonSequestered: 3100,
    progress: 41,
    lastVerified: '3 hours ago',
    description:
      'Restoration of storm-damaged mangrove patches in the Pichavaram estuarine complex, with erosion-control structures along the western fringe.',
    riskLevel: 'critical',
    verificationStatus: 'in-review',
    plantsReported: 152000,
    estimatedSurvival: 55,
    coordinates: { lat: 11.4269, lng: 79.7875 },
    startDate: '2023-06-10',
    projectManager: 'Tamil Selvi',
    phases: [
      {
        id: 'PC-P1',
        label: 'Damage Assessment',
        status: 'completed',
        date: 'Jun 2023',
        detail:
          'Storm damage mapped; 240 ha of canopy loss identified in the western fringe.',
      },
      {
        id: 'PC-P2',
        label: 'Erosion Control Structures',
        status: 'in-progress',
        date: 'Dec 2023',
        detail:
          'Bamboo baffles and sediment traps installed along priority shorelines.',
      },
      {
        id: 'PC-P3',
        label: 'Replanting',
        status: 'planned',
        date: 'Planned',
        detail:
          'Mass replanting of Rhizophora and Avicennia in cleared micro-basins.',
      },
      {
        id: 'PC-P4',
        label: 'Monitoring',
        status: 'planned',
        date: 'Planned',
        detail:
          'Monthly canopy-cover tracking and survival audits for replanted areas.',
      },
    ],
    recentActivity: [
      {
        id: 'PC-A1',
        type: 'alert',
        title: 'Shoreline erosion accelerating',
        detail:
          'NDVI shows a 2.3 ha reduction in canopy cover over the last 30 days.',
        timestamp: '2 hours ago',
        actor: 'AI Detection',
      },
      {
        id: 'PC-A2',
        type: 'verification',
        title: 'Verification review opened',
        detail:
          'Latest field evidence under independent review for canopy-loss claim.',
        timestamp: '3 hours ago',
        actor: 'Verification Board',
      },
      {
        id: 'PC-A3',
        type: 'maintenance',
        title: 'Sediment trap cleared',
        detail: 'Trap E-1 cleared of 12 m³ of silt after monsoon runoff.',
        timestamp: '1 day ago',
        actor: 'Field Crew · Zone 3',
      },
    ],
  },
  {
    id: 'SR-005',
    name: 'Mandovi Estuary Blue Carbon Project',
    region: 'Mandovi Estuary',
    state: 'Goa',
    areaHa: 1500,
    ecosystem: 'Estuary',
    healthScore: 78,
    healthStatus: 'good',
    status: 'Active',
    vegetationCover: 76,
    speciesCount: 52,
    carbonSequestered: 4200,
    progress: 69,
    lastVerified: '8 hours ago',
    description:
      'Blue carbon pilot combining saltmarsh and mangrove planting along the Mandovi estuary with continuous carbon-flux monitoring.',
    riskLevel: 'low',
    verificationStatus: 'verified',
    plantsReported: 98000,
    estimatedSurvival: 80,
    coordinates: { lat: 15.49, lng: 73.83 },
    startDate: '2022-08-05',
    projectManager: 'Rohit Naik',
    phases: [
      {
        id: 'MD-P1',
        label: 'Carbon Baseline Study',
        status: 'completed',
        date: 'Aug 2022',
        detail:
          'Soil carbon stock and tidal-flux baseline quantified at 24 sampling plots.',
      },
      {
        id: 'MD-P2',
        label: 'Saltmarsh & Mangrove Planting',
        status: 'completed',
        date: 'Mar 2023',
        detail:
          'Saltmarsh sprigs and mangrove saplings established across the mid-estuary.',
      },
      {
        id: 'MD-P3',
        label: 'Flux Tower Deployment',
        status: 'completed',
        date: 'Nov 2023',
        detail:
          'Two eddy-covariance towers began continuous CO₂ flux measurement.',
      },
      {
        id: 'MD-P4',
        label: 'Carbon Accounting & Reporting',
        status: 'in-progress',
        date: 'Ongoing',
        detail:
          'Quarterly sequestration estimates feeding the blue carbon ledger.',
      },
    ],
    recentActivity: [
      {
        id: 'MD-A1',
        type: 'verification',
        title: 'Carbon ledger updated',
        detail: '1,040 tCO₂e sequestered recorded for the last quarter.',
        timestamp: '8 hours ago',
        actor: 'System · Flux tower',
      },
      {
        id: 'MD-A2',
        type: 'survey',
        title: 'Fish diversity transect',
        detail: '52 species recorded; estuary connectivity healthy.',
        timestamp: '1 day ago',
        actor: 'Rohit Naik',
      },
      {
        id: 'MD-A3',
        type: 'planting',
        title: 'Fringe replanting complete',
        detail: '1,600 saplings added to the eastern tidal fringe.',
        timestamp: '5 days ago',
        actor: 'Field Crew · Zone 1',
      },
    ],
  },
  {
    id: 'SR-006',
    name: 'Kavvayi Seagrass & Wetland Complex',
    region: 'Kavvayi Backwaters',
    state: 'Kerala',
    areaHa: 900,
    ecosystem: 'Seagrass',
    healthScore: 71,
    healthStatus: 'moderate',
    status: 'Monitoring',
    vegetationCover: 66,
    speciesCount: 39,
    carbonSequestered: 1800,
    progress: 60,
    lastVerified: '12 hours ago',
    description:
      'Community-based seagrass meadow restoration and wetland conservation in the Kavvayi backwaters of northern Kerala.',
    riskLevel: 'medium',
    verificationStatus: 'pending',
    plantsReported: 74000,
    estimatedSurvival: 71,
    coordinates: { lat: 12.0645, lng: 75.2513 },
    startDate: '2023-04-18',
    projectManager: 'Lekshmi Pillai',
    phases: [
      {
        id: 'KV-P1',
        label: 'Meadow Survey & Mapping',
        status: 'completed',
        date: 'Apr 2023',
        detail:
          'Existing seagrass beds mapped and donor meadows selected for propagation.',
      },
      {
        id: 'KV-P2',
        label: 'Propagule & Sprog Planting',
        status: 'completed',
        date: 'Oct 2023',
        detail:
          'Community planting events restored fragmented meadow patches.',
      },
      {
        id: 'KV-P3',
        label: 'Fisherfolk Co-management',
        status: 'in-progress',
        date: 'Ongoing',
        detail:
          'Co-management agreements and channel markers to prevent boat scarring.',
      },
      {
        id: 'KV-P4',
        label: 'Meadow Health Monitoring',
        status: 'planned',
        date: 'Planned',
        detail:
          'Annual meadow extent and species diversity assessment.',
      },
    ],
    recentActivity: [
      {
        id: 'KV-A1',
        type: 'survey',
        title: 'Meadow extent survey scheduled',
        detail: 'Annual drone survey of meadow boundaries due this month.',
        timestamp: '12 hours ago',
        actor: 'Lekshmi Pillai',
      },
      {
        id: 'KV-A2',
        type: 'planting',
        title: 'Community planting day',
        detail: '80 volunteers planted 6,000 sprigs in the north lagoon.',
        timestamp: '3 days ago',
        actor: 'Community Group',
      },
      {
        id: 'KV-A3',
        type: 'maintenance',
        title: 'Channel markers installed',
        detail: 'Six new markers guide boats away from regenerating beds.',
        timestamp: '6 days ago',
        actor: 'Fisherfolk Co-op',
      },
    ],
  },
]

export const projects: RestorationSite[] = sites

export const alerts: Alert[] = [
  {
    id: 'AL-1042',
    severity: 'critical',
    category: 'water quality',
    title: 'Salinity spike detected',
    siteId: 'SR-003',
    siteName: 'Chilika Lake Wetland Rehabilitation',
    detail:
      'Salinity rose 18% above baseline near the southern inlet. Seasonal runoff and channel siltation suspected.',
    timestamp: '38 min ago',
    verified: true,
  },
  {
    id: 'AL-1041',
    severity: 'high',
    category: 'erosion',
    title: 'Shoreline erosion accelerating',
    siteId: 'SR-004',
    siteName: 'Pichavaram Mangrove Restoration',
    detail:
      'NDVI analysis shows a 2.3 ha reduction in canopy cover over the last 30 days at the western fringe.',
    timestamp: '2 hrs ago',
    verified: true,
  },
  {
    id: 'AL-1040',
    severity: 'medium',
    category: 'biodiversity',
    title: 'Migratory bird count below norm',
    siteId: 'SR-003',
    siteName: 'Chilika Lake Wetland Rehabilitation',
    detail:
      'Monthly census reports 12% fewer wintering species than the 5-year average for this period.',
    timestamp: '6 hrs ago',
    verified: false,
  },
  {
    id: 'AL-1039',
    severity: 'high',
    category: 'weather',
    title: 'Cyclone alert: coastal surge risk',
    siteId: 'SR-001',
    siteName: 'Sundarbans Mangrove Recovery',
    detail:
      'IMD forecast indicates a low-pressure system may bring a surge exceeding 0.6 m in 72 hours.',
    timestamp: '11 hrs ago',
    verified: true,
  },
  {
    id: 'AL-1038',
    severity: 'info',
    category: 'deforestation',
    title: 'Illegal logging patrol scheduled',
    siteId: 'SR-002',
    siteName: 'Gulf of Mannar Coral Regeneration',
    detail:
      'Routine satellite sweep scheduled for the buffer zone. No anomalies in the last scan.',
    timestamp: '1 day ago',
    verified: false,
  },
]

export const healthBreakdown: HealthBreakdown[] = [
  { label: 'Vegetation Cover', value: 78, delta: +4.2 },
  { label: 'Species Diversity', value: 72, delta: +2.1 },
  { label: 'Water Quality', value: 64, delta: -3.4 },
  { label: 'Sediment Stability', value: 81, delta: +1.8 },
  { label: 'Blue Carbon Uptake', value: 76, delta: +5.0 },
]

export const stats: StatSummary[] = [
  {
    label: 'Area Under Restoration',
    value: '26,900 ha',
    delta: '+4.2%',
    deltaPositive: true,
  },
  {
    label: 'Active Projects',
    value: '6',
    delta: '2 monitoring',
    deltaPositive: true,
  },
  {
    label: 'Average Health Score',
    value: '71.5',
    delta: '+2.3',
    deltaPositive: true,
  },
  {
    label: 'Open Alerts',
    value: '5',
    delta: '1 critical',
    deltaPositive: false,
  },
]

export const vegetationTrend: TrendPoint[] = [
  { month: 'Jan', vegetationCover: 41, speciesIndex: 38, waterQuality: 52 },
  { month: 'Feb', vegetationCover: 45, speciesIndex: 40, waterQuality: 55 },
  { month: 'Mar', vegetationCover: 49, speciesIndex: 43, waterQuality: 51 },
  { month: 'Apr', vegetationCover: 47, speciesIndex: 45, waterQuality: 48 },
  { month: 'May', vegetationCover: 53, speciesIndex: 47, waterQuality: 52 },
  { month: 'Jun', vegetationCover: 58, speciesIndex: 50, waterQuality: 56 },
  { month: 'Jul', vegetationCover: 64, speciesIndex: 54, waterQuality: 60 },
  { month: 'Aug', vegetationCover: 69, speciesIndex: 58, waterQuality: 58 },
  { month: 'Sep', vegetationCover: 73, speciesIndex: 62, waterQuality: 63 },
  { month: 'Oct', vegetationCover: 76, speciesIndex: 66, waterQuality: 61 },
  { month: 'Nov', vegetationCover: 80, speciesIndex: 70, waterQuality: 65 },
  { month: 'Dec', vegetationCover: 84, speciesIndex: 74, waterQuality: 68 },
]

export const restorationImpact = [
  { label: 'Sundarbans', restored: 1860 },
  { label: 'Mannar', restored: 920 },
  { label: 'Chilika', restored: 1240 },
  { label: 'Pichavaram', restored: 640 },
  { label: 'Mandovi', restored: 720 },
  { label: 'Kavvayi', restored: 480 },
]

export const ecosystemDistribution = [
  { name: 'Mangroves', value: 54, color: '#0d9488' },
  { name: 'Wetland', value: 22, color: '#10b981' },
  { name: 'Coral Reef', value: 12, color: '#06b6d4' },
  { name: 'Estuary', value: 8, color: '#f59e0b' },
  { name: 'Seagrass', value: 4, color: '#6366f1' },
]

// ---------------------------------------------------------------------------
// Degradation Detection — Phase 5
// Deterministic mock historical vegetation data per project.
// Each entry compares a previous measurement with the current one.
// ---------------------------------------------------------------------------

export const vegetationHistory: VegetationHistory[] = [
  {
    projectId: 'SR-001',
    projectName: 'Sundarbans Mangrove Recovery',
    previousCoverage: 82,
    currentCoverage: 86,
    measuredAt: '2026-07-15',
    previousMeasuredAt: '2026-04-15',
  },
  {
    projectId: 'SR-002',
    projectName: 'Gulf of Mannar Coral Regeneration',
    previousCoverage: 75,
    currentCoverage: 71,
    measuredAt: '2026-07-15',
    previousMeasuredAt: '2026-04-15',
  },
  {
    projectId: 'SR-003',
    projectName: 'Chilika Lake Wetland Rehabilitation',
    previousCoverage: 62,
    currentCoverage: 58,
    measuredAt: '2026-07-15',
    previousMeasuredAt: '2026-04-15',
  },
  {
    projectId: 'SR-004',
    projectName: 'Pichavaram Mangrove Restoration',
    previousCoverage: 61,
    currentCoverage: 47,
    measuredAt: '2026-07-15',
    previousMeasuredAt: '2026-04-15',
  },
  {
    projectId: 'SR-005',
    projectName: 'Mandovi Estuary Blue Carbon Project',
    previousCoverage: 74,
    currentCoverage: 76,
    measuredAt: '2026-07-15',
    previousMeasuredAt: '2026-04-15',
  },
  {
    projectId: 'SR-006',
    projectName: 'Kavvayi Seagrass & Wetland Complex',
    previousCoverage: 68,
    currentCoverage: 66,
    measuredAt: '2026-07-15',
    previousMeasuredAt: '2026-04-15',
  },
]

// Degradation alerts — generated deterministically from vegetation history.
// Only projects with significant vegetation decline have alerts.

export const degradationAlerts: DegradationAlert[] = [
  {
    id: 'DA-5001',
    severity: 'critical',
    projectId: 'SR-004',
    projectName: 'Pichavaram Mangrove Restoration',
    issue: 'Vegetation coverage declined by 14% (61% to 47%) over the last quarter.',
    detectedAt: '2026-07-15',
    recommendedAction: 'Urgent field inspection within 48 hours. Assess erosion structures and consider emergency replanting.',
  },
  {
    id: 'DA-5002',
    severity: 'high',
    projectId: 'SR-003',
    projectName: 'Chilika Lake Wetland Rehabilitation',
    issue: 'Vegetation coverage declined by 4% (62% to 58%) over the last quarter.',
    detectedAt: '2026-07-15',
    recommendedAction: 'Conduct field inspection within 7 days. Review water quality and salinity levels near planting zones.',
  },
  {
    id: 'DA-5003',
    severity: 'medium',
    projectId: 'SR-002',
    projectName: 'Gulf of Mannar Coral Regeneration',
    issue: 'Vegetation coverage declined by 4% (75% to 71%) over the last quarter.',
    detectedAt: '2026-07-15',
    recommendedAction: 'Monitor coral bleaching indicators. Check sea-surface temperature trends and nursery line health.',
  },
  {
    id: 'DA-5004',
    severity: 'low',
    projectId: 'SR-006',
    projectName: 'Kavvayi Seagrass & Wetland Complex',
    issue: 'Vegetation coverage declined by 2% (68% to 66%) over the last quarter.',
    detectedAt: '2026-07-15',
    recommendedAction: 'Continue routine monitoring. Review boat traffic near seagrass beds and verify channel marker placement.',
  },
]

// AI-assisted recommendations for each degradation alert

export const aiRecommendations: AiRecommendation[] = [
  // SR-004 — Critical
  {
    id: 'AR-5001',
    projectId: 'SR-004',
    degradationAlertId: 'DA-5001',
    action: 'Conduct urgent field inspection within 48 hours',
    rationale: 'Critical vegetation loss detected. On-ground assessment required to identify root cause — likely accelerated erosion or storm damage.',
  },
  {
    id: 'AR-5002',
    projectId: 'SR-004',
    degradationAlertId: 'DA-5001',
    action: 'Assess vegetation loss and map affected zones',
    rationale: 'Use drone and transect surveys to delineate the extent of canopy reduction and identify priority replanting areas.',
  },
  {
    id: 'AR-5003',
    projectId: 'SR-004',
    degradationAlertId: 'DA-5001',
    action: 'Consider targeted replanting with erosion-resistant species',
    rationale: 'Replant Rhizophora and Avicennia in micro-basins with bamboo baffle reinforcement to stabilise the western fringe.',
  },
  // SR-003 — High
  {
    id: 'AR-5004',
    projectId: 'SR-003',
    degradationAlertId: 'DA-5002',
    action: 'Conduct field inspection within 7 days',
    rationale: 'Declining vegetation may be linked to elevated salinity from the recent spike detected near the southern inlet.',
  },
  {
    id: 'AR-5005',
    projectId: 'SR-003',
    degradationAlertId: 'DA-5002',
    action: 'Assess water quality and salinity levels',
    rationale: 'Compare current salinity readings with the 18% spike baseline to determine if channel dredging is needed.',
  },
  {
    id: 'AR-5006',
    projectId: 'SR-003',
    degradationAlertId: 'DA-5002',
    action: 'Consider supplemental reed planting in low-coverage zones',
    rationale: 'Targeted reed and sedge planting along affected shorelines can help stabilise sediment and improve habitat.',
  },
  // SR-002 — Medium
  {
    id: 'AR-5007',
    projectId: 'SR-002',
    degradationAlertId: 'DA-5003',
    action: 'Monitor coral bleaching indicators closely',
    rationale: 'Vegetation decline in coral ecosystems often correlates with thermal stress. Review SST data from the last 90 days.',
  },
  {
    id: 'AR-5008',
    projectId: 'SR-002',
    degradationAlertId: 'DA-5003',
    action: 'Inspect nursery lines for macroalgal overgrowth',
    rationale: 'Algal competition can suppress coral growth. Clean nursery lines and check fragment attachment rates.',
  },
  {
    id: 'AR-5009',
    projectId: 'SR-002',
    degradationAlertId: 'DA-5003',
    action: 'Evaluate outplanting survival rates',
    rationale: 'Cross-reference satellite data with diver surveys to confirm whether decline is real or an artifact of turbidity.',
  },
  // SR-006 — Low
  {
    id: 'AR-5010',
    projectId: 'SR-006',
    degradationAlertId: 'DA-5004',
    action: 'Continue routine meadow health monitoring',
    rationale: 'The 2% decline is within normal seasonal variation. No immediate action required, but track the next quarterly reading.',
  },
  {
    id: 'AR-5011',
    projectId: 'SR-006',
    degradationAlertId: 'DA-5004',
    action: 'Verify channel marker placement',
    rationale: 'Boat scarring is a primary risk for seagrass. Ensure markers guide traffic away from regenerating beds.',
  },
  {
    id: 'AR-5012',
    projectId: 'SR-006',
    degradationAlertId: 'DA-5004',
    action: 'Schedule community awareness session',
    rationale: 'Engage fisherfolk co-management partners to reinforce best practices around seagrass meadow protection.',
  },
]

// ---------------------------------------------------------------------------
// Mock Evidence Submissions — Phase 3
// ---------------------------------------------------------------------------

export const evidenceSubmissions: EvidenceSubmission[] = [
  // SR-001 — Sundarbans (verified + needs-review)
  {
    id: 'EV-001',
    projectId: 'SR-001',
    photoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop',
    latitude: 21.952,
    longitude: 88.885,
    capturedAt: '2025-07-20T09:15:00Z',
    submittedBy: 'Dr. Meera Sen',
    notes: 'Healthy Avicennia saplings observed in plot A-3. Canopy coverage improving after monsoon season.',
    status: 'verified',
    validationReasons: [],
    submittedAt: '2025-07-20T10:30:00Z',
  },
  {
    id: 'EV-002',
    projectId: 'SR-001',
    photoUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&h=300&fit=crop',
    latitude: 21.961,
    longitude: 88.893,
    capturedAt: '2025-07-22T14:40:00Z',
    submittedBy: 'Field Crew · Zone 2',
    notes: 'Rhizophora seedlings showing good establishment in brackish zone. Water level nominal.',
    status: 'verified',
    validationReasons: [],
    submittedAt: '2025-07-22T15:10:00Z',
  },
  {
    id: 'EV-003',
    projectId: 'SR-001',
    photoUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop',
    latitude: 22.15,
    longitude: 89.12,
    capturedAt: '2025-07-25T11:00:00Z',
    submittedBy: 'Ranger Team',
    notes: 'Vegetation survey at the northern boundary. Possible erosion near creek mouth.',
    status: 'rejected',
    validationReasons: [
      'GPS location is outside the registered project area.',
    ],
    submittedAt: '2025-07-25T11:45:00Z',
  },
  // SR-002 — Gulf of Mannar (verified + needs-review)
  {
    id: 'EV-004',
    projectId: 'SR-002',
    photoUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
    latitude: 9.16,
    longitude: 79.32,
    capturedAt: '2025-07-18T08:30:00Z',
    submittedBy: 'Dr. Kavya Nair',
    notes: 'Coral fragment outplanting in sector B showing 85% attachment rate. No bleaching detected.',
    status: 'verified',
    validationReasons: [],
    submittedAt: '2025-07-18T09:00:00Z',
  },
  {
    id: 'EV-005',
    projectId: 'SR-002',
    photoUrl: 'https://images.unsplash.com/photo-1582967788606-a171c7a4e01b?w=400&h=300&fit=crop',
    latitude: 9.14,
    longitude: 79.29,
    capturedAt: '2025-07-21T16:20:00Z',
    submittedBy: 'Diving Team',
    notes: 'Nursery lines 12-18 cleaned of macroalgae. Fragment growth within expected range.',
    status: 'needs-review',
    validationReasons: [
      'Duplicate evidence: similar GPS location and date as EV-004.',
    ],
    submittedAt: '2025-07-21T17:00:00Z',
  },
  // SR-003 — Chilika Lake (needs-review + rejected)
  {
    id: 'EV-006',
    projectId: 'SR-003',
    photoUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop',
    latitude: 19.73,
    longitude: 85.32,
    capturedAt: '2025-07-19T07:45:00Z',
    submittedBy: 'Anil Mishra',
    notes: 'Reed planting progress along western shore. 2,400 saplings planted this week.',
    status: 'verified',
    validationReasons: [],
    submittedAt: '2025-07-19T08:30:00Z',
  },
  {
    id: 'EV-007',
    projectId: 'SR-003',
    photoUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=300&fit=crop',
    latitude: 19.50,
    longitude: 85.10,
    capturedAt: '2025-07-23T13:10:00Z',
    submittedBy: 'Field Crew · Zone 1',
    notes: 'Water quality sampling at southern inlet. Salinity levels concerning.',
    status: 'rejected',
    validationReasons: [
      'GPS location is outside the registered project area.',
    ],
    submittedAt: '2025-07-23T14:00:00Z',
  },
  // SR-004 — Pichavaram (needs-review)
  {
    id: 'EV-008',
    projectId: 'SR-004',
    photoUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    latitude: 11.43,
    longitude: 79.79,
    capturedAt: '2025-07-24T10:00:00Z',
    submittedBy: 'Tamil Selvi',
    notes: 'Bamboo baffle installation at erosion site E-1. Structural integrity confirmed.',
    status: 'needs-review',
    validationReasons: [
      'Required field missing: photo metadata could not be fully validated.',
    ],
    submittedAt: '2025-07-24T10:45:00Z',
  },
  // SR-005 — Mandovi Estuary (verified)
  {
    id: 'EV-009',
    projectId: 'SR-005',
    photoUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    latitude: 15.49,
    longitude: 73.83,
    capturedAt: '2025-07-17T06:30:00Z',
    submittedBy: 'Rohit Naik',
    notes: 'Eddy-covariance tower data log check. CO₂ flux readings consistent with Q2 estimates.',
    status: 'verified',
    validationReasons: [],
    submittedAt: '2025-07-17T07:15:00Z',
  },
  // SR-006 — Kavvayi (verified + needs-review)
  {
    id: 'EV-010',
    projectId: 'SR-006',
    photoUrl: 'https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=400&h=300&fit=crop',
    latitude: 12.06,
    longitude: 75.25,
    capturedAt: '2025-07-20T15:30:00Z',
    submittedBy: 'Lekshmi Pillai',
    notes: 'Seagrass meadow extent survey via drone. North lagoon patch expanding as expected.',
    status: 'verified',
    validationReasons: [],
    submittedAt: '2025-07-20T16:00:00Z',
  },
  {
    id: 'EV-011',
    projectId: 'SR-006',
    photoUrl: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=300&fit=crop',
    latitude: 12.07,
    longitude: 75.26,
    capturedAt: '2025-07-20T15:45:00Z',
    submittedBy: 'Community Volunteer',
    notes: 'Sprig planting event documentation. 80 volunteers participated in north lagoon restoration.',
    status: 'needs-review',
    validationReasons: [
      'Duplicate evidence: similar GPS location and date as EV-010.',
    ],
    submittedAt: '2025-07-20T16:30:00Z',
  },
]
