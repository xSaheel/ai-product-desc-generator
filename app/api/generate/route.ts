import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/user';

export async function POST(req: NextRequest) {
  let userId: string | null = null;
  let user: { id: number } | null = null;
  let body: Record<string, unknown> | null = null;

  try {
    // Check authentication
    const authResult = await auth();
    userId = authResult.userId;
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    body = await req.json();
    const { productName, productType, targetAudience, features, tone } = body as {
      productName: string;
      productType?: string;
      targetAudience?: string;
      features?: string;
      tone?: string;
    };

    // Validate required fields
    if (!productName) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      );
    }

    // Ensure user exists in our database
    user = await getOrCreateUser(userId);

    // Create the prompt for product description generation
    const prompt = `Generate a compelling product description for the following product:

Product Name: ${productName}
Product Type: ${productType || 'General'}
Target Audience: ${targetAudience || 'General consumers'}
Features: ${features || 'Not specified'}
Tone: ${tone || 'Professional and engaging'}

Please create a professional, engaging product description that:
- Highlights the key benefits and features
- Uses persuasive language
- Is appropriate for e-commerce
- Is between 100-200 words
- Includes relevant keywords naturally
- Ends with a call-to-action
- Matches the specified tone: ${tone || 'Professional and engaging'}

Product Description:`;

    console.log('Sending request to Hugging Face with prompt:', prompt.substring(0, 100) + '...');

    // For now, let's use a mock response to test the flow
    // TODO: Fix Hugging Face integration
    const mockDescription = `Discover the amazing ${productName}! This exceptional product is designed with ${targetAudience || 'consumers'} in mind, offering ${features || 'outstanding features'} that set it apart from the competition.

With its ${productType || 'innovative design'}, this product delivers ${tone === 'Professional and engaging' ? 'professional quality' : 'exceptional performance'} that exceeds expectations. Whether you're looking for ${features || 'reliable functionality'} or ${productType || 'superior craftsmanship'}, this product has you covered.

Experience the difference that quality makes. Don't miss out on this incredible opportunity to own a product that truly delivers. Order now and see why ${productName} is the choice of discerning ${targetAudience || 'customers'} everywhere!`;

    console.log('Using mock description for testing');

    const generatedDescription = mockDescription;

    if (!generatedDescription) {
      return NextResponse.json(
        { error: 'Failed to generate description' },
        { status: 500 }
      );
    }

    // Clean up the generated text (remove the prompt part)
    const cleanDescription = generatedDescription;

    console.log('Clean description length:', cleanDescription.length);

    // Save to database
    const savedDescription = await prisma.generatedDescription.create({
      data: {
        productName,
        productType,
        targetAudience,
        features,
        tone,
        description: cleanDescription,
        userId: user.id,
      },
    });

    return NextResponse.json({
      id: savedDescription.id,
      description: cleanDescription,
      productName,
      productType,
      targetAudience,
      features,
      tone,
      generatedAt: savedDescription.createdAt instanceof Date ? savedDescription.createdAt.toISOString() : savedDescription.createdAt,
    });

  } catch (error) {
    console.error('Error generating product description:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown',
    });
    
    // Log additional context
    console.error('Request context:', {
      productName: body?.productName,
      userId: userId,
      hasUser: !!user,
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to generate product description',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 