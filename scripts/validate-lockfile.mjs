import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const pkg = readJson('package.json');
const lock = readJson('package-lock.json');
const failures = [];

if (lock.lockfileVersion !== 3) failures.push(`Expected npm lockfileVersion 3, found ${lock.lockfileVersion}.`);
if (lock.name !== pkg.name) failures.push(`Lockfile name ${lock.name} does not match package.json ${pkg.name}.`);
if (lock.version !== pkg.version) failures.push(`Lockfile version ${lock.version} does not match package.json ${pkg.version}.`);

const rootRecord = lock.packages?.[''];
if (!rootRecord) failures.push('package-lock.json is missing the root package record.');

for (const section of ['dependencies', 'devDependencies']) {
  const expected = pkg[section] || {};
  const actual = rootRecord?.[section] || {};
  const normalize = (obj) => Object.fromEntries(Object.entries(obj).sort(([a],[b]) => a.localeCompare(b)));
  if (JSON.stringify(normalize(expected)) !== JSON.stringify(normalize(actual))) failures.push(`Root ${section} in package-lock.json does not exactly match package.json.`);
  for (const [name, version] of Object.entries(expected)) {
    const record = lock.packages?.[`node_modules/${name}`];
    if (!record) failures.push(`Missing lockfile package record for ${name}.`);
    else if (record.version !== version) failures.push(`${name} resolves to ${record.version}; expected exact ${version}.`);
  }
}

for (const [location, record] of Object.entries(lock.packages || {})) {
  if (!location) continue;
  if (!record.version) failures.push(`${location} is missing version metadata.`);

  // npm lockfile v3 intentionally omits resolved/integrity for dependencies that
  // are physically bundled inside another package tarball. Those entries are
  // identified with inBundle:true and are still covered by the parent tarball's SRI.
  const requiresOwnTarballMetadata = !record.link && !record.inBundle;
  if (requiresOwnTarballMetadata && !record.resolved) failures.push(`${location} is missing a resolved tarball URL.`);
  if (requiresOwnTarballMetadata && !record.integrity) failures.push(`${location} is missing an integrity hash.`);
}

const nextVersion = pkg.dependencies?.next;
const nextRecord = lock.packages?.['node_modules/next'];
const envRecord = lock.packages?.['node_modules/@next/env'];
if (!nextVersion || !nextRecord) failures.push('Next.js package record is missing.');
if (nextRecord && nextRecord.version !== nextVersion) failures.push(`Next.js lock record ${nextRecord.version} does not match package.json ${nextVersion}.`);
if (envRecord && envRecord.version !== nextVersion) failures.push(`@next/env ${envRecord.version} does not match Next.js ${nextVersion}.`);

const swcRecords = Object.entries(lock.packages || {}).filter(([location]) => location.startsWith('node_modules/@next/swc-'));
if (swcRecords.length < 8) failures.push(`Expected at least 8 @next/swc-* native package records, found ${swcRecords.length}.`);
for (const [location, record] of swcRecords) {
  if (record.version !== nextVersion) failures.push(`${location} is ${record.version}; must match Next.js ${nextVersion}.`);
}
for (const [name, version] of Object.entries(nextRecord?.optionalDependencies || {}).filter(([name]) => name.startsWith('@next/swc-'))) {
  if (version !== nextVersion) failures.push(`next optionalDependency ${name} is ${version}; must match Next.js ${nextVersion}.`);
}

if (failures.length) {
  console.error('Lockfile validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  console.error('Run npm run refresh:security-lock in a networked environment, then commit the npm-generated package-lock.json.');
  process.exit(1);
}

console.log(`Lockfile validation passed: npm v${lock.lockfileVersion}, ${Object.keys(lock.packages).length - 1} dependency records, strict SRI present for non-bundled packages, Next/@next/env/SWC all ${nextVersion}.`);
