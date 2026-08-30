/* Regenerates js/data.js from data/*.json.
   data/*.json is the source of truth. js/data.js is a snapshot used only when
   the site is opened directly from disk (file://), where fetch() is blocked.
   Run after editing any JSON:   node tools/build-data.js                     */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const dir  = path.join(root, 'data');
const out  = {};
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json'))) {
  out[f.replace('.json','')] = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
}
fs.writeFileSync(path.join(root, 'js', 'data.js'),
  '/* AUTO-GENERATED from data/*.json by tools/build-data.js — do not edit by hand.\n' +
  '   Offline snapshot so the site also works when opened via file://          */\n' +
  'window.APEX_DATA = ' + JSON.stringify(out, null, 2) + ';\n');
console.log('js/data.js rebuilt from', Object.keys(out).join(', '));
