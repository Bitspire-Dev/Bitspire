const fs = require('fs');
const path = require('path');

const manifestPath = path.join(process.cwd(), '.next', 'server', 'functions-config-manifest.json');

if (!fs.existsSync(manifestPath)) {
  process.exit(0);
}

const raw = fs.readFileSync(manifestPath, 'utf8');
let data;
try {
  data = JSON.parse(raw);
} catch (error) {
  console.warn('[postbuild] Unable to parse functions-config-manifest.json');
  process.exit(0);
}

if (!data.functions || !data.functions['/_middleware']) {
  process.exit(0);
}

if (data.functions['/_middleware'].runtime === 'nodejs') {
  data.functions['/_middleware'].runtime = 'edge';
  fs.writeFileSync(manifestPath, JSON.stringify(data, null, 2));
  console.log('[postbuild] Set /_middleware runtime to edge');
}
