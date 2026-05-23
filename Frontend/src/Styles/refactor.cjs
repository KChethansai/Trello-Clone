const fs = require('fs');
const path = require('path');

const commonJsPath = path.join(__dirname, 'c:', 'College Work', 'ATP', 'Temp', 'frontend', 'src', 'Styles', 'common.js');
// Better way to do path to avoid issues:
const targetFile = 'C:\\\\College Work\\\\ATP\\\\Temp\\\\frontend\\\\src\\\\Styles\\\\common.js';

let content = fs.readFileSync(targetFile, 'utf8');

const hexMapping = {};

// We will find all hex colors in the file, and create an auto-generated variable for each
const regex = /#([a-fA-F0-9]{3,6})/g;
const matches = [...content.matchAll(regex)];

const uniqueHexes = [...new Set(matches.map(m => m[0].toLowerCase()))];

let i = 1;
uniqueHexes.forEach(hex => {
    // Generate a readable name for some known hexes
    let name = 'color' + String(i++).padStart(2, '0');
    switch(hex) {
        case '#0055b3': name = 'primary-hover'; break;
        case '#0066cc': name = 'primary'; break;
        case '#0e2a1d': name = 'board-bg-3'; break;
        case '#101204': name = 'board-bg-2'; break;
        case '#102033': name = 'dash-nav-bg'; break;
        case '#1d1d1f': name = 'text-main'; break;
        case '#1d2125': name = 'dash-bg'; break;
        case '#22272b': name = 'dash-nav-hover'; break;
        case '#2c333a': name = 'dash-card-bg'; break;
        case '#32230d': name = 'board-bg-1'; break;
        case '#323940': name = 'dash-card-hover'; break;
        case '#353d47': name = 'dash-btn-hover'; break;
        case '#38bdf8': name = 'status-in-progress'; break;
        case '#454f59': name = 'dash-text-btn'; break;
        case '#579dff': name = 'dash-accent'; break;
        case '#6e6e73': name = 'text-muted'; break;
        case '#6ee7b7': name = 'status-done'; break;
        case '#85b8ff': name = 'dash-accent-hover'; break;
        case '#9fadbc': name = 'dash-text-dark'; break;
        case '#a1a1a6': name = 'text-light'; break;
        case '#b6c2cf': name = 'dash-text-main'; break;
        case '#d2d2d7': name = 'border-main'; break;
        case '#e5e5ea': name = 'border-light'; break;
        case '#ebebf0': name = 'bg-card-hover'; break;
        case '#f2f2f7': name = 'border-lighter'; break;
        case '#f5f5f7': name = 'bg-card'; break;
        case '#f9f9f9': name = 'bg-alt'; break;
        case '#fcd34d': name = 'status-todo'; break;
        case '#ffffff': name = 'bg-white'; break;
    }
    hexMapping[hex] = `--${name}`;
});

let colorsObjStr = `export const themeColors = {\n`;
for (const hex of uniqueHexes) {
    const keyName = hexMapping[hex].replace('--', '');
    colorsObjStr += `  '${keyName}': '${hex}',\n`;
}
colorsObjStr += `};\n\n`;

colorsObjStr += `if (typeof document !== 'undefined') {\n`;
colorsObjStr += `  const style = document.createElement('style');\n`;
colorsObjStr += `  style.innerHTML = \\\`\n    :root {\n`;
for (const hex of uniqueHexes) {
    const keyName = hexMapping[hex].replace('--', '');
    colorsObjStr += `      ${hexMapping[hex]}: \\\${themeColors['${keyName}']};\n`;
}
colorsObjStr += `    }\n  \\\`;\n`;
colorsObjStr += `  document.head.appendChild(style);\n`;
colorsObjStr += `}\n\n`;

for (const hex of uniqueHexes) {
    // Escape hex for regex, replace globally
    // We want to replace exactly the hex string, but they are inside brackets: text-[#1d1d1f]
    // Wait, some might just be #ffffff. The format is typically class="... bg-[#ffffff] ...".
    // We can just replace the literal hex using String.prototype.replaceAll
    content = content.replaceAll(hex, `var(${hexMapping[hex]})`);
    content = content.replaceAll(hex.toUpperCase(), `var(${hexMapping[hex]})`);
}

const finalContent = colorsObjStr + content;
fs.writeFileSync(targetFile, finalContent, 'utf8');
console.log('Done refactoring common.js');
