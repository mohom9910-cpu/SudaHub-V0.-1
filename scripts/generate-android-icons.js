import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const baseResDir = path.join(process.cwd(), 'android/app/src/main/res');

const densities = [
  { folder: 'mipmap-mdpi', size: 48 },
  { folder: 'mipmap-hdpi', size: 72 },
  { folder: 'mipmap-xhdpi', size: 96 },
  { folder: 'mipmap-xxhdpi', size: 144 },
  { folder: 'mipmap-xxxhdpi', size: 192 }
];

const iconPath = path.join(process.cwd(), 'public/icon-512.png');
const maskablePath = path.join(process.cwd(), 'public/icon-maskable-512.png');

async function generateAndroidIcons() {
  for (const { folder, size } of densities) {
    const targetDir = path.join(baseResDir, folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    await sharp(iconPath)
      .resize(size, size)
      .png()
      .toFile(path.join(targetDir, 'ic_launcher.png'));

    await sharp(maskablePath)
      .resize(size, size)
      .png()
      .toFile(path.join(targetDir, 'ic_launcher_round.png'));
  }
  console.log('Android mipmap icons created!');
}

generateAndroidIcons().catch(console.error);
