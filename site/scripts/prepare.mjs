import { readdirSync } from 'node:fs';

// The retired registry's data, examples and app assets must stay out of the export.
const files = readdirSync(new URL('../public/', import.meta.url));
if (files.length !== 1 || files[0] !== 'favicon.svg') {
  throw new Error('The redirect public directory must contain only favicon.svg');
}
