import { getStripeProducts } from '@/lib/payments/stripe';
import { ProductCard } from './product-card';
import Link from 'next/link';

// Revalidate products data every hour
export const revalidate = 3600;

export default async function ProductsPage() {
  const products = await getStripeProducts();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <Link 
            href="/dashboard/products/admin" 
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Admin Settings
          </Link>
        </div>
        <p className="text-gray-600">Browse and purchase our available tangible goods</p>
        <p className="text-sm text-gray-500 mt-2">
          Showing products with tax code: txcd_99999999 (General - Tangible Goods)
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard 
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description || ''}
              defaultPriceId={product.defaultPriceId || ''}
              images={product.images || []}
              unitAmount={product.unitAmount || null}
              currency={product.currency || null}
              metadata={product.metadata}
              taxCode={product.taxCode as string}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No products available at the moment.</p>
            <p className="text-sm text-gray-400 mt-2">
              Try adding products with tax code 'txcd_99999999' in your Stripe dashboard.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
