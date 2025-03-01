'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ImageIcon, Tag } from 'lucide-react';
import { checkoutAction } from '@/lib/payments/actions';

/**
 * ProductCard component
 * 
 * Displays a product card with image, name, description, price, and buy now button
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Product ID
 * @param {string} props.name - Product name
 * @param {string} props.description - Product description
 * @param {string} props.defaultPriceId - Default price ID
 * @param {string[]} props.images - Product images
 * @param {number|null} props.unitAmount - Unit amount
 * @param {string|null} props.currency - Currency
 * @param {Record<string, string>|null} props.metadata - Metadata
 * @param {string|null} props.taxCode - Tax code
 */
export function ProductCard({
  id,
  name,
  description,
  defaultPriceId,
  images,
  unitAmount,
  currency,
  metadata,
  taxCode,
}: {
  id: string;
  name: string;
  description: string;
  defaultPriceId: string;
  images: string[];
  unitAmount: number | null;
  currency: string | null;
  metadata: Record<string, string> | null;
  taxCode?: string | null;
}) {
  const [imageError, setImageError] = useState(false);
  
  // Generate a placeholder image URL based on the product name
  const imageUrl = !imageError && images && images.length > 0 
    ? images[0] 
    : `https://source.unsplash.com/400x300/?${encodeURIComponent(name.toLowerCase())}`;
  
  // Format price if available
  const formattedPrice = unitAmount 
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD',
      }).format(unitAmount / 100)
    : null;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col">
      <div className="relative h-48 w-full bg-gray-100">
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">{name}</p>
            </div>
          </div>
        ) : (
          <Image 
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        )}
        
        {taxCode === 'txcd_99999999' && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <Tag className="h-3 w-3 mr-1" />
            Tangible Good
          </div>
        )}
      </div>
      <div className="p-6 flex-grow">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{name}</h2>
        <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
        {formattedPrice && (
          <p className="text-lg font-medium text-orange-600">{formattedPrice}</p>
        )}
        {metadata && Object.keys(metadata).length > 0 && (
          <div className="mt-3 space-y-1">
            {Object.entries(metadata).map(([key, value]) => (
              <p key={key} className="text-sm text-gray-500">
                <span className="font-medium">{key}:</span> {value}
              </p>
            ))}
          </div>
        )}
        
        {taxCode && taxCode !== 'txcd_99999999' && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 flex items-center">
              <Tag className="h-3 w-3 mr-1" />
              Tax Code: {taxCode}
            </p>
          </div>
        )}
      </div>
      <div className="px-6 pb-6">
        {defaultPriceId ? (
          <form action={checkoutAction}>
            <input type="hidden" name="priceId" value={defaultPriceId} />
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Buy Now
            </Button>
          </form>
        ) : (
          <Button disabled className="w-full bg-gray-300 text-gray-600 cursor-not-allowed">
            Not Available
          </Button>
        )}
      </div>
    </div>
  );
}
