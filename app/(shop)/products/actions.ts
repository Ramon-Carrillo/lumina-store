'use server'

import { redirect } from 'next/navigation'

/**
 * Server Action — handles the search form on the products page.
 * Rebuilds the query string preserving active filters, then redirects.
 */
export async function searchProducts(formData: FormData) {
  const q        = formData.get('q')?.toString().trim()
  const category = formData.get('category')?.toString()
  const sort     = formData.get('sort')?.toString()
  const minPrice = formData.get('minPrice')?.toString()
  const maxPrice = formData.get('maxPrice')?.toString()

  const params = new URLSearchParams()
  if (q)        params.set('q',        q)
  if (category) params.set('category', category)
  if (sort)     params.set('sort',     sort)
  if (minPrice) params.set('minPrice', minPrice)
  if (maxPrice) params.set('maxPrice', maxPrice)
  // always reset to page 1 on new search
  params.delete('page')

  redirect(`/products${params.size ? `?${params}` : ''}`)
}
