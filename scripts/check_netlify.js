const https = require('https');
https.get('https://phonebook-kolar-chintamani.netlify.app', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    console.log('Has Suggest Contact:', data.includes('Suggest Contact'));
    console.log('Has Add Contact:', data.includes('Add Contact'));
    console.log('Has Verified in tagline:', data.includes('Verified local plumbers'));
    console.log('Length:', data.length);
  });
}).on('error', err => console.error(err));
