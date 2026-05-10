const baseProps = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }
const I = ({ children }) => <svg {...baseProps}>{children}</svg>
export const DashboardIcon = () => <I><rect x="3" y="3" width="8" height="8" /><rect x="13" y="3" width="8" height="5" /><rect x="13" y="10" width="8" height="11" /><rect x="3" y="13" width="8" height="8" /></I>
export const AlertIcon = () => <I><path d="M12 3 2 20h20L12 3z" /><path d="M12 9v5" /><path d="M12 17h.01" /></I>
export const IncidentIcon = () => <I><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M8 13h8" /><path d="M8 17h5" /></I>
export const CheckInIcon = () => <I><path d="M20 6 9 17l-5-5" /></I>
export const ResourceIcon = () => <I><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></I>
export const RouteIcon = () => <I><circle cx="6" cy="19" r="3" /><path d="M9 19h6" /><path d="M18 5h0" /><path d="M15 19a4 4 0 1 0 4-4" /></I>
export const DrillIcon = () => <I><path d="M14 13a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v5h4z" /><path d="m14 6 5 5" /><path d="M3 21h18" /><path d="M11 6h.01" /></I>
export const AdminIcon = () => <I><circle cx="12" cy="8" r="4" /><path d="M6 20a6 6 0 0 1 12 0" /></I>
export const SettingsIcon = () => <I><circle cx="12" cy="12" r="3" /><path d="M19 12h2M3 12h2M12 3v2M12 19v2M18.4 5.6l-1.4 1.4M7 17l-1.4 1.4M5.6 5.6 7 7M17 17l1.4 1.4" /></I>
export const MenuIcon = () => <I><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></I>
