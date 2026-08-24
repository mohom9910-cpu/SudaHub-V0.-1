import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Regular App Icon SVG (Modern SudaHub emblem with glowing emerald/cyan gradient and Arabic 'س')
const createIconSvg = (size, isMaskable = false) => {
  const padding = isMaskable ? size * 0.15 : size * 0.05;
  const innerSize = size - padding * 2;
  const radius = isMaskable ? 0 : innerSize * 0.22;
  const cx = size / 2;
  const cy = size / 2;

  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F172A" />
        <stop offset="50%" stop-color="#0A0F1D" />
        <stop offset="100%" stop-color="#06121E" />
      </linearGradient>
      <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#10B981" />
        <stop offset="50%" stop-color="#059669" />
        <stop offset="100%" stop-color="#06B6D4" />
      </linearGradient>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#34D399" />
        <stop offset="100%" stop-color="#38BDF8" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="${size * 0.03}" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Background -->
    <rect width="${size}" height="${size}" fill="url(#bgGrad)" />

    <!-- Icon Container Box if not maskable -->
    ${!isMaskable ? `
    <rect x="${padding}" y="${padding}" width="${innerSize}" height="${innerSize}" rx="${radius}" fill="#0D1527" stroke="rgba(16, 185, 129, 0.3)" stroke-width="${size * 0.015}" />
    ` : ''}

    <!-- Background glowing circle -->
    <circle cx="${cx}" cy="${cy}" r="${innerSize * 0.36}" fill="url(#emeraldGrad)" opacity="0.15" filter="url(#glow)" />

    <!-- Outer Tech Hexagon / Circuit Ring -->
    <circle cx="${cx}" cy="${cy}" r="${innerSize * 0.34}" fill="none" stroke="url(#emeraldGrad)" stroke-width="${size * 0.025}" stroke-dasharray="${size * 0.15} ${size * 0.05}" />
    
    <!-- Central Shield / Brand S Symbol -->
    <g transform="translate(${cx}, ${cy})">
      <!-- Glow effect -->
      <path d="M0,${-innerSize * 0.22} C${innerSize * 0.18},${-innerSize * 0.22} ${innerSize * 0.24},${-innerSize * 0.08} ${innerSize * 0.12},0 C${innerSize * 0.25},${innerSize * 0.12} ${innerSize * 0.15},${innerSize * 0.24} 0,${innerSize * 0.24} C${-innerSize * 0.18},${innerSize * 0.24} ${-innerSize * 0.24},${innerSize * 0.08} ${-innerSize * 0.12},0 C${-innerSize * 0.25},${-innerSize * 0.12} ${-innerSize * 0.15},${-innerSize * 0.22} 0,${-innerSize * 0.22} Z" fill="none" stroke="url(#accentGrad)" stroke-width="${size * 0.04}" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)" />

      <!-- Inner Lightning Bolt / Star / SudaHub Sparkle -->
      <polygon points="0,${-innerSize * 0.14} ${innerSize * 0.06},${-innerSize * 0.02} ${innerSize * 0.14},0 ${innerSize * 0.06},${innerSize * 0.02} 0,${innerSize * 0.14} ${-innerSize * 0.06},${innerSize * 0.02} ${-innerSize * 0.14},0 ${-innerSize * 0.06},${-innerSize * 0.02}" fill="url(#emeraldGrad)" />

      <circle cx="0" cy="0" r="${innerSize * 0.045}" fill="#FFFFFF" />
    </g>

    <!-- App Name Label (optional for high-res) -->
    ${size >= 512 ? `
    <text x="${cx}" y="${size - padding - size * 0.05}" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="${size * 0.075}" fill="#10B981" text-anchor="middle" letter-spacing="2">SUDAHUB</text>
    ` : ''}
  </svg>
  `;
};

// Screenshot 1: Mobile (720x1280)
const createMobileScreenshotSvg = () => `
<svg width="720" height="1280" viewBox="0 0 720 1280" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="mBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0A0F1D" />
      <stop offset="100%" stop-color="#050811" />
    </linearGradient>
    <linearGradient id="mCard" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <linearGradient id="mEmerald" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10B981" />
      <stop offset="100%" stop-color="#06B6D4" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="720" height="1280" fill="url(#mBg)" />

  <!-- App Header -->
  <rect x="0" y="0" width="720" height="110" fill="#0D1527" />
  <circle cx="70" cy="55" r="25" fill="#10B981" />
  <text x="110" y="65" fill="#FFFFFF" font-family="sans-serif" font-size="28" font-weight="bold">SudaHub | سوداهب</text>

  <!-- Hero Banner -->
  <rect x="40" y="140" width="640" height="260" rx="24" fill="url(#mCard)" stroke="#10B981" stroke-width="2" />
  <text x="360" y="220" fill="#10B981" font-family="sans-serif" font-size="34" font-weight="bold" text-anchor="middle">الاشتراكات والخدمات الرقمية في السودان</text>
  <text x="360" y="270" fill="#94A3B8" font-family="sans-serif" font-size="20" text-anchor="middle">ChatGPT Plus • Claude Pro • Midjourney • Starlink</text>
  <rect x="230" y="310" width="260" height="60" rx="16" fill="url(#mEmerald)" />
  <text x="360" y="348" fill="#0A0F1D" font-family="sans-serif" font-size="22" font-weight="bold" text-anchor="middle">تصفح الخدمات الآن</text>

  <!-- Services Grid -->
  <rect x="40" y="440" width="305" height="340" rx="20" fill="url(#mCard)" stroke="#334155" />
  <rect x="375" y="440" width="305" height="340" rx="20" fill="url(#mCard)" stroke="#334155" />

  <text x="192" y="520" fill="#FFFFFF" font-family="sans-serif" font-size="26" font-weight="bold" text-anchor="middle">ChatGPT Plus</text>
  <text x="192" y="560" fill="#10B981" font-family="sans-serif" font-size="22" font-weight="bold" text-anchor="middle">تفعيل فوري آمن</text>

  <text x="527" y="520" fill="#FFFFFF" font-family="sans-serif" font-size="26" font-weight="bold" text-anchor="middle">Claude 3.7 Pro</text>
  <text x="527" y="560" fill="#06B6D4" font-family="sans-serif" font-size="22" font-weight="bold" text-anchor="middle">شامل التفكير المتقدم</text>

  <!-- Bottom Services -->
  <rect x="40" y="810" width="640" height="180" rx="20" fill="url(#mCard)" stroke="#334155" />
  <text x="360" y="880" fill="#FFFFFF" font-family="sans-serif" font-size="26" font-weight="bold" text-anchor="middle">خدمات Starlink وسداد الفواتير</text>
  <text x="360" y="930" fill="#10B981" font-family="sans-serif" font-size="20" text-anchor="middle">دعم بنكك • فوري • أوكاش • كاش كارد</text>

  <!-- Navigation Bar -->
  <rect x="0" y="1180" width="720" height="100" fill="#0D1527" />
  <text x="120" y="1240" fill="#94A3B8" font-family="sans-serif" font-size="18" text-anchor="middle">الرئيسية</text>
  <text x="360" y="1240" fill="#10B981" font-family="sans-serif" font-size="18" font-weight="bold" text-anchor="middle">الخدمات</text>
  <text x="600" y="1240" fill="#94A3B8" font-family="sans-serif" font-size="18" text-anchor="middle">تتبع الطلبات</text>
