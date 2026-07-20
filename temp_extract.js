const fs = require('fs');
const zlib = require('zlib');

const path = 'D:/Cuong/Project/unesco_hackathon_app/UNESCO_Requirement.pdf';
const data = fs.readFileSync(path);
const content = data.toString('binary');

const regex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
let match;
while ((match = regex.exec(content)) !== null) {
    const stream = Buffer.from(match[1], 'binary');
    try {
        const decompressed = zlib.inflateSync(stream);
        process.stdout.write(decompressed.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' '));
    } catch (e) {
        // Not a zlib stream or other error
    }
}
