/** Prevent spreadsheet formula execution in exported, user-supplied values. */
export function safeCsvCell(value: unknown) {
  const raw = value === null || value === undefined ? "" : String(value);
  const text = /^[\s\u0000-\u001f]*[=+\-@]/u.test(raw) ? "'" + raw : raw;
  return '"' + text.replace(/"/g, '""') + '"';
}