</svg>
`;

// Screenshot 2: Wide / Desktop (1280x720)
const createWideScreenshotSvg = () => `
<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0A0F1D" />
      <stop offset="100%" stop-color="#04070F" />
    </linearGradient>
    <linearGradient id="wEmerald" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10B981" />
      <stop offset="100%" stop-color="#06B6D4" />
    </linearGradient>
  </defs>

  <rect width="1280" height="720" fill="url(#wBg)" />

  <!-- Navbar -->
  <rect x="0" y="0" width="1280" height="80" fill="#0D1527" />
  <circle cx="80" cy="40" r="20" fill="#10B981" />
  <text x="120" y="48" fill="#FFFFFF" font-family="sans-serif" font-size="24" font-weight="bold">SudaHub | منصة الاشتراكات والخدمات الرقمية</text>

  <!-- Hero Content -->
  <text x="640" y="180" fill="#FFFFFF" font-family="sans-serif" font-size="44" font-weight="900" text-anchor="middle">بوابتك لجميع اشتراكات الذكاء الاصطناعي والخدمات العالمية</text>
  <text x="640" y="240" fill="#94A3B8" font-family="sans-serif" font-size="22" text-anchor="middle">دفع سلس عبر بنكك، تفعيل فوري ومضمون 100% مع دعم فني مستمر</text>

  <!-- 3 Service Cards -->
  <rect x="100" y="320" width="320" height="280" rx="20" fill="#1E293B" stroke="#10B981" stroke-width="1.5" />
  <text x="260" y="390" fill="#FFFFFF" font-family="sans-serif" font-size="26" font-weight="bold" text-anchor="middle">ChatGPT Plus &amp; Pro</text>
  <text x="260" y="440" fill="#10B981" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">تفعيل فوري بالحساب</text>

  <rect x="480" y="320" width="320" height="280" rx="20" fill="#1E293B" stroke="#06B6D4" stroke-width="1.5" />
  <text x="640" y="390" fill="#FFFFFF" font-family="sans-serif" font-size="26" font-weight="bold" text-anchor="middle">Starlink &amp; Internet</text>
  <text x="640" y="440" fill="#06B6D4" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">سداد الباقات والتجديد</text>

  <rect x="860" y="320" width="320" height="280" rx="20" fill="#1E293B" stroke="#8B5CF6" stroke-width="1.5" />
  <text x="1020" y="390" fill="#FFFFFF" font-family="sans-serif" font-size="26" font-weight="bold" text-anchor="middle">Claude Pro &amp; Coding</text>
  <text x="1020" y="440" fill="#A78BFA" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">أحدث النماذج الذكية</text>
