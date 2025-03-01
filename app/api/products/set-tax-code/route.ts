import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth/auth-options';
import { setProductTaxCode } from '@/lib/payments/stripe';

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is an admin
    const userRole = session.user?.role;
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Parse request body
    const { productId, taxCode } = await req.json();

    // Validate inputs
    if (!productId || !taxCode) {
      return NextResponse.json(
        { error: 'Product ID and tax code are required' },
        { status: 400 }
      );
    }

    // Update product tax code
    const updatedProduct = await setProductTaxCode(productId, taxCode);

    return NextResponse.json({
      success: true,
      product: {
        id: updatedProduct.id,
        name: updatedProduct.name,
        tax_code: updatedProduct.tax_code
      }
    });
  } catch (error) {
    console.error('Error setting product tax code:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      },
      { status: 500 }
    );
  }
}
