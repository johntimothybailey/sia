import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function (prompt, vars) {
    // We ignore the prompt for this static reference test.
    const filePath = path.resolve(__dirname, '../hook-ascender/references/basic/after-component.tsx');
    const content = fs.readFileSync(filePath, 'utf8');

    return {
        output: content
    };
};
