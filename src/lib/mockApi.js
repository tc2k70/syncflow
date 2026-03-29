import { LOOKUP_DATA } from './lookupData';

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// Step 3: Validate imported data rows
export async function validateData(rows) {
  await delay(1200);
  const errors = [];
  const warnings = [];

  rows.forEach((row, idx) => {
    const rowNum = idx + 1;

    if (!row.circuitName || row.circuitName.trim() === '') {
      errors.push({ row: rowNum, field: 'circuitName', message: 'Circuit Name is required' });
    }
    if (!row.lineNumber || row.lineNumber.trim() === '') {
      errors.push({ row: rowNum, field: 'lineNumber', message: 'Line Number is required' });
    }
    if (row.volts && !LOOKUP_DATA.volts.includes(String(row.volts))) {
      errors.push({ row: rowNum, field: 'volts', message: `Invalid voltage "${row.volts}". Must be one of: ${LOOKUP_DATA.volts.join(', ')}` });
    }
    if (row.tempControlType && !LOOKUP_DATA.tempControlType.includes(row.tempControlType)) {
      warnings.push({ row: rowNum, field: 'tempControlType', message: `Unrecognized Temp. Control Type: "${row.tempControlType}"` });
    }
    if (row.maintTemp && isNaN(Number(row.maintTemp))) {
      errors.push({ row: rowNum, field: 'maintTemp', message: 'Maint. Temp. must be a number' });
    }
    if (row.pipeLen && isNaN(Number(row.pipeLen))) {
      errors.push({ row: rowNum, field: 'pipeLen', message: 'Pipe Length must be a number' });
    }
    if (row.heaterStyle && !LOOKUP_DATA.heaterStyle.includes(row.heaterStyle)) {
      warnings.push({ row: rowNum, field: 'heaterStyle', message: `Unrecognized Heater Style: "${row.heaterStyle}"` });
    }
  });

  return { errors, warnings, valid: errors.length === 0 };
}

// Step 4: Get projects from SQL database
export async function fetchProjects() {
  await delay(800);
  return [
    { id: 'PRJ-001', name: 'Refinery Unit 4 - Phase 2', site: 'Houston, TX', status: 'Active', circuitCount: 142, agency: 'NEC', areaType: 'Ordinary / Divisions', owner: 'DTWGMR1\flyty', lastModified: 'Mon, Oct 20 2025', unitSummary: 'Imperial / Imperial / Fahrenheit / Imperial', units: { pipe: 'Imperial', insulation: 'Imperial', temperature: 'Fahrenheit', other: 'Imperial' } },
    { id: 'PRJ-002', name: 'LNG Terminal Expansion', site: 'Sabine Pass, LA', status: 'Active', circuitCount: 87, agency: 'NEC', areaType: 'Ordinary / Divisions', owner: 'DTWGMR1\flyty', lastModified: 'Mon, Oct 15 2025', unitSummary: 'Metric / Metric / Celsius / Metric', units: { pipe: 'Metric', insulation: 'Metric', temperature: 'Celsius', other: 'Metric' } },
    { id: 'PRJ-003', name: 'Petrochemical Plant B', site: 'Beaumont, TX', status: 'In Progress', circuitCount: 215, agency: 'NEC', areaType: 'Hazardous / Zones', owner: 'DTWGMR1\flyty', lastModified: 'Tue, Oct 21 2025', unitSummary: 'Imperial / Imperial / Fahrenheit / Imperial', units: { pipe: 'Imperial', insulation: 'Imperial', temperature: 'Fahrenheit', other: 'Imperial' } },
    { id: 'PRJ-004', name: 'Offshore Platform Delta', site: 'Gulf of Mexico', status: 'Active', circuitCount: 63, agency: 'IEC', areaType: 'Hazardous / Zones', owner: 'DTWGMR1\flyty', lastModified: 'Wed, Oct 22 2025', unitSummary: 'Metric / Metric / Celsius / Metric', units: { pipe: 'Metric', insulation: 'Metric', temperature: 'Celsius', other: 'Metric' } },
    { id: 'PRJ-005', name: 'Gas Processing Facility', site: 'Midland, TX', status: 'Planning', circuitCount: 0, agency: 'NEC', areaType: 'Ordinary / Divisions', owner: 'DTWGMR1\flyty', lastModified: 'Thu, Oct 23 2025', unitSummary: 'Imperial / Imperial / Fahrenheit / Imperial', units: { pipe: 'Imperial', insulation: 'Imperial', temperature: 'Fahrenheit', other: 'Imperial' } },
  ];
}

// Step 5: Pre-merge check for duplicates
export async function preMergeCheck(rows, projectId) {
  await delay(1500);

  // Mock: flag rows whose circuitName starts with same letter as projectId
  const duplicates = [];
  const newRecords = [];

  rows.forEach((row, idx) => {
    const isDuplicate = idx % 4 === 0 && idx !== 0; // mock: every 4th row is a "duplicate"
    if (isDuplicate) {
      duplicates.push({
        row: idx + 1,
        circuitName: row.circuitName,
        lineNumber: row.lineNumber,
        existingId: `CKT-${1000 + idx}`,
        conflictFields: ['pipeLen', 'maintTemp'],
      });
    } else {
      newRecords.push(row);
    }
  });

  return { duplicates, newRecords, totalRows: rows.length };
}

// Step 6: Execute import
export async function executeImport(rows, projectId) {
  await delay(2000);
  return {
    success: true,
    imported: rows.length,
    projectId,
    importId: `IMP-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
}

// Step 7: Fetch merged project data
export async function fetchProjectData(projectId) {
  await delay(1000);
  const circuits = Array.from({ length: 18 }, (_, i) => ({
    id: `CKT-${2000 + i}`,
    circuitName: `HT-${String(i + 1).padStart(3, '0')}`,
    lineNumber: `L-${100 + i * 3}-${String(i + 1).padStart(2, '0')}-XXXX`,
    tempControlType: LOOKUP_DATA.tempControlType[i % LOOKUP_DATA.tempControlType.length],
    maintTemp: 50 + (i * 5),
    volts: LOOKUP_DATA.volts[i % LOOKUP_DATA.volts.length],
    pipeLen: 20 + i * 7,
    heaterFamily: LOOKUP_DATA.heaterFamily[i % LOOKUP_DATA.heaterFamily.length],
    status: i % 5 === 0 ? 'Review' : 'Active',
  }));

  return { projectId, circuits };
}