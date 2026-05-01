import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceArg = process.argv[2];
if (!workspaceArg) {
  console.log('[project-color] No workspace folder provided.');
  process.exit(0);
}

const workspaceFolder = path.resolve(workspaceArg);
if (!fs.existsSync(workspaceFolder)) {
  console.log(`[project-color] Workspace not found: ${workspaceFolder}`);
  process.exit(0);
}

const projectName = path.basename(workspaceFolder);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const settingsPath = path.resolve(scriptDir, '..', 'settings.json');

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function hslToHex(h, s, l) {
  const sat = s / 100;
  const light = l / 100;
  const c = (1 - Math.abs((2 * light) - 1)) * sat;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = light - (c / 2);

  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  const toHex = (value) => {
    const v = Math.round((value + m) * 255);
    return v.toString(16).padStart(2, '0');
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function withAlpha(hex, alphaHex) {
  return `${hex}${alphaHex}`;
}

const hash = hashString(workspaceFolder);

// Strict Antigravity Palette (Hues guaranteed to be visually distinct)
// Blues, Purples, Cyans, Magentas, Teals, Greens, Reds, Oranges, etc.
const ANTIGRAVITY_HUES = [
  210, // Azure/Neon Blue
  260, // Deep Purple
  320, // Hot Magenta
  160, // Emerald Green
  190, // Cyan/Aqua
  280, // Violet
  345, // Crimson Red
  230, // Royal Blue
  175, // Sea Teal
  295, // Fuschia
  15,  // Burnt Orange
  35,  // Deep Amber
  140, // Forest Green
  330  // Pink Rose
];

const hue = ANTIGRAVITY_HUES[hash % ANTIGRAVITY_HUES.length];
const saturation = 55 + (hash % 10);
const activeLightness = 12 + ((hash % 3) * 2); 

const title = hslToHex(hue, saturation, activeLightness);
const titleFg = '#f8fafc';
const titleFgInactive = '#64748b';

let settings = {};
if (fs.existsSync(settingsPath)) {
  try {
    settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  } catch (e) {}
}

const customizations = settings['workbench.colorCustomizations'] || {};
// Purge previous keys to ensure a clean theme
delete customizations['statusBar.background'];
delete customizations['statusBar.foreground'];
delete customizations['activityBar.background'];
delete customizations['activityBar.activeBorder'];
delete customizations['activityBar.foreground'];
delete customizations['sideBar.border'];

settings['workbench.colorCustomizations'] = {
  ...customizations,
  'titleBar.activeBackground': title,
  'titleBar.activeForeground': titleFg,
  'titleBar.inactiveBackground': hslToHex(hue, 15, 10), // Even darker for inactive
  'titleBar.inactiveForeground': titleFgInactive
};

fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
console.log(`[antigravity-tones] Applied Vivid Dark tonality for ${projectName}.`);
