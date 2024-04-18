import { copyFile } from 'node:fs/promises';

await copyFile('../../LICENSE', './LICENSE');
await copyFile('../../README.md', './README.md');
