const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const DEFAULT_LISTINGS = require('../data/default_listings.js');

const SITE_URL = 'https://phonebook-kolar-chintamani.netlify.app';
const ADMIN_WHATSAPP = '8550093816';

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatTelHref(phone) {
  return 'tel:' + String(phone || '').replace(/[^\d+]/g, '');
}

function getWhatsAppUrl(phone, name) {
  let digits = String(phone || '').replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) {
    digits = digits.slice(2);
  } else if (digits.startsWith('0') && digits.length === 11) {
    digits = digits.slice(1);
  }
  if (!/^[6-9]\d{9}$/.test(digits)) {
    return null;
  }
  const msg = encodeURIComponent(`Hello ${name}, I found your number in the Kolar & Chintamani Service Phonebook. Are you available for service?`);
  return `https://wa.me/91${digits}?text=${msg}`;
}

function getGoogleMapsUrl(item) {
  const query = encodeURIComponent(`${item.name}, ${item.address}, ${item.city}, Karnataka`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function formatSmsHref(phone, name) {
  const cleaned = String(phone || '').replace(/[^\d+]/g, '');
  const body = encodeURIComponent(`Hello ${name}, I found your contact on the Kolar & Chintamani Service Phonebook and need assistance.`);
  return `sms:${cleaned}?body=${body}`;
}

function getCityBadgeClasses(city) {
  return city === 'Kolar'
    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
    : 'bg-teal-50 text-teal-700 border-teal-200';
}

function getCategoryBadgeClasses(category) {
  switch (category) {
    case 'Plumbers':
      return 'bg-sky-50 text-sky-700 border-sky-200';
    case 'Electricians':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Painters':
      return 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200';
    case 'Carpenters':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'AC & Appliance Repair':
      return 'bg-cyan-50 text-cyan-700 border-cyan-200';
    case 'Welding & Fabrication':
      return 'bg-slate-100 text-slate-700 border-slate-300';
    case 'Core Cutting':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'CCTV & Security':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Water Tank & Borewell':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Tiles & Masonry':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Pest Control':
      return 'bg-lime-50 text-lime-700 border-lime-200';
    default:
      return 'bg-violet-50 text-violet-700 border-violet-200';
  }
}

// Generate pre-rendered HTML cards for crawlers & initial fast paint
function generateCardHtml(item) {
  const waUrl = getWhatsAppUrl(item.phone, item.name);
  const mapsUrl = getGoogleMapsUrl(item);

  const categoryBadgesHtml = item.categories
    .map(
      (cat) =>
        `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryBadgeClasses(cat)}">${escapeHtml(cat)}</span>`
    )
    .join('');

  const confirmedBadgeHtml = item.verified
    ? `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200" title="Contact number confirmed by phone call">
         <svg class="w-3 h-3 text-emerald-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
         </svg>
         <span>Confirmed by phone</span>
       </span>`
    : '';

  const altPhoneRowHtml = item.altPhone
    ? `
      <div class="flex items-center justify-between gap-2 mb-3 px-3 py-1.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
        <div class="flex items-center gap-2 min-w-0">
          <span class="text-[11px] font-semibold uppercase tracking-wide text-slate-400 shrink-0">Alt</span>
          <a href="${escapeHtml(formatTelHref(item.altPhone))}" class="text-xs sm:text-sm font-semibold text-slate-700 hover:text-emerald-700 truncate">${escapeHtml(item.altPhone)}</a>
        </div>
        <button
          type="button"
          data-copy-phone="${escapeHtml(item.altPhone)}"
          class="copy-btn inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 border border-slate-200 bg-white transition-colors shrink-0 cursor-pointer"
          title="Copy alternate number"
        >
          <span>Copy</span>
        </button>
      </div>
    `
    : '';

  const primaryActionsHtml = waUrl
    ? `
      <div class="grid grid-cols-2 gap-2">
        <a
          href="${escapeHtml(formatTelHref(item.phone))}"
          class="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-sm shadow-emerald-600/20 transition-all"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span>Call Now</span>
        </a>
        <a
          href="${escapeHtml(waUrl)}"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-sm shadow-green-600/20 transition-all"
        >
          <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.47 0 .11 5.36.11 11.95c0 2.1.55 4.15 1.59 5.96L0 24l6.26-1.64a11.93 11.93 0 0 0 5.8 1.48h.01c6.59 0 11.95-5.36 11.95-11.95 0-3.19-1.24-6.19-3.5-8.41zm-8.46 18.35h-.01a9.92 9.92 0 0 1-5.06-1.39l-.36-.22-3.71.97.99-3.62-.24-.37a9.91 9.91 0 0 1-1.52-5.25c0-5.47 4.45-9.92 9.93-9.92 2.65 0 5.14 1.03 7.01 2.91a9.86 9.86 0 0 1 2.9 7.02c0 5.47-4.45 9.87-9.93 9.87zm5.45-7.43c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.21 5.09 4.5.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z"/>
          </svg>
          <span>WhatsApp</span>
        </a>
      </div>
    `
    : `
      <a
        href="${escapeHtml(formatTelHref(item.phone))}"
        class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-sm font-semibold shadow-sm shadow-emerald-600/20 transition-all"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
        <span>Call Now</span>
      </a>
    `;

  const removalMessage = encodeURIComponent(
    `Hello, I want my listing changed/removed from the Kolar & Chintamani phonebook. Name: ${item.name}, Phone: ${item.phone}`
  );
  const removalLink = `https://wa.me/${ADMIN_WHATSAPP}?text=${removalMessage}`;

  return `
    <article class="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between p-5" data-contact-id="${escapeHtml(item.id)}">
      <div>
        <!-- Badges & Favorite Action Row -->
        <div class="flex items-start justify-between gap-2 mb-3">
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCityBadgeClasses(item.city)}">
              ${escapeHtml(item.city)}
            </span>
            ${categoryBadgesHtml}
            ${confirmedBadgeHtml}
          </div>
          <div class="flex items-center gap-0.5 shrink-0 -mt-1 -mr-1">
            <button
              type="button"
              data-fav-id="${escapeHtml(item.id)}"
              aria-label="Save to favorites"
              title="Save contact"
              class="fav-btn p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Business Name & Description -->
        <h3 class="text-base font-bold text-slate-900 leading-snug">${escapeHtml(item.name)}</h3>
        <p class="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">${escapeHtml(item.desc)}</p>

        <!-- Address & Hours -->
        <div class="mt-3.5 space-y-2 text-xs text-slate-500">
          <div class="flex items-start gap-2">
            <svg class="w-4 h-4 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>${escapeHtml(item.address)}</span>
          </div>
          <div class="flex items-start gap-2">
            <svg class="w-4 h-4 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" />
            </svg>
            <span>${escapeHtml(item.hours)}</span>
          </div>
        </div>
      </div>

      <!-- Phone & Action Controls -->
      <div class="mt-5 pt-4 border-t border-slate-100">
        <div class="flex items-center justify-between gap-2 mb-2.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80">
          <div class="flex items-center gap-2 min-w-0">
            <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span class="text-sm font-bold text-slate-900 tracking-wide truncate">${escapeHtml(item.phone)}</span>
          </div>
          <button
            type="button"
            data-copy-phone="${escapeHtml(item.phone)}"
            class="copy-btn inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 border border-slate-200 bg-white transition-colors shrink-0 cursor-pointer"
            title="Copy phone number"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <span>Copy</span>
          </button>
        </div>

        ${altPhoneRowHtml}
        ${primaryActionsHtml}

        <!-- Secondary Phone Utility Bar: SMS, Save vCard, Share, Google Maps -->
        <div class="mt-2.5 grid grid-cols-4 gap-1.5">
          <a
            href="${escapeHtml(formatSmsHref(item.phone, item.name))}"
            class="inline-flex flex-col items-center justify-center gap-0.5 py-2 px-1 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200/80 text-[11px] font-semibold transition-colors"
            title="Send SMS"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>SMS</span>
          </a>
          <button
            type="button"
            data-vcard-id="${escapeHtml(item.id)}"
            class="vcard-btn inline-flex flex-col items-center justify-center gap-0.5 py-2 px-1 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200/80 text-[11px] font-semibold transition-colors cursor-pointer"
            title="Save to phone contacts (.vcf)"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 8v6M23 11h-6" />
            </svg>
            <span>Save .vcf</span>
          </button>
          <button
            type="button"
            data-share-id="${escapeHtml(item.id)}"
            class="share-btn inline-flex flex-col items-center justify-center gap-0.5 py-2 px-1 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200/80 text-[11px] font-semibold transition-colors cursor-pointer"
            title="Share contact details"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
            </svg>
            <span>Share</span>
          </button>
          <a
            href="${escapeHtml(mapsUrl)}"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex flex-col items-center justify-center gap-0.5 py-2 px-1 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200/80 text-[11px] font-semibold transition-colors"
            title="Open in Google Maps"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>Maps</span>
          </a>
        </div>

        <!-- Request Change or Removal Link -->
        <div class="mt-2.5 pt-2 text-center border-t border-slate-100/80">
          <a
            href="${removalLink}"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
            title="Request update or removal of this listing"
          >
            <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Request change or removal</span>
          </a>
        </div>
      </div>
    </article>
  `;
}

// Generate JSON-LD Schema
function generateJsonLd(listings) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Kolar & Chintamani Local Service Directory",
    "description": "Local service numbers for plumbers, electricians, painters, carpenters, AC repair and welders in Kolar and Chintamani, Karnataka.",
    "itemListElement": listings.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "LocalBusiness",
        "name": item.name,
        "telephone": item.phone,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": item.address,
          "addressLocality": item.city,
          "addressRegion": "Karnataka",
          "addressCountry": "IN"
        },
        "description": item.desc
      }
    }))
  };
  return JSON.stringify(schema, null, 2);
}