</svg>
`;

async function generateAll() {
  console.log('Generating PWA Icons and Images...');

  // 1. Vector SVG Favicon
  const svgContent = createIconSvg(512);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent);

  // 2. Standard 192x192 PNG
  await sharp(Buffer.from(createIconSvg(192)))
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));

  // 3. Standard 512x512 PNG
  await sharp(Buffer.from(createIconSvg(512)))
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));

  // 4. Maskable 192x192 PNG
  await sharp(Buffer.from(createIconSvg(192, true)))
    .png()
    .toFile(path.join(publicDir, 'icon-maskable-192.png'));

  // 5. Maskable 512x512 PNG
  await sharp(Buffer.from(createIconSvg(512, true)))
    .png()
    .toFile(path.join(publicDir, 'icon-maskable-512.png'));

  // 6. Apple Touch Icon 180x180 PNG
  await sharp(Buffer.from(createIconSvg(180)))
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // 7. Favicon 64x64 PNG & 32x32
  await sharp(Buffer.from(createIconSvg(64)))
    .png()
    .toFile(path.join(publicDir, 'favicon-64.png'));
  await sharp(Buffer.from(createIconSvg(32)))
    .png()
    .toFile(path.join(publicDir, 'favicon-32.png'));

  // 8. Screenshots for PWABuilder Store Listing
  await sharp(Buffer.from(createMobileScreenshotSvg()))
    .png()
    .toFile(path.join(publicDir, 'screenshot-mobile.png'));

  await sharp(Buffer.from(createWideScreenshotSvg()))
    .png()
    .toFile(path.join(publicDir, 'screenshot-wide.png'));

  console.log('All PWA assets generated successfully!');
}

generateAll().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
