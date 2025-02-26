const yaml = require('js-yaml');
const fs   = require('fs');

// Get document, or throw exception on error
try {
  const doc = yaml.load(fs.readFileSync('./ad_types.yaml', 'utf8'));
  console.log(doc);
  fs.writeFileSync('../src/lib/ad-types.json', JSON.stringify(doc.ad_types, null, 2));
} catch (e) {
  console.log(e);
}