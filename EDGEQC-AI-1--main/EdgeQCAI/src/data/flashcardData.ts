import type { DefectFlashcardData } from '../types';


export const defectFlashcards: Record<string, DefectFlashcardData> = {
  surface_scratch: {
    id: 'surface_scratch',
    defectType: 'Surface Scratch',
    title: 'Surface Scratch Defect',
    severity: 'high',
    commonCauses: [
      'Machine Roller Misalignment',
      'Ceramic Bearing Wear on Roller #3',
      'Incorrect Conveyor Belt Tension',
      'Abrasive Debris Buildup'
    ],
    recommendedFix: 'Swap ceramic bearing sleeve on Roller #3, clean guide tracks with isopropyl alcohol, and torque flange to 15 Nm.',
    estimatedRepairTime: '15 - 20 Mins',
    estimatedFinancialLoss: 12500,
    preventionTips: [
      'Perform bi-weekly bearing lubrications (ISO 68 grade)',
      'Inspect conveyor roller alignment laser monthly',
      'Clean particulate filters on cooling blower'
    ],
    exampleImages: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80'
    ]
  },
  misalignment: {
    id: 'misalignment',
    defectType: 'Misalignment',
    title: 'Package Feed Misalignment',
    severity: 'critical',
    commonCauses: [
      'Guide Rail Lock Bolt Drift',
      'Pneumatic Feeder Pressure Drop (< 4.2 bar)',
      'High-Speed Conveyor Vibration Drift',
      'Optical Photo-Eye Sensor Offset'
    ],
    recommendedFix: 'Re-zero optical photo-eye sensor, tighten lateral guide rail pneumatic clamp to 18 Nm, and verify laser alignment.',
    estimatedRepairTime: '25 Mins',
    estimatedFinancialLoss: 18400,
    preventionTips: [
      'Calibrate laser photo-eye every shift start',
      'Check pneumatic compressor line regulator pressure daily',
      'Replace anti-vibration rubber dampers quarterly'
    ],
    exampleImages: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80'
    ]
  },
  smudge: {
    id: 'smudge',
    defectType: 'Smudge',
    title: 'Ink Smudge & Bleed',
    severity: 'medium',
    commonCauses: [
      'Clogged Thermal Inkjet Micro-Nozzles',
      'Incorrect Ink Solvent Viscosity Ratio',
      'Encoder Speed Mismatch vs Conveyor Bed',
      'Wiper Blade Contamination'
    ],
    recommendedFix: 'Trigger automated purge cycle, clean silicone wiper blade with lint-free swab, and adjust printhead standoff to 1.8mm.',
    estimatedRepairTime: '10 Mins',
    estimatedFinancialLoss: 6200,
    preventionTips: [
      'Execute automatic printhead purge routine before shift change',
      'Store ink cartridges within 20°C - 25°C temperature range',
      'Replace silicone wiper blade every 500,000 print cycles'
    ],
    exampleImages: [
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=600&q=80'
    ]
  },
  missing_print: {
    id: 'missing_print',
    defectType: 'Missing Print',
    title: 'Missing Print / Barcode Drop',
    severity: 'high',
    commonCauses: [
      'Printhead Data Cable Intermittent Disconnect',
      'Trigger Sensor Optical Obstruction',
      'Empty Ink Supply Cartridge',
      'Rotary Encoder Pulse Signal Loss'
    ],
    recommendedFix: 'Inspect trigger sensor optic window, verify ribbon cable seating, and replace ink reservoir cartridge.',
    estimatedRepairTime: '12 Mins',
    estimatedFinancialLoss: 9800,
    preventionTips: [
      'Clean photo-eye trigger lens twice per shift',
      'Monitor ink telemetry level threshold alert (< 10%)',
      'Verify shaft encoder pulse coupling integrity'
    ],
    exampleImages: [
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80'
    ]
  }
};