// Generate pure Node.js 1200x630 PNG Open Graph Image
function generateOgImagePng() {
  const width = 1200;
  const height = 630;
  const rowSize = width * 4 + 1;
  const raw = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    raw[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Dark elegant theme gradient (slate-950 to indigo-950)
      let r = Math.floor(15 + (x / width) * 15);
      let g = Math.floor(23 + (y / height) * 20);
      let b = Math.floor(42 + ((x + y) / (width + height)) * 40);

      // Card outer frame border at 40px inset
      const inBorder = (x >= 40 && x <= 1160 && (y === 40 || y === 590)) ||
                       (y >= 40 && y <= 590 && (x === 40 || x === 1160));
      if (inBorder) {
        r = 79; g = 70; b = 229; // Indigo 600
      }

      // Top glowing banner bar
      if (y >= 40 && y <= 48 && x >= 40 && x <= 1160) {
        r = 16; g = 185; b = 129; // Emerald accent
      }

      raw[pxOffset] = r;
      raw[pxOffset + 1] = g;
      raw[pxOffset + 2] = b;
      raw[pxOffset + 3] = 255;
    }
  }

  const deflated = zlib.deflateSync(raw);

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc ^= buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
      }
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const crcVal = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(crcVal, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    sig,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', deflated),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

// Generate robots.txt
function generateRobotsTxt() {
  return `# Robots.txt for Kolar & Chintamani Service Phonebook
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin.html

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

// Generate sitemap.xml
function generateSitemapXml(routes) {
  const now = new Date().toISOString().split('T')[0];
  const urlEntries = routes.map((r) => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${r.changefreq || 'weekly'}</changefreq>
    <priority>${r.priority || '0.8'}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;
}

// Generate Netlify Redirects & Config
function generateNetlifyConfig() {
  return {
    redirects: `/admin    /admin.html    200\n`,
    toml: `[build]
  publish = "."

[[redirects]]
  from = "/admin"
  to = "/admin.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
`
  };
}

// Generate Firestore Security Rules
function generateFirestoreRules() {
  return `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper: Check if user is authenticated admin
    // Non-anonymous users authenticated via Email/Password or Google Sign-in are considered admin.
    function isAuthenticated() {
      return request.auth != null;
    }

    function isNonAnonymousAdmin() {
      return isAuthenticated() && request.auth.token.firebase.sign_in_provider != 'anonymous';
    }

    function isAdmin() {
      return isNonAnonymousAdmin();
    }

    // Community and public contacts collection
    match /artifacts/{appId}/public/data/contacts/{contactId} {
      // 1. Visitors can ONLY read approved contacts.
      // Admin can read all contacts (including pending queue).
      allow read: if resource.data.status == 'approved' || isAdmin();

      // 2. Visitors can ONLY submit new contacts with status == 'pending' and verified == false.
      // Strict field sanitization and type enforcement prevents malicious injections:
      allow create: if (
        (
          request.resource.data.status == 'pending' &&
          request.resource.data.verified == false &&
          request.resource.data.name is string &&
          request.resource.data.name.size() > 0 &&
          request.resource.data.name.size() <= 100 &&
          request.resource.data.phone is string &&
          request.resource.data.phone.size() >= 10 &&
          request.resource.data.phone.size() <= 25 &&
          request.resource.data.city in ['Kolar', 'Chintamani'] &&
          request.resource.data.categories is list &&
          request.resource.data.categories.size() > 0 &&
          request.resource.data.categories.size() <= 6 &&
          request.resource.data.address is string &&
          request.resource.data.address.size() > 0 &&
          request.resource.data.address.size() <= 200
        )
        || isAdmin()
      );

      // 3. ONLY authenticated Admins can update (approve, edit) or delete contacts:
      allow update, delete: if isAdmin();
    }

    // Base default listings overrides (soft deletions and field updates)
    match /artifacts/{appId}/public/data/base_overrides/{overrideId} {
      // Anyone can read overrides to know if a base contact was edited or deleted:
      allow read: if true;
      // ONLY Admin can write or delete overrides:
      allow write: if isAdmin();
    }

    // User private saved favorites
    match /artifacts/{appId}/users/{userId}/favorites/saved {
      allow read, write: if isAuthenticated() && request.auth.uid == userId;
    }

    // Admins registry collection
    match /artifacts/{appId}/admins/{adminId} {
      allow read: if isAdmin();
      allow write: if false; // Only manageable directly via Firebase Console
    }
  }
}
`;
}

module.exports = {
  DEFAULT_LISTINGS,
  SITE_URL,
  ADMIN_WHATSAPP,
  escapeHtml,
  formatTelHref,
  getWhatsAppUrl,
  getGoogleMapsUrl,
  formatSmsHref,
  getCityBadgeClasses,
  getCategoryBadgeClasses,
  generateCardHtml,
  generateJsonLd,
  generateOgImagePng,
  generateRobotsTxt,
  generateSitemapXml,
  generateNetlifyConfig,
  generateFirestoreRules
};
