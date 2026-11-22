const fs = require('fs');

function checkScript(file) {
  const html = fs.readFileSync(file, 'utf8');
  const m = html.match(/<script type="module">([\s\S]*?)<\/script>/);
  if (!m) throw new Error('No script in ' + file);
  const code = m[1].replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '// import');
  new Function(code);
  console.log('✓ Syntax valid for:', file);
}

checkScript('index.html');
checkScript('admin.html');
