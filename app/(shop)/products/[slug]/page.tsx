import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { ProductDetail, type SerializedProduct } from '@/components/shop/product-detail'

// ─── Helpers ──────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toNum(d: any): number       { return Number(d) }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toNumN(d: any): number|null { return d == null ? null : Number(d) }

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const product: any = await prisma.product.findUnique({
    where:  { slug, published: true },
    select: { name: true, metaTitle: true, metaDescription: true, description: true },
  })

  if (!product) return {}

  return {
    title:       product.metaTitle       ?? product.name,
    description: product.metaDescription ?? product.description?.slice(0, 160),
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw: any = await prisma.product.findUnique({
    where: { slug, published: true },
    include: {
      images:   { orderBy: { position: 'asc' } },
      variants: { orderBy: { name: 'asc' } },
      category: { select: { name: true, slug: true } },
      _count:   { select: { reviews: true } },
    },
  })

  if (!raw) notFound()

  // Serialise every Decimal → number so the Client Component can receive it
  const product: SerializedProduct = {
    id:                raw.id,
    name:              raw.name,
    slug:              raw.slug,
    description:       raw.description,
    price:             toNum(raw.price),
    compareAt:         toNumN(raw.compareAt),
    stock:             raw.stock,
    featured:          raw.featured,
    noiseCancellation: raw.noiseCancellation,
    transparencyMode:  raw.transparencyMode,
    batteryLife:       raw.batteryLife   ?? null,
    chargingCaseLife:  raw.chargingCaseLife ?? null,
    quickCharge:       raw.quickCharge,
    waterResistance:   raw.waterResistance  ?? null,
    driverSize:        raw.driverSize       ?? null,
    frequencyResponse: raw.frequencyResponse ?? null,
    weight:            raw.weight           ?? null,
    colors:            raw.colors,
    connectivity:      raw.connectivity,
    inBox:             raw.inBox,
    warranty:          raw.warranty,
    images:            raw.images.map((img: any) => ({
      url:      img.url,
      alt:      img.alt,
      position: img.position,
    })),
    variants: raw.variants.map((v: any) => ({
      id:    v.id,
      name:  v.name,
      price: toNumN(v.price),
      stock: v.stock,
      image: v.image ?? null,
    })),
    category: raw.category,
    _count:   raw._count,
  }

  return <ProductDetail product={product} />
}
