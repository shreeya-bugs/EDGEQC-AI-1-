import type { WalkthroughGuide } from '../types';


export const walkthroughGuides: Record<string, WalkthroughGuide> = {
  surface_scratch: {
    defectId: 'surface_scratch',
    defectName: 'Surface Scratch Defect',
    steps: [
      {
        stepNumber: 1,
        title: 'Locate Conveyor Roller Assembly',
        description: 'Inspect the primary transport conveyor bed on Line 2. Scratches occur when friction exceeds micro-tolerances.',
        targetComponent: 'Conveyor Roller Assembly',
        zoomLevel: 1,
        highlightCoordinates: { x: 25, y: 35, width: 50, height: 30 },
        actionLabel: 'Inspect Roller System',
        interactiveType: 'inspect',
        expectedOutcome: 'Roller section identified on Line 2.'
      },
      {
        stepNumber: 2,
        title: 'Zoom into Worn Stainless Roller #3',
        description: 'Micro-scratches are caused by a worn ceramic bearing and metallic debris buildup on Roller #3.',
        targetComponent: 'Roller #3 Bearing Zone',
        zoomLevel: 2.2,
        highlightCoordinates: { x: 42, y: 40, width: 22, height: 22 },
        actionLabel: 'Identify Wear & Debris',
        interactiveType: 'inspect',
        expectedOutcome: 'Surface friction spot isolated.'
      },
      {
        stepNumber: 3,
        title: 'Execute Bearing Replacement & Polishing',
        description: 'Unbolt tension flange, swap ceramic bearing sleeve, and apply ISO 68 anti-static lubricant.',
        targetComponent: 'Tension Flange & Bearing Sleeve',
        zoomLevel: 2.8,
        highlightCoordinates: { x: 45, y: 42, width: 16, height: 16 },
        actionLabel: 'Perform Part Swap',
        interactiveType: 'replace',
        expectedOutcome: 'New bearing fitted with smooth rotation.'
      },
      {
        stepNumber: 4,
        title: 'Verify Pass Clearance & Surface Inspection',
        description: 'Run 10 sample test packages through the live optical camera feed to confirm zero scratch defects.',
        targetComponent: 'Optical Camera Verification',
        zoomLevel: 1,
        highlightCoordinates: { x: 10, y: 10, width: 80, height: 80 },
        actionLabel: 'Confirm 100% Quality Pass',
        interactiveType: 'verify',
        expectedOutcome: 'Surface scratch rate dropped to 0.00%!'
      }
    ]
  },
  misalignment: {
    defectId: 'misalignment',
    defectName: 'Package Misalignment',
    steps: [
      {
        stepNumber: 1,
        title: 'Locate Feed Guide Rail & Optical Gate',
        description: 'Misalignment is detected when product skew exceeds +/- 1.5mm relative to sensor baseline.',
        targetComponent: 'Lateral Guide Rail',
        zoomLevel: 1,
        highlightCoordinates: { x: 15, y: 20, width: 70, height: 45 },
        actionLabel: 'Check Guide Rail Position',
        interactiveType: 'inspect',
        expectedOutcome: 'Guide rail skew isolated.'
      },
      {
        stepNumber: 2,
        title: 'Zoom into Pneumatic Positioning Bolt',
        description: 'Left clamp pneumatic bolt loosened by 3.2mm under high throughput vibration.',
        targetComponent: 'Pneumatic Clamp Bolt',
        zoomLevel: 2.4,
        highlightCoordinates: { x: 30, y: 35, width: 20, height: 20 },
        actionLabel: 'Measure Offset Distance',
        interactiveType: 'tool',
        expectedOutcome: '3.2mm clearance drift measured.'
      },
      {
        stepNumber: 3,
        title: 'Calibrate Laser Alignment & Torque Lock',
        description: 'Align laser reference beam to 0.00mm mark and torque clamp bolts to 18 Nm.',
        targetComponent: 'Laser Calibration Sensor',
        zoomLevel: 3,
        highlightCoordinates: { x: 32, y: 36, width: 18, height: 18 },
        actionLabel: 'Torque & Lock Rail',
        interactiveType: 'replace',
        expectedOutcome: 'Guide rail calibrated precisely.'
      },
      {
        stepNumber: 4,
        title: 'Run Alignment Test Sample',
        description: 'Verify high-speed feed alignment with automated camera detection PASS status.',
        targetComponent: 'Camera Feed Check',
        zoomLevel: 1,
        highlightCoordinates: { x: 10, y: 10, width: 80, height: 80 },
        actionLabel: 'Complete Calibration',
        interactiveType: 'verify',
        expectedOutcome: '100% Alignment verified!'
      }
    ]
  },
  smudge: {
    defectId: 'smudge',
    defectName: 'Print Smudge & Ink Bleed',
    steps: [
      {
        stepNumber: 1,
        title: 'Locate Thermal Inkjet Printhead Array',
        description: 'Ink smudging occurs when nozzle pressure drops below 2.1 bar or encoder speed fluctuates.',
        targetComponent: 'Printhead Assembly',
        zoomLevel: 1,
        highlightCoordinates: { x: 35, y: 15, width: 35, height: 50 },
        actionLabel: 'Inspect Print Matrix',
        interactiveType: 'inspect',
        expectedOutcome: 'Printhead array active.'
      },
      {
        stepNumber: 2,
        title: 'Zoom into Micro-Nozzle Cluster #4',
        description: 'Clogged micro-nozzle #4 causing excess solvent buildup and ink droplet smearing.',
        targetComponent: 'Nozzle Cluster #4',
        zoomLevel: 2.6,
        highlightCoordinates: { x: 45, y: 30, width: 15, height: 15 },
        actionLabel: 'Detect Ink Buildup',
        interactiveType: 'inspect',
        expectedOutcome: 'Solvent buildup identified.'
      },
      {
        stepNumber: 3,
        title: 'Initiate Automated Solvent Purge & Wiper',
        description: 'Trigger high-pressure solvent flush sequence and clean silicone wiper blade.',
        targetComponent: 'Solvent Purge Valve',
        zoomLevel: 2.8,
        highlightCoordinates: { x: 46, y: 32, width: 14, height: 14 },
        actionLabel: 'Execute Purge Cycle',
        interactiveType: 'tool',
        expectedOutcome: 'Purge complete. Nozzles clear.'
      },
      {
        stepNumber: 4,
        title: 'Verify Barcode & OCR Clarity',
        description: 'Scan sample barcode and inspect print sharpness score (Target > 98%).',
        targetComponent: 'OCR Verification Sensor',
        zoomLevel: 1,
        highlightCoordinates: { x: 10, y: 10, width: 80, height: 80 },
        actionLabel: 'Verify Print Grade A',
        interactiveType: 'verify',
        expectedOutcome: 'Grade A print output confirmed!'
      }
    ]
  }
};
