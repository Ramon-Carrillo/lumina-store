/**
 * Lumina Store — Database seed
 *
 * Prerequisites:
 *   1. Copy .env.example → .env and fill in DATABASE_URL
 *   2. npx prisma migrate dev --name init   (creates tables)
 *   3. npx prisma generate                  (generates client)
 *   4. npx prisma db seed  OR  npm run db:seed
 *
 * Re-running is safe — deletes all existing data first.
 */

import { PrismaClient } from '../lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
})

// ─── Image helpers ────────────────────────────────────────────────────────────

/** Lorem Picsum photo by stable numeric ID — guaranteed available */
function img(id: number, alt: string) {
  return { url: `https://picsum.photos/id/${id}/900/900`, alt }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱  Seeding Lumina Store…\n')

  // ── 1. Wipe existing data (FK-safe order) ──────────────────────────────────
  await prisma.$transaction([
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.cartItem.deleteMany(),
    prisma.cart.deleteMany(),
    prisma.wishlistItem.deleteMany(),
    prisma.review.deleteMany(),
    prisma.productImage.deleteMany(),
    prisma.productVariant.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.address.deleteMany(),
    prisma.user.deleteMany(),
  ])

  console.log('  ✓  Cleared existing data')

  // ── 2. Categories ──────────────────────────────────────────────────────────
  const [
    catTWS, catHeadphones, catSport, catSpeakers,
    catGaming, catEarphones, catSoundbars, catDACs, catAccessories,
  ] = await Promise.all([
    prisma.category.create({
      data: {
        name:        'True Wireless',
        slug:        'true-wireless',
        description: 'Premium TWS earbuds engineered for every listening moment.',
      },
    }),
    prisma.category.create({
      data: {
        name:        'Headphones',
        slug:        'headphones',
        description: 'Over-ear and on-ear headphones for immersive, studio-quality listening.',
      },
    }),
    prisma.category.create({
      data: {
        name:        'Sport',
        slug:        'sport',
        description: 'Sweat-proof audio built to push limits.',
      },
    }),
    prisma.category.create({
      data: {
        name:        'Speakers',
        slug:        'speakers',
        description: 'Portable and home speakers that fill any space with pristine sound.',
      },
    }),
    prisma.category.create({
      data: {
        name:        'Gaming',
        slug:        'gaming',
        description: 'High-fidelity gaming headsets built for competition and immersion.',
      },
    }),
    prisma.category.create({
      data: {
        name:        'Earphones',
        slug:        'earphones',
        description: 'Wired in-ear monitors for the purist audiophile.',
      },
    }),
    prisma.category.create({
      data: {
        name:        'Soundbars',
        slug:        'soundbars',
        description: 'Cinematic sound systems designed for your living space.',
      },
    }),
    prisma.category.create({
      data: {
        name:        'DACs & Amps',
        slug:        'dacs-amps',
        description: 'Desktop DACs and amplifiers to unlock your headphones\' full potential.',
      },
    }),
    prisma.category.create({
      data: {
        name:        'Accessories',
        slug:        'accessories',
        description: 'Cables, cases, ear tips, and everything in between.',
      },
    }),
  ])

  console.log('  ✓  Categories created (9)')

  // ── 3. Products ────────────────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════════
  //  TRUE WIRELESS
  // ════════════════════════════════════════════════════════════════════════════

  // ── Lumina Pro X1 — Flagship TWS ──────────────────────────────────────────
  const proX1 = await prisma.product.create({
    data: {
      name:              'Lumina Pro X1',
      slug:              'lumina-pro-x1',
      description:       'Our most advanced true wireless earbuds. The Pro X1 features industry-leading Adaptive ANC, up to 40 hours total battery, and Hi-Res Audio Wireless certification — so every detail of your music comes through exactly as the artist intended.\n\nThree sizes of ear tips and a secure-fit wing ensure the Pro X1 stays put whether you\'re on a call, commuting, or deep in the zone.',
      price:             249.99,
      compareAt:         299.99,
      stock:             0, // intentionally out-of-stock to demo that state
      featured:          true,
      noiseCancellation: true,
      transparencyMode:  true,
      batteryLife:       8,
      chargingCaseLife:  32,
      quickCharge:       true,
      waterResistance:   'IPX4',
      driverSize:        10,
      frequencyResponse: '20 Hz – 20 kHz',
      connectivity:      ['Bluetooth 5.3', 'USB-C (case)'],
      colors:            ['Midnight Black', 'Pearl White', 'Arctic Blue'],
      inBox:             ['Earbuds (×2)', 'Charging Case', 'USB-C Cable', 'Ear Tips S/M/L', 'Ear Wings S/M/L', 'Quick Start Guide'],
      warranty:          24,
      metaTitle:         'Lumina Pro X1 Wireless Earbuds — Flagship ANC TWS',
      metaDescription:   'Experience premium sound with the Lumina Pro X1. Adaptive ANC, 40-hour battery, Hi-Res Audio Wireless. Our best true wireless earbuds.',
      categoryId:        catTWS.id,
    },
  })
  await prisma.productImage.createMany({
    data: [
      { productId: proX1.id, position: 0, ...img(26, 'Lumina Pro X1 earbuds in open charging case') },
      { productId: proX1.id, position: 1, ...img(60, 'Lumina Pro X1 earbuds side view') },
      { productId: proX1.id, position: 2, ...img(180, 'Lumina Pro X1 in-ear closeup') },
    ],
  })
  await prisma.productVariant.createMany({
    data: [
      { productId: proX1.id, name: 'Midnight Black', stock: 0 },
      { productId: proX1.id, name: 'Pearl White',    stock: 0 },
      { productId: proX1.id, name: 'Arctic Blue',    stock: 0 },
    ],
  })

  // ── Lumina Air 3 — Lightweight everyday ───────────────────────────────────
  const air3 = await prisma.product.create({
    data: {
      name:              'Lumina Air 3',
      slug:              'lumina-air-3',
      description:       'Feather-light at just 4.5 g per bud, the Air 3 disappears in your ears while delivering rich, balanced sound. No ANC complexity — just music, crystal-clear calls, and 35 hours of battery that keeps going as long as you do.',
      price:             149.99,
      stock:             78,
      featured:          true,
      noiseCancellation: false,
      transparencyMode:  false,
      batteryLife:       7,
      chargingCaseLife:  28,
      quickCharge:       true,
      waterResistance:   'IPX4',
      driverSize:        8,
      frequencyResponse: '20 Hz – 20 kHz',
      connectivity:      ['Bluetooth 5.2', 'USB-C (case)'],
      colors:            ['Midnight Black', 'Warm Sand', 'Sage Green'],
      inBox:             ['Earbuds (×2)', 'Charging Case', 'USB-C Cable', 'Ear Tips S/M/L'],
      warranty:          12,
      metaTitle:         'Lumina Air 3 Wireless Earbuds — Lightweight Everyday TWS',
      metaDescription:   'The Lumina Air 3 weighs just 4.5 g per bud. All-day comfort, 35-hour battery, and crisp audio in three elegant colorways.',
      categoryId:        catTWS.id,
    },
  })
  await prisma.productImage.createMany({
    data: [
      { productId: air3.id, position: 0, ...img(96, 'Lumina Air 3 earbuds next to open charging case') },
      { productId: air3.id, position: 1, ...img(160, 'Lumina Air 3 earbuds minimalist flat lay') },
    ],
  })
  await prisma.productVariant.createMany({
    data: [
      { productId: air3.id, name: 'Midnight Black', stock: 30 },
      { productId: air3.id, name: 'Warm Sand',      stock: 28 },
      { productId: air3.id, name: 'Sage Green',     stock: 20 },
    ],
  })

  // ── Lumina One — Mid-range ANC TWS ────────────────────────────────────────
  const one = await prisma.product.create({
    data: {
      name:              'Lumina One',
      slug:              'lumina-one',
      description:       'The sweet spot. ANC without the flagship price tag. The Lumina One packs a custom 11 mm driver and three-mic array into a compact stem design. Multipoint connectivity lets you switch seamlessly between your phone and laptop.',
      price:             199.99,
      stock:             34,
      featured:          false,
      noiseCancellation: true,
      transparencyMode:  true,
      batteryLife:       9,
      chargingCaseLife:  36,
      quickCharge:       true,
      waterResistance:   'IPX4',
      driverSize:        11,
      frequencyResponse: '20 Hz – 20 kHz',
      connectivity:      ['Bluetooth 5.3', 'USB-C (case)'],
      colors:            ['Midnight Black', 'Dusk Rose'],
      inBox:             ['Earbuds (×2)', 'Charging Case', 'USB-C Cable', 'Ear Tips S/M/L'],
      warranty:          12,
      metaTitle:         'Lumina One — ANC True Wireless Earbuds',
      metaDescription:   'Active noise cancellation, 45-hour total battery, multipoint pairing. The Lumina One hits the sweet spot at $199.',
      categoryId:        catTWS.id,
    },
  })
  await prisma.productImage.createMany({
    data: [
      { productId: one.id, position: 0, ...img(119, 'Lumina One earbuds') },
      { productId: one.id, position: 1, ...img(201, 'Lumina One earbuds flat lay') },
    ],
  })
  await prisma.productVariant.createMany({
    data: [
      { productId: one.id, name: 'Midnight Black', stock: 20 },
      { productId: one.id, name: 'Dusk Rose',      stock: 14 },
    ],
  })

  // ── Lumina Beats — Entry-level TWS ────────────────────────────────────────
  const beats = await prisma.product.create({
    data: {
      name:              'Lumina Beats',
      slug:              'lumina-beats',
      description:       'Great sound shouldn\'t cost a fortune. The Lumina Beats brings a 9 mm driver, one-tap controls, and 30 hours of battery to the most accessible price in our lineup. IPX4-rated so the rain (or gym) won\'t faze it.',
      price:             79.99,
      compareAt:         99.99,
      stock:             120,
      featured:          false,
      noiseCancellation: false,
      transparencyMode:  false,
      batteryLife:       6,
      chargingCaseLife:  24,
      quickCharge:       false,
      waterResistance:   'IPX4',
      driverSize:        9,
      frequencyResponse: '20 Hz – 20 kHz',
      connectivity:      ['Bluetooth 5.0', 'USB-C (case)'],
      colors:            ['Black', 'White', 'Red'],
      inBox:             ['Earbuds (×2)', 'Charging Case', 'USB-C Cable', 'Ear Tips S/M/L'],
      warranty:          12,
      metaTitle:         'Lumina Beats Wireless Earbuds — Great Sound Under $80',
      metaDescription:   'Affordable doesn\'t mean compromised. 30-hour battery, IPX4 rating, one-tap controls. Lumina Beats starts at $79.',
      categoryId:        catTWS.id,
    },
  })
  await prisma.productImage.createMany({
    data: [
      { productId: beats.id, position: 0, ...img(225, 'Lumina Beats earbuds white') },
    ],
  })
  await prisma.productVariant.createMany({
    data: [
      { productId: beats.id, name: 'Black', stock: 50 },
      { productId: beats.id, name: 'White', stock: 45 },
      { productId: beats.id, name: 'Red',   stock: 25 },
    ],
  })

  // ── Lumina Nano — Ultra-compact TWS ───────────────────────────────────────
  const nano = await prisma.product.create({
    data: {
      name:              'Lumina Nano',
      slug:              'lumina-nano',
      description:       'The world\'s problems, none of their size. At just 3.8 g per bud, the Nano practically disappears. A custom-tuned 7 mm driver punches well above its class, and the pebble-sized charging case slips into any pocket.',
      price:             99.99,
      compareAt:         119.99,
      stock:             89,
      featured:          false,
      noiseCancellation: false,
      transparencyMode:  false,
      batteryLife:       5,
      chargingCaseLife:  20,
      quickCharge:       false,
      waterResistance:   'IPX4',
      driverSize:        7,
      frequencyResponse: '20 Hz – 20 kHz',
      connectivity:      ['Bluetooth 5.2', 'USB-C (case)'],
      colors:            ['Obsidian', 'Chalk', 'Lavender'],
      inBox:             ['Earbuds (×2)', 'Charging Case', 'USB-C Cable', 'Ear Tips S/M/L'],
      warranty:          12,
      metaTitle:         'Lumina Nano — Ultra-Compact True Wireless Earbuds',
      metaDescription:   '3.8 g per bud. Tiny case, big sound. The Lumina Nano is the most pocketable TWS we\'ve ever made.',
      categoryId:        catTWS.id,
    },
  })
  await prisma.productImage.createMany({
    data: [
      { productId: nano.id, position: 0, ...img(237, 'Lumina Nano ultra-compact earbuds') },
    ],
  })
  await prisma.productVariant.createMany({
    data: [
      { productId: nano.id, name: 'Obsidian',  stock: 35 },
      { productId: nano.id, name: 'Chalk',     stock: 30 },
      { productId: nano.id, name: 'Lavender',  stock: 24 },
    ],
  })

  // ════════════════════════════════════════════════════════════════════════════
  //  HEADPHONES
  // ════════════════════════════════════════════════════════════════════════════

  // ── Lumina Studio Pro — Professional over-ear ─────────────────────────────
  const studioPro = await prisma.product.create({
    data: {
      name:              'Lumina Studio Pro',
      slug:              'lumina-studio-pro',
      description:       'Engineered for long sessions. The Studio Pro\'s 50 mm planar-inspired drivers render every micro-detail — perfect for mixing, remote work, or losing yourself in an album. Four microphones combine for broadcast-quality calls from anywhere.',
      price:             349.99,
      compareAt:         429.99,
      stock:             23,
      featured:          true,
      noiseCancellation: true,
      transparencyMode:  true,
      batteryLife:       40,
      quickCharge:       true,
      waterResistance:   'IPX2',
      driverSize:        50,
      frequencyResponse: '4 Hz – 40 kHz',
      impedance:         32,
      sensitivity:       103,
      weight:            254,
      connectivity:      ['Bluetooth 5.3', 'USB-C', '3.5 mm Jack'],
      colors:            ['Matte Black', 'Silver'],
      inBox:             ['Headphones', 'USB-C Cable', '3.5 mm Cable', 'Hard-shell Carry Case', 'Airplane Adapter'],
      warranty:          24,
      metaTitle:         'Lumina Studio Pro Over-Ear Headphones — 40 h ANC',
      metaDescription:   '50 mm drivers, adaptive ANC, 40-hour battery. The Lumina Studio Pro delivers studio-grade sound in a travel-ready package.',
      categoryId:        catHeadphones.id,
    },
  })
  await prisma.productImage.createMany({
    data: [
      { productId: studioPro.id, position: 0, ...img(3, 'Lumina Studio Pro headphones on desk') },
      { productId: studioPro.id, position: 1, ...img(36, 'Lumina Studio Pro headphones profile') },
      { productId: studioPro.id, position: 2, ...img(63, 'Lumina Studio Pro worn on model') },
    ],
  })
  await prisma.productVariant.createMany({
    data: [
      { productId: studioPro.id, name: 'Matte Black', stock: 14 },
      { productId: studioPro.id, name: 'Silver',      stock: 9  },
    ],
  })

  // ── Lumina Max — Ultra-premium over-ear ───────────────────────────────────
  const max = await prisma.product.create({
    data: {
      name:              'Lumina Max',
      slug:              'lumina-max',
      description:       'The pinnacle of Lumina engineering. The Max uses dual-layer ANC with custom 40 mm beryllium drivers, LDAC/aptX Lossless support, and an aircraft-grade aluminium headband you\'ll feel the quality of on first touch. 60 hours of battery means one charge lasts a week.',
      price:             449.99,
      stock:             12,
      featured:          true,
      noiseCancellation: true,
      transparencyMode:  true,
      batteryLife:       60,
      quickCharge:       true,
      waterResistance:   'IPX2',
      driverSize:        40,
      frequencyResponse: '4 Hz – 44.1 kHz',
      impedance:         16,
      sensitivity:       106,
      weight:            285,
      connectivity:      ['Bluetooth 5.4 (LE Audio)', 'USB-C', '3.5 mm Jack'],
      colors:            ['Space Black', 'Champagne Gold'],
      inBox:             ['Headphones', 'USB-C Cable', '3.5 mm Cable', 'Premium Hard Case', 'Cleaning Cloth', 'Airplane Adapter'],
      warranty:          24,
      metaTitle:         'Lumina Max Premium Headphones — 60 h Dual-Layer ANC',
      metaDescription:   'Beryllium drivers, LDAC, 60-hour battery. The Lumina Max is the last pair of headphones you\'ll ever need.',
      categoryId:        catHeadphones.id,
    },
  })
  await prisma.productImage.createMany({
    data: [
      { productId: max.id, position: 0, ...img(7, 'Lumina Max premium headphones') },
      { productId: max.id, position: 1, ...img(83, 'Lumina Max worn closeup') },
    ],
  })
  await prisma.productVariant.createMany({
    data: [
      { productId: max.id, name: 'Space Black',    stock: 8 },
      { productId: max.id, name: 'Champagne Gold', stock: 4, price: 479.99 },
    ],
  })

  // ── Lumina Flow — On-ear lifestyle headphones ─────────────────────────────
  const flow = await prisma.product.create({
    data: {
      name:              'Lumina Flow',
      slug:              'lumina-flow',
      description:       'On-ear style that doesn\'t sacrifice substance. The Flow folds flat for easy carry, pairs instantly with two devices at once, and charges from 0–100% in just 90 minutes. The 32 mm drivers deliver a warm, musical sound signature tuned for long listening sessions.',
      price:             179.99,
      compareAt:         219.99,
      stock:             41,
      featured:          false,
      noiseCancellation: false,
      transparencyMode:  false,
      batteryLife:       30,
      quickCharge:       true,
      waterResistance:   'IPX2',
      driverSize:        32,
      frequencyResponse: '20 Hz – 20 kHz',
      impedance:         32,
      sensitivity:       98,
      weight:            188,
      connectivity:      ['Bluetooth 5.2', 'USB-C', '3.5 mm Jack'],
      colors:            ['Cloud White', 'Slate', 'Terracotta'],
      inBox:             ['Headphones', 'USB-C Cable', '3.5 mm Cable', 'Soft Carry Pouch'],
      warranty:          12,
      metaTitle:         'Lumina Flow On-Ear Headphones — 30 h Battery, Foldable',
      metaDescription:   'Foldable on-ear headphones with 30-hour battery and dual-device pairing. Three lifestyle colorways.',
      categoryId:        catHeadphones.id,
    },
  })
  await prisma.productImage.createMany({
    data: [
      { productId: flow.id, position: 0, ...img(175, 'Lumina Flow on-ear headphones cloud white') },
      { productId: flow.id, position: 1, ...img(239, 'Lumina Flow headphones folded') },
    ],
  })
  await prisma.productVariant.createMany({
    data: [
      { productId: flow.id, name: 'Cloud White', stock: 18 },
      { productId: flow.id, name: 'Slate',       stock: 15 },
      { productId: flow.id, name: 'Terracotta',  stock: 8  },
    ],
  })

  // ════════════════════════════════════════════════════════════════════════════
  //  SPORT
  // ════════════════════════════════════════════════════════════════════════════

  // ── Lumina Sport Pro — Workout earbuds ────────────────────────────────────
  const sportPro = await prisma.product.create({
    data: {
      name:              'Lumina Sport Pro',
      slug:              'lumina-sport-pro',
      description:       'Built to push limits. Flex-lock ear hooks keep the Sport Pro secured through sprints, HIIT, and trail runs. IPX5 sweat and rain resistance, a dedicated workout mode that amplifies ambient sound for road awareness, and 8 hours on a single charge.',
      price:             129.99,
      stock:             56,
      featured:          false,
      noiseCancellation: false,
      transparencyMode:  true,
      batteryLife:       8,
      chargingCaseLife:  24,
      quickCharge:       true,
      waterResistance:   'IPX5',
      driverSize:        9.2,
      frequencyResponse: '20 Hz – 20 kHz',
      connectivity:      ['Bluetooth 5.2', 'USB-C (case)'],
      colors:            ['Electric Orange', 'Midnight Black', 'Volt Green'],
      inBox:             ['Earbuds (×2)', 'Charging Case', 'USB-C Cable', 'Ear Tips S/M/L', 'Ear Hooks S/M/L'],
      warranty:          12,
      metaTitle:         'Lumina Sport Pro — IPX5 Workout Earbuds',
      metaDescription:   'Flex-lock ear hooks, IPX5 water resistance, ambient-aware workout mode. Built for athletes.',
      categoryId:        catSport.id,
    },
  })
  await prisma.productImage.createMany({
    data: [
      { productId: sportPro.id, position: 0, ...img(15, 'Lumina Sport Pro workout earbuds') },
    ],
  })
  await prisma.productVariant.createMany({
    data: [
      { productId: sportPro.id, name: 'Electric Orange', stock: 22 },
      { productId: sportPro.id, name: 'Midnight Black',  stock: 20 },
      { productId: sportPro.id, name: 'Volt Green',      stock: 14 },
    ],
  })

  // ── Lumina Run — Lightweight open-ear sport ───────────────────────────────
  const run = await prisma.product.create({
    data: {
      name:              'Lumina Run',
      slug:              'lumina-run',
      description:       'Hear the road, feel the music. The Lumina Run uses directional open-ear drivers that sit just outside the ear canal — no occlusion, full situational awareness, all the sound. At 5 g per bud with no cable to snag, it\'s the perfect running companion.',
      price:             109.99,
      stock:             67,
      featured:          false,
      noiseCancellation: false,
      transparencyMode:  false,
      batteryLife:       6,
      chargingCaseLife:  18,
      quickCharge:       false,
      waterResistance:   'IPX5',
      driverSize:        14.2,
      frequencyResponse: '20 Hz – 20 kHz',
      connectivity:      ['Bluetooth 5.3', 'USB-C (case)'],
      colors:            ['Frost White', 'Carbon Black'],
      inBox:             ['Earbuds (×2)', 'Charging Case', 'USB-C Cable', 'Ear Hook Sizes S/M/L'],
      warranty:          12,
      metaTitle:         'Lumina Run — Open-Ear Sport Earbuds for Runners',
      metaDescription:   'Open-ear design keeps you aware of your surroundings. IPX5, 24-hour battery, weightless fit. Made for runners.',
      categoryId:        catSport.id,
    },
  })
  await prisma.productImage.createMany({
    data: [
      { productId: run.id, position: 0, ...img(28, 'Lumina Run open-ear sport earbuds') },
    ],
  })
  await prisma.productVariant.createMany({
    data: [
      { productId: run.id, name: 'Frost White',  stock: 35 },
      { productId: run.id, name: 'Carbon Black', stock: 32 },
    ],
  })

  // ════════════════════════════════════════════════════════════════════════════
  //  SPEAKERS
  // ════════════════════════════════════════════════════════════════════════════

  // ── Lumina Sphere — Premium portable speaker ──────────────────────────────
  const sphere = await prisma.product.create({
    data: {
      name:              'Lumina Sphere',
      slug:              'lumina-sphere',
      description:       'A 360-degree listening experience in a palm-sized form. The Sphere fires sound in all directions through a custom-tuned passive radiator array — no sweet spot, just immersive audio wherever you place it. IP67 dustproof and waterproof, 24 hours of playback, and a glowing ambient light ring that pulses to the beat.',
      price:             199.99,
      compareAt:         249.99,
      stock:             38,
      featured:          true,
      noiseCancellation: false,
      transparencyMode:  false,
      batteryLife:       24,
      quickCharge:       true,
      waterResistance:   'IP67',
      weight:            520,
      connectivity:      ['Bluetooth 5.3', 'USB-C', '3.5 mm Aux'],
      colors:            ['Obsidian', 'Chalk', 'Forest'],
      inBox:             ['Speaker', 'USB-C Charging Cable', 'Quick Start Guide'],
      warranty:          12,
      metaTitle:         'Lumina Sphere 360° Portable Speaker — IP67 Waterproof',
      metaDescription:   '360-degree sound, 24-hour battery, IP67 waterproof with ambient light ring. The Lumina Sphere is the portable speaker to own.',
      categoryId:        catSpeakers.id,
    },
  })
  await prisma.productImage.createMany({
    data: [
      { productId: sphere.id, position: 0, ...img(158, 'Lumina Sphere portable speaker obsidian') },
      { productId: sphere.id, position: 1, ...img(193, 'Lumina Sphere glowing ambient light') },
    ],
  })
  await prisma.productVariant.createMany({
    data: [
      { productId: sphere.id, name: 'Obsidian', stock: 16 },
      { productId: sphere.id, name: 'Chalk',    stock: 14 },
      { productId: sphere.id, name: 'Forest',   stock: 8  },
    ],
  })

  // ── Lumina Bar — Slim home shelf speaker ─────────────────────────────────
  const bar = await prisma.product.create({
    data: {
      name:              'Lumina Bar',
      slug:              'lumina-bar',
      description:       'Designed to live on your desk or bookshelf, the Lumina Bar packs twin 2.5-inch full-range drivers and a rear-firing bass port into a 260 mm brushed aluminium body. Stream over Bluetooth, plug in via USB-C, or connect to a turntable over the 3.5 mm RCA input.',
      price:             299.99,
      stock:             19,
      featured:          false,
      noiseCancellation: false,
      transparencyMode:  false,
      weight:            1200,
      connectivity:      ['Bluetooth 5.3', 'USB-C Audio', '3.5 mm Aux / RCA'],
      colors:            ['Brushed Aluminium', 'Matte Black'],
      inBox:             ['Speaker', 'USB-C Power Cable', '3.5 mm to RCA Cable', 'Quick Start Guide'],
      warranty:          24,
      metaTitle:         'Lumina Bar Shelf Speaker — Bluetooth & USB-C',
      metaDescription:   'Twin 2.5-inch drivers, rear-firing bass port, brushed aluminium body. Your desk deserves better audio.',
      categoryId:        catSpeakers.id,
    },
  })
  await prisma.productImage.createMany({
    data: [
      { productId: bar.id, position: 0, ...img(256, 'Lumina Bar shelf speaker on desk') },
      { productId: bar.id, position: 1, ...img(274, 'Lumina Bar closeup aluminium grille') },
    ],
  })
  await prisma.productVariant.createMany({
    data: [
      { productId: bar.id, name: 'Brushed Aluminium', stock: 12 },
      { productId: bar.id, name: 'Matte Black',        stock: 7  },
    ],
  })

  // ════════════════════════════════════════════════════════════════════════════
  //  ACCESSORIES
  // ════════════════════════════════════════════════════════════════════════════

  // ── Lumina Foam Ear Tips — 3-pack ─────────────────────────────────────────
  const eartips = await prisma.product.create({
    data: {
      name:              'Memory Foam Ear Tips — 3-Pack',
      slug:              'memory-foam-ear-tips',
      description:       'Upgrade your seal, upgrade your sound. These slow-rebound memory foam tips conform to the exact shape of your ear canal, improving passive noise isolation by up to 6 dB and bass response noticeably. Compatible with all Lumina TWS earbuds (Pro X1, Air 3, One, Beats, Nano).\n\nEach pack includes Small, Medium, and Large in a single colour.',
      price:             14.99,
      stock:             250,
      featured:          false,
      noiseCancellation: false,
      transparencyMode:  false,
      connectivity:      [],
      colors:            ['Black', 'White'],
      inBox:             ['Ear Tips S (×2)', 'Ear Tips M (×2)', 'Ear Tips L (×2)', 'Travel Pouch'],
      warranty:          3,
      metaTitle:         'Lumina Memory Foam Ear Tips — 3-Pack (S/M/L)',
      metaDescription:   'Slow-rebound foam ear tips for Lumina TWS earbuds. Up to 6 dB better isolation. Fits Pro X1, Air 3, One, Beats, and Nano.',
      categoryId:        catAccessories.id,
    },
  })
  await prisma.productImage.createMany({
    data: [
      { productId: eartips.id, position: 0, ...img(341, 'Lumina memory foam ear tips three sizes') },
    ],
  })
  await prisma.productVariant.createMany({
    data: [
      { productId: eartips.id, name: 'Black', stock: 130 },
      { productId: eartips.id, name: 'White', stock: 120 },
    ],
  })

  // ── Lumina MagCase Pro — Wireless charging case ───────────────────────────
  const magCase = await prisma.product.create({
    data: {
      name:              'MagCase Pro — Wireless Charging Case',
      slug:              'magcase-pro',
      description:       'Replace your standard charging case with one that keeps up with your lifestyle. The MagCase Pro adds Qi2 wireless charging to the Lumina Pro X1 and Lumina One — just drop it on any MagSafe or Qi2 pad. A full-coverage tactile silicone shell protects against drops without adding bulk.',
      price:             49.99,
      compareAt:         59.99,
      stock:             75,
      featured:          false,
      noiseCancellation: false,
      transparencyMode:  false,
      connectivity:      ['Qi2 Wireless', 'USB-C'],
      colors:            ['Midnight Black', 'Clear'],
      inBox:             ['MagCase Pro', 'USB-C Cable'],
      warranty:          12,
      metaTitle:         'Lumina MagCase Pro — Qi2 Wireless Charging Case',
      metaDescription:   'Add Qi2 wireless charging to your Lumina Pro X1 or Lumina One. Silicone drop protection included.',
      categoryId:        catAccessories.id,
    },
  })
  await prisma.productImage.createMany({
    data: [
      { productId: magCase.id, position: 0, ...img(367, 'Lumina MagCase Pro wireless charging case on clean surface') },
      { productId: magCase.id, position: 1, ...img(399, 'Lumina MagCase Pro charging case detail view') },
    ],
  })
  await prisma.productVariant.createMany({
    data: [
      { productId: magCase.id, name: 'Midnight Black', stock: 40 },
      { productId: magCase.id, name: 'Clear',          stock: 35 },
    ],
  })

  // ════════════════════════════════════════════════════════════════════════════
  //  GAMING
  // ════════════════════════════════════════════════════════════════════════════

  // ── Lumina Apex — Gaming headset ──────────────────────────────────────────
  const apex = await prisma.product.create({
    data: {
      name:              'Lumina Apex',
      slug:              'lumina-apex',
      description:       'Engineered for the competitive edge. The Apex delivers 7.1 virtual surround sound through 50 mm neodymium drivers, so you hear footsteps before your opponents do. The detachable cardioid boom mic filters keyboard clatter and background noise for crystal-clear comms. USB-C for PC and 3.5 mm for console — one headset, every platform.',
      price:             179.99,
      compareAt:         219.99,
      stock:             44,
      featured:          true,
      noiseCancellation: false,
      transparencyMode:  false,
      batteryLife:       null,
      driverSize:        50,
      frequencyResponse: '20 Hz – 20 kHz',
      impedance:         32,
      sensitivity:       98,
      weight:            298,
      connectivity:      ['USB-C', '3.5 mm Jack'],
      colors:            ['Midnight Black', 'Arctic White'],
      inBox:             ['Headset', 'Detachable Boom Mic', 'USB-C Cable', '3.5 mm Cable', 'USB-C to USB-A Adapter'],
      warranty:          12,
      metaTitle:         'Lumina Apex Gaming Headset — 7.1 Surround, 50 mm Drivers',
      metaDescription:   '7.1 virtual surround, 50 mm drivers, detachable mic. USB-C & 3.5 mm. The Lumina Apex is built to win.',
      categoryId:        catGaming.id,
    },
  })
  await prisma.productImage.createMany({
    data: [
      { productId: apex.id, position: 0, ...img(42, 'Lumina Apex gaming headset on desk') },
      { productId: apex.id, position: 1, ...img(111, 'Lumina Apex gaming headset side view') },
    ],
  })
  await prisma.productVariant.createMany({
    data: [
      { productId: apex.id, name: 'Midnight Black', stock: 28 },
      { productId: apex.id, name: 'Arctic White',   stock: 16 },
    ],
  })

  // ─ Lumina Apex Lite — Entry gaming headset ────────────────────────────────
  const apexLite = await prisma.product.create({
    data: {
      name:              'Lumina Apex Lite',
      slug:              'lumina-apex-lite',
      description:       'All the essentials, none of the excess. The Apex Lite packs 40 mm drivers and a flexible unidirectional mic into a lightweight on-ear design. Plug-and-play 3.5 mm means it works instantly on any platform — PC, console, or mobile.',
      price:             79.99,
      stock:             88,
      featured:          false,
      noiseCancellation: false,
      transparencyMode:  false,
      driverSize:        40,
      frequencyResponse: '20 Hz – 20 kHz',
      impedance:         32,
      sensitivity:       95,
      weight:            198,
      connectivity:      ['3.5 mm Jack'],
      colors:            ['Midnight Black', 'Carbon Red'],
      inBox:             ['Headset', 'Detachable Mic', '1.5 m Braided Cable'],
      warranty:          12,
      metaTitle:         'Lumina Apex Lite Gaming Headset — Plug-and-Play',
      metaDescription:   'Lightweight gaming headset with 40 mm drivers and detachable mic. Plug-and-play 3.5 mm. Works on every platform.',
      categoryId:        catGaming.id,
    },
  })
  await prisma.productImage.createMany({
    data: [
      { productId: apexLite.id, position: 0, ...img(145, 'Lumina Apex Lite gaming headset') },
    ],
  })
  await prisma.productVariant.createMany({
    data: [
      { productId: apexLite.id, name: 'Midnight Black', stock: 55 },
      { productId: apexLite.id, name: 'Carbon Red',     stock: 33 },
    ],
  })

  // ════════════════════════════════════════════════════════════════════════════
  //  EARPHONES (wired IEMs)
  // ════════════════════════════════════════════════════════════════════════════

  // ── Lumina Thread — Wired IEMs ────────────────────────────────────────────
  const thread = await prisma.product.create({
    data: {
      name:              'Lumina Thread',
      slug:              'lumina-thread',
      description:       'For listeners who believe wires are a feature, not a flaw. The Thread uses a 10 mm liquid-crystal polymer driver to deliver ruler-flat frequency response and sub-bass extension that wireless codecs can\'t touch. The detachable MMCX cable swaps between balanced 4.4 mm and single-ended 3.5 mm terminations — pair it with any source.',
      price:             149.99,
      compareAt:         179.99,
      stock:             62,
      featured:          false,
      noiseCancellation: false,
      transparencyMode:  false,
      driverSize:        10,
      frequencyResponse: '10 Hz – 25 kHz',
      impedance:         18,
      sensitivity:       108,
      connectivity:      ['3.5 mm Jack', '4.4 mm Balanced (cable sold separately)'],
      colors:            ['Graphite', 'Champagne'],
      inBox:             ['Earphones (×2)', 'MMCX Cable (3.5 mm)', 'Ear Tips S/M/L (silicone)', 'Ear Tips S/M/L (foam)', 'Hard Carry Case'],
      warranty:          12,
      metaTitle:         'Lumina Thread Wired Earphones — MMCX IEM, LCP Driver',
      metaDescription:   'Liquid-crystal polymer driver, detachable MMCX cable, 4.4 mm balanced ready. The Lumina Thread is hi-fi at your fingertips.',
      categoryId:        catEarphones.id,
    },
  })
  await prisma.productImage.createMany({
    data: [
      { productId: thread.id, position: 0, ...img(453, 'Lumina Thread wired earphones') },
      { productId: thread.id, position: 1, ...img(471, 'Lumina Thread MMCX cable detail') },
    ],
  })
  await prisma.productVariant.createMany({
    data: [
      { productId: thread.id, name: 'Graphite',   stock: 35 },
      { productId: thread.id, name: 'Champagne',  stock: 27 },
    ],
  })

  // ════════════════════════════════════════════════════════════════════════════
  //  SOUNDBARS
  // ════════════════════════════════════════════════════════════════════════════

  // ── Lumina Arc — 2.1 Soundbar ─────────────────────────────────────────────
  const arc = await prisma.product.create({
    data: {
      name:              'Lumina Arc',
      slug:              'lumina-arc',
      description:       'Transform your living room without the clutter. The Arc\'s 90 W 2.1 system — seven drivers plus a wireless subwoofer — decodes Dolby Atmos and DTS:X for height-channel audio from a single 900 mm bar. HDMI eARC keeps your remote setup simple; Bluetooth 5.3 streams music when the TV\'s off.',
      price:             449.99,
      compareAt:         549.99,
      stock:             17,
      featured:          true,
      noiseCancellation: false,
      transparencyMode:  false,
      weight:            3200,
      connectivity:      ['HDMI eARC', 'Optical', 'Bluetooth 5.3', 'USB-A (media)'],
      colors:            ['Matte Black', 'Light Grey'],
      inBox:             ['Soundbar', 'Wireless Subwoofer', 'HDMI Cable', 'Optical Cable', 'Wall-mount Kit', 'Remote Control'],
      warranty:          24,
      metaTitle:         'Lumina Arc 2.1 Soundbar — Dolby Atmos, HDMI eARC',
      metaDescription:   '90 W, 7 drivers, wireless sub, Dolby Atmos & DTS:X. The Lumina Arc brings the cinema home.',
      categoryId:        catSoundbars.id,
    },
  })
  await prisma.productImage.createMany({
    data: [
      { productId: arc.id, position: 0, ...img(497, 'Lumina Arc soundbar below TV') },
      { productId: arc.id, position: 1, ...img(514, 'Lumina Arc soundbar closeup grille') },
    ],
  })
  await prisma.productVariant.createMany({
    data: [
      { productId: arc.id, name: 'Matte Black', stock: 11 },
      { productId: arc.id, name: 'Light Grey',  stock: 6  },
    ],
  })

  // ════════════════════════════════════════════════════════════════════════════
  //  DACs & AMPS
  // ════════════════════════════════════════════════════════════════════════════

  // ── Lumina Stack — Desktop DAC/Amp ────────────────────────────────────────
  const stack = await prisma.product.create({
    data: {
      name:              'Lumina Stack',
      slug:              'lumina-stack',
      description:       'Your headphones are only as good as what drives them. The Stack pairs a 32-bit/384 kHz ES9038 DAC with a discrete Class-A amplifier stage capable of delivering 1 W into 32 Ω. Single-ended 3.5 mm and balanced 4.4 mm outputs cover every headphone on the market. Feed it from USB-C or optical and hear the difference immediately.',
      price:             299.99,
      stock:             26,
      featured:          false,
      noiseCancellation: false,
      transparencyMode:  false,
      frequencyResponse: '20 Hz – 20 kHz (±0.1 dB)',
      impedance:         1,
      weight:            680,
      connectivity:      ['USB-C', 'Optical (TosLink)', '3.5 mm Output', '4.4 mm Balanced Output', 'RCA Line Out'],
      colors:            ['Brushed Aluminium', 'Matte Black'],
      inBox:             ['DAC/Amp Unit', 'USB-C Cable', 'Power Adapter', 'Quick Start Guide'],
      warranty:          24,
      metaTitle:         'Lumina Stack Desktop DAC/Amp — ES9038, 4.4 mm Balanced',
      metaDescription:   'ES9038 DAC, Class-A amp, 4.4 mm balanced + 3.5 mm outputs. 32-bit/384 kHz. The Lumina Stack unlocks your headphones.',
      categoryId:        catDACs.id,
    },
  })
  await prisma.productImage.createMany({
    data: [
      { productId: stack.id, position: 0, ...img(532, 'Lumina Stack DAC amp on desk') },
      { productId: stack.id, position: 1, ...img(550, 'Lumina Stack rear connections') },
    ],
  })
  await prisma.productVariant.createMany({
    data: [
      { productId: stack.id, name: 'Brushed Aluminium', stock: 16 },
      { productId: stack.id, name: 'Matte Black',        stock: 10 },
    ],
  })

  console.log('  ✓  Products created (20 total)')

  // ── 4. Demo users + reviews ────────────────────────────────────────────────
  const [alexReyes, jordanKim, samPatel] = await Promise.all([
    prisma.user.create({
      data: { email: 'alex@demo.lumina.store', name: 'Alex Reyes', role: 'CUSTOMER' },
    }),
    prisma.user.create({
      data: { email: 'jordan@demo.lumina.store', name: 'Jordan Kim', role: 'CUSTOMER' },
    }),
    prisma.user.create({
      data: { email: 'sam@demo.lumina.store', name: 'Sam Patel', role: 'CUSTOMER' },
    }),
  ])

  await prisma.review.createMany({
    data: [
      // Studio Pro — 5 stars
      {
        userId:    alexReyes.id,
        productId: studioPro.id,
        rating:    5,
        title:     'Best headphones I\'ve ever owned',
        body:      'I\'ve tried Bose, Sony, and Apple — nothing beats the Studio Pro for comfort and detail. The ANC is eerily good and 40 hours of battery means I charge them maybe twice a week.',
        verified:  true,
        helpful:   42,
      },
      // Air 3 — 4 stars
      {
        userId:    alexReyes.id,
        productId: air3.id,
        rating:    4,
        title:     'Lightweight and surprisingly capable',
        body:      'I bought these expecting to miss ANC but the passive isolation is better than expected. They fall out a tiny bit when I look down sharply, but otherwise perfect for commuting.',
        verified:  true,
        helpful:   17,
      },
      // Lumina Max — 5 stars
      {
        userId:    jordanKim.id,
        productId: max.id,
        rating:    5,
        title:     'Worth every penny',
        body:      'The beryllium drivers are on another level — I heard details in tracks I\'ve listened to hundreds of times. 60-hour battery is as good as advertised. The aluminium headband feels like jewellery.',
        verified:  true,
        helpful:   31,
      },
      // Lumina Sphere — 5 stars
      {
        userId:    jordanKim.id,
        productId: sphere.id,
        rating:    5,
        title:     'My new travel essential',
        body:      'Fits in my backpack side pocket, survived a full day at the beach (IP67 is real), and genuinely fills a hotel room with sound. The ambient light is a nice touch at night.',
        verified:  true,
        helpful:   24,
      },
      // Sport Pro — 4 stars
      {
        userId:    samPatel.id,
        productId: sportPro.id,
        rating:    4,
        title:     'Finally earbuds that stay in',
        body:      'I\'ve returned three other pairs because they fall out mid-run. The flex-lock hooks on the Sport Pro are a game changer. Sound is punchy and the ambient mode is genuinely useful on roads.',
        verified:  true,
        helpful:   19,
      },
      // Lumina One — 4 stars
      {
        userId:    samPatel.id,
        productId: one.id,
        rating:    4,
        title:     'Great ANC at this price',
        body:      'Compared to the Pro X1 the ANC isn\'t quite as adaptive, but at $200 the Lumina One is excellent value. Multipoint pairing works flawlessly between my MacBook and iPhone.',
        verified:  true,
        helpful:   12,
      },
    ],
  })

  console.log('  ✓  Demo users + reviews created')

  // ── Summary ────────────────────────────────────────────────────────────────
  const counts = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.productVariant.count(),
    prisma.productImage.count(),
    prisma.review.count(),
  ])

  console.log(`
╔═══════════════════════════════╗
║   Lumina Seed Complete ✓      ║
╠═══════════════════════════════╣
║  Categories : ${String(counts[0]).padEnd(15)}║
║  Products   : ${String(counts[1]).padEnd(15)}║
║  Variants   : ${String(counts[2]).padEnd(15)}║
║  Images     : ${String(counts[3]).padEnd(15)}║
║  Reviews    : ${String(counts[4]).padEnd(15)}║
╚═══════════════════════════════╝
  `)
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
