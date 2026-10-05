const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();

export const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

export function collectionItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];

  for (const key of ['results', 'items', 'data']) {
    if (Array.isArray(payload[key])) return payload[key];
  }

  return [];
}

export function displayReference(value, label = 'Record') {
  if (value && typeof value === 'object') {
    return value.name || value.username || value.title || `${label} unavailable`;
  }
  if (typeof value === 'string' && value.length > 0) {
    return `${label} ${value.length > 8 ? value.slice(-6) : value}`;
  }
  return 'Not assigned';
}

export function formatDate(value) {
  if (!value) return 'Not recorded';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not recorded';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date);
}