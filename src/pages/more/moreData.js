export const CAT_ICONS = { medical: 'Medical', fire: 'Fire', equipment: 'Equipment', supplies: 'Supplies' }
export const CAT_ORDER = ['medical', 'fire', 'equipment', 'supplies']
export const HAZARD_ICONS = { earthquake: 'EQ', fire: 'FR', flood: 'FL', typhoon: 'TY' }

export const CONTACT_SECTIONS = [
  { title: 'Primary Emergency', items: [
    { icon: 'EM', bg: '#fee2e2', name: 'Emergency Hotline', sub: 'National Emergency', tel: '911' },
    { icon: 'FS', bg: '#fef9c3', name: 'Bureau of Fire Protection', sub: 'BFP Emergency', tel: '117' },
    { icon: 'PN', bg: '#dbeafe', name: 'PNP Camp Crame', sub: 'Camp Crame, QC', tel: '+6327226366' },
  ]},
  { title: 'DRRM Agencies', items: [
    { icon: 'ND', bg: '#dcfce7', name: 'NDRRMC Operations', sub: 'National DRRM Council', tel: '+6328911406' },
    { icon: 'PG', bg: '#e0f2fe', name: 'PAGASA Forecast', sub: 'Weather Bureau', tel: '+6328284480' },
    { icon: 'QC', bg: '#fef9c3', name: 'QC DRRMO', sub: 'Quezon City DRRM Office', tel: '+6328892860' },
  ]},
  { title: 'School Contacts', items: [
    { icon: 'SC', bg: '#f0f6ff', name: 'CCES Main Office', sub: '(02) 7754-2648', tel: '+6277542648' },
    { icon: 'HP', bg: '#f0f6ff', name: 'Camp Crame Station Hospital', sub: 'Nearest hospital · ~0.3km', tel: '+6327227801' },
  ]},
]

export const MORE_MENU_ITEMS = (isAdmin) => [
  { id: 'evacuation', icon: '', label: 'Evacuation Routes', sub: 'Routes per hazard type' },
  { id: 'resources', icon: '', label: 'Resource Inventory', sub: 'Emergency supplies' },
  { id: 'contacts', icon: '', label: 'Emergency Contacts', sub: 'One-tap call' },
  { id: 'drills', icon: '', label: 'Drill History', sub: 'Past drill records' },
  { id: 'admin', icon: '', label: 'Admin Panel', sub: isAdmin ? 'Logged in' : 'Coordinator only' },
  { id: 'about', icon: '', label: 'About', sub: 'App info & contacts' },
]
