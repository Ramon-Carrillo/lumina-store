/**
 * One-shot migration: rewrite ProductImage.url from picsum.photos to
 * the local /products/<id>.jpg path.
 *
 * Run once with:
 *   npx tsx prisma/migrate-images-local.ts
 *
 * Idempotent — re-running is a no-op once URLs are local. Safe to keep
 * around as documentation of the migration; it can be deleted after the
 * change has propagated to all environments.
 */

import { PrismaClient } from '../lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
})

const PICSUM_RE = /picsum\.photos\/id\/(\d+)\//

async function main() {
  const images = await prisma.productImage.findMany({
    select: { id: true, url: true },
  })

  let updated = 0
  let skipped = 0
  for (const img of images) {
    const match = img.url.match(PICSUM_RE)
    if (!match) {
      skipped++
      continue
    }
    const localUrl = `/products/${match[1]}.jpg`
    if (img.url === localUrl) {
      skipped++
      continue
    }
    await prisma.productImage.update({
      where: { id: img.id },
      data:  { url: localUrl },
    })
    updated++
  }

  console.log(`✓ Migration complete — ${updated} updated, ${skipped} skipped (already local or non-picsum).`)
}

main()
  .catch((e) => {
    console.error('Migration failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
