import fs from 'fs';
let html = fs.readFileSync('merchant_content.html', 'utf-8');
html = html.replace(/<style[^>]*>.*?<\/style>/gis, '');
html = html.replace(/<script[^>]*>.*?<\/script>/gis, '');
const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
console.log(text.substring(0, 1000));
