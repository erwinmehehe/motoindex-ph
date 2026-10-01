const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function waitForChromeDebug({
  port,
  timeoutMs = 45_000,
  intervalMs = 250,
  probe = async () => {
    try { return (await fetch(`http://127.0.0.1:${port}/json/version`)).ok; }
    catch { return false; }
  },
  isExited = () => false,
  stderr = () => ""
}) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (isExited()) throw new Error(`Chrome exited before remote debugging was ready.\n${stderr()}`.trim());
    if (await probe()) return;
    await pause(intervalMs);
  }
  throw new Error(`Chrome remote debugging did not become ready within ${timeoutMs}ms.\n${stderr()}`.trim());
}
