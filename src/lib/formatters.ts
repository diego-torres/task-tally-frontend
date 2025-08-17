/** Formatting helpers */

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleString();

export const truncate = (value: string, max = 50): string =>
  (value.length > max ? `${value.slice(0, max)}…` : value);
