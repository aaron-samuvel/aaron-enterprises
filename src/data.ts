import { machineCategories, machineProducts } from './machineProducts'

export interface Category { name: string; detail: string; image: string }
export interface Product { id: string; name: string; brand: string; sku: string; price: number; gst: number; image: string; category: string; description: string; specs: Record<string,string>; stock: number; availability: 'In stock'|'Low stock'|'Out of stock'; featured?: boolean; createdAt: string }

export const categories: Category[] = machineCategories
export const products: Product[] = machineProducts
