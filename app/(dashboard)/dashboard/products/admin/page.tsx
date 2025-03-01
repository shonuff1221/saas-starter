'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setProductTaxCode } from '@/lib/payments/stripe';

export default function ProductAdminPage() {
  const [productId, setProductId] = useState('');
  const [taxCode, setTaxCode] = useState('txcd_99999999');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productId || !taxCode) {
      setStatus({
        type: 'error',
        message: 'Please provide both Product ID and Tax Code',
      });
      return;
    }

    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/products/set-tax-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, taxCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update product tax code');
      }

      setStatus({
        type: 'success',
        message: `Successfully updated tax code for product ${data.product.name}`,
      });
      
      // Reset form
      setProductId('');
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Product Tax Code Admin</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="productId">Product ID</Label>
            <Input
              id="productId"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="prod_..."
              className="mt-1"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              The Stripe Product ID (starts with &quot;prod_&quot;)
            </p>
          </div>
          
          <div>
            <Label htmlFor="taxCode">Tax Code</Label>
            <Input
              id="taxCode"
              value={taxCode}
              onChange={(e) => setTaxCode(e.target.value)}
              placeholder="txcd_99999999"
              className="mt-1"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              The Stripe Tax Code (default: txcd_99999999 for tangible goods)
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Tax Code'}
          </Button>
          
          {status.type && (
            <div className={`p-3 rounded-md mt-4 ${
              status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {status.message}
            </div>
          )}
        </form>
      </div>
      
      <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-medium mb-4">About Tax Codes</h2>
        <p className="text-gray-600 mb-2">
          Tax codes help determine the tax rates applied to your products. For physical goods, use:
        </p>
        <ul className="list-disc pl-5 text-gray-600 space-y-1">
          <li><strong>txcd_99999999</strong> - General - Tangible Goods</li>
          <li><strong>txcd_20030000</strong> - Books</li>
          <li><strong>txcd_31000000</strong> - Clothing</li>
          <li><strong>txcd_40030000</strong> - Food & Groceries</li>
        </ul>
        <p className="text-gray-600 mt-4">
          <a 
            href="https://stripe.com/docs/tax/tax-codes" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View all Stripe tax codes →
          </a>
        </p>
      </div>
    </div>
  );
}
