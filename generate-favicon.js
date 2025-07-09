const { createCanvas } = require('canvas');
const fs = require('fs');

// Create a 32x32 canvas
const canvas = createCanvas(32, 32);
const ctx = canvas.getContext('2d');

// Fill with transparent background
ctx.clearRect(0, 0, 32, 32);

// Draw light gray circle
ctx.fillStyle = '#D3D3D3';
ctx.beginPath();
ctx.arc(16, 16, 16, 0, 2 * Math.PI);
ctx.fill();

// Convert to PNG buffer
const buffer = canvas.toBuffer('image/png');

// Write to favicon.ico (PNG format works as favicon in modern browsers)
fs.writeFileSync('public/favicon.ico', buffer);

console.log('Favicon created at public/favicon.ico');
console.log('The favicon is a light gray circle in PNG format.'); 