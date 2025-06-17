import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { openai } from '@/lib/openai';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { productName, productType, targetAudience, features, tone } = body;

    // Validate required fields
    if (!productName) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      );
    }

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

    // Generate the description using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional product copywriter who creates compelling, SEO-friendly product descriptions for e-commerce websites.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const generatedDescription = completion.choices[0]?.message?.content;

    if (!generatedDescription) {
      return NextResponse.json(
        { error: 'Failed to generate description' },
        { status: 500 }
      );
    }

    // Save to database
    const savedDescription = await prisma.generatedDescription.create({
      data: {
        productName,
        productType,
        targetAudience,
        features,
        tone,
        description: generatedDescription,
        userId: parseInt(userId),
      },
    });

    return NextResponse.json({
      id: savedDescription.id,
      description: generatedDescription,
      productName,
      productType,
      targetAudience,
      features,
      tone,
      generatedAt: savedDescription.createdAt,
    });

  } catch (error) {
    console.error('Error generating product description:', error);
    return NextResponse.json(
      { error: 'Failed to generate product description' },
      { status: 500 }
    );
  }
} 