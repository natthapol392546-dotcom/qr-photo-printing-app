// Grid templates for Combining Photos mode
// Each template defines the grid CSS and cell positions

export const gridTemplates = {
  'single': {
    name: 'Single',
    description: '1 Photo',
    cellCount: 1,
    gridStyle: {
      gridTemplateColumns: '1fr',
      gridTemplateRows: '1fr',
    },
    cells: [
      { gridColumn: '1', gridRow: '1' }
    ]
  },
  'double-horizontal': {
    name: 'Double H',
    description: '2 Photos',
    cellCount: 2,
    gridStyle: {
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr',
      gap: '4px'
    },
    cells: [
      { gridColumn: '1', gridRow: '1' },
      { gridColumn: '2', gridRow: '1' }
    ]
  },
  'double-vertical': {
    name: 'Double V',
    description: '2 Photos',
    cellCount: 2,
    gridStyle: {
      gridTemplateColumns: '1fr',
      gridTemplateRows: '1fr 1fr',
      gap: '4px'
    },
    cells: [
      { gridColumn: '1', gridRow: '1' },
      { gridColumn: '1', gridRow: '2' }
    ]
  },
  'triple': {
    name: 'Triple',
    description: '3 Photos',
    cellCount: 3,
    gridStyle: {
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
      gap: '4px'
    },
    cells: [
      { gridColumn: '1 / 3', gridRow: '1' },
      { gridColumn: '1', gridRow: '2' },
      { gridColumn: '2', gridRow: '2' }
    ]
  },
  'quad': {
    name: 'Quad',
    description: '4 Photos',
    cellCount: 4,
    gridStyle: {
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
      gap: '4px'
    },
    cells: [
      { gridColumn: '1', gridRow: '1' },
      { gridColumn: '2', gridRow: '1' },
      { gridColumn: '1', gridRow: '2' },
      { gridColumn: '2', gridRow: '2' }
    ]
  },
  'column': {
    name: 'Column',
    description: '3 Photos',
    cellCount: 3,
    gridStyle: {
      gridTemplateColumns: '1fr',
      gridTemplateRows: '1fr 1fr 1fr',
      gap: '4px'
    },
    cells: [
      { gridColumn: '1', gridRow: '1' },
      { gridColumn: '1', gridRow: '2' },
      { gridColumn: '1', gridRow: '3' }
    ]
  }
};

export function getGridTemplate(key) {
  return gridTemplates[key] || gridTemplates['single'];
}
