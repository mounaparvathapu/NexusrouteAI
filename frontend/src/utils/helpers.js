/**
 * Format duration in minutes to human-readable string.
 */
export function formatDuration(minutes) {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/**
 * Return Tailwind class string for traffic level.
 */
export function trafficClass(level) {
  switch (level) {
    case 'Low':      return 'traffic-low';
    case 'Moderate': return 'traffic-moderate';
    case 'High':     return 'traffic-high';
    default:         return 'traffic-low';
  }
}

/**
 * OpenWeatherMap icon URL.
 */
export function owmIconUrl(icon) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

/**
 * Return wind direction label from degrees.
 */
export function windDirection(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}
