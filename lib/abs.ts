export function hasConfirmedAbs(value: string) {
  const normalized = value.toLowerCase();
  if (!/\babs\b/.test(normalized)) return false;
  return !/no abs|without abs|not confirmed|not stated|not listed|does not list abs|conflict.{0,20}abs|confirm exact.{0,30}abs|abs equipment is not confirmed/.test(normalized);
}
