import { readdir, stat } from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';

export async function registerEndpoints() {
    console.log("Loading API Endpoints...");
    await recursivelyRegister('./endpoints');
}

async function recursivelyRegister(directory) {
    const files = await readdir(directory);

    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stats = await stat(fullPath);

        if (stats.isDirectory()) {
            console.log(`   » Found Directory (${file}) - Recursively Registering...`);
            await recursivelyRegister(fullPath);
        } else if (file.endsWith('.js')) {
            await import(pathToFileURL(path.resolve(fullPath)).href);
        }
    }
}