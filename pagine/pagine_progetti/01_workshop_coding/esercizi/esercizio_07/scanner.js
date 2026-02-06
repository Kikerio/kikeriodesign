const fs = require('fs');
const path = require('path');
const os = require('os');

// Percorsi comuni dei font su Mac
const paths = [
    path.join(os.homedir(), 'Library/Fonts'),
    '/Library/Fonts'
];

let allFonts = [];

paths.forEach(dir => {
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            if (file.endsWith('.ttf') || file.endsWith('.otf')) {
                const stats = fs.statSync(path.join(dir, file));
                allFonts.push({
                    name: file.replace(/\.(ttf|otf)$/i, '').toUpperCase(),
                    // Usiamo il tempo di accesso (atime) come indicatore di utilizzo
                    usageWeight: stats.atimeMs, 
                    size: stats.size
                });
            }
        });
    }
});

// Ordiniamo per i più usati/recenti e prendiamo i primi 60
allFonts.sort((a, b) => b.usageWeight - a.usageWeight);
const topFonts = allFonts.slice(0, 60);

const fontData = {
    hostname: "FONT SPECIMEN",
    platform: os.platform(),
    totalFonts: allFonts.length,
    files: topFonts
};

fs.writeFileSync('data.json', JSON.stringify(fontData, null, 2));
console.log(`✅ Scanner completato: ${allFonts.length} font trovati.`);