import { access, readFile } from 'node:fs/promises';

const requiredFiles = [
  'src/pages/index.astro',
  'src/pages/polityka-prywatnosci.astro',
  'src/layouts/Layout.astro',
  'src/styles/global.css',
  'src/data/site.ts',
  'public/site.js',
  'api/contact.js',
];

const failures = [];

for (const path of requiredFiles) {
  try {
    await access(path);
  } catch {
    failures.push(`Brak wymaganego pliku: ${path}`);
  }
}

const index = await readFile('src/pages/index.astro', 'utf8');
const layout = await readFile('src/layouts/Layout.astro', 'utf8');
const siteScript = await readFile('public/site.js', 'utf8');
const source = `${index}\n${layout}\n${siteScript}`;

const forbiddenPatterns = [
  ['Nominatim', /nominatim/i],
  ['stare osadzone mapy iframe', /<iframe/i],
  ['stare pliki wersjonowane CSS', /v[2-9]-(base|sections|contact|responsive|maps|footer)/i],
  ['inline GSAP', /gsap(?:\.min)?\.js|ScrollTrigger/i],
];

for (const [label, pattern] of forbiddenPatterns) {
  if (pattern.test(source)) failures.push(`Wykryto: ${label}`);
}

if (!layout.includes('application/ld+json')) failures.push('Brak danych strukturalnych JSON-LD.');
if (!layout.includes('rel="canonical"')) failures.push('Brak adresu canonical.');
if (!siteScript.includes("aria-expanded")) failures.push('Brak obsługi aria-expanded w interakcjach.');
if (!siteScript.includes("/api/contact")) failures.push('Formularz nie korzysta z endpointu /api/contact.');

if (failures.length) {
  console.error('\nWalidacja projektu nie powiodła się:\n');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Walidacja struktury projektu zakończona powodzeniem.');
