import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/user';
import { hf } from '@/lib/huggingface';

// Function to create enhanced description from AI-generated base text
function createEnhancedDescription(
  baseText: string, 
  productName: string, 
  productType?: string, 
  targetAudience?: string, 
  features?: string, 
  tone?: string
): string {
  // Get random enhancement patterns to add variety
  const enhancementPatterns = [
    {
      prefix: `${baseText.endsWith('.') ? '' : '.'} `,
      middle: `This ${productType || 'innovative product'} is specifically designed for ${targetAudience || 'discerning customers'} who value ${features || 'quality and performance'}.`,
      suffix: ` ${getCallToAction(tone)} Experience the ${productName} advantage today.`
    },
    {
      prefix: `${baseText.endsWith('.') ? '' : '.'} `,
      middle: `Featuring ${features || 'premium construction'}, the ${productName} delivers ${getToneAdjectives(tone)} that ${targetAudience || 'customers'} have come to expect.`,
      suffix: ` ${getCallToAction(tone)} Join thousands who've made the smart choice.`
    },
    {
      prefix: `${baseText.endsWith('.') ? '' : '.'} `,
      middle: `Perfect for ${targetAudience || 'anyone seeking quality'}, this ${productType || 'exceptional product'} combines ${features || 'innovative design'} with ${getToneAdjectives(tone)}.`,
      suffix: ` ${getCallToAction(tone)} Discover why the ${productName} stands above the rest.`
    }
  ];

  const randomPattern = enhancementPatterns[Math.floor(Math.random() * enhancementPatterns.length)];
  
  return improveTextQuality(baseText + randomPattern.prefix + randomPattern.middle + randomPattern.suffix);
}

// Helper function to get tone-appropriate adjectives
function getToneAdjectives(tone?: string): string {
  const adjectives = {
    'Professional and engaging': 'exceptional performance and reliability',
    'Casual and friendly': 'easy-to-use functionality and great value',
    'Luxury and premium': 'unparalleled luxury and sophisticated elegance',
    'Technical and detailed': 'precision engineering and advanced specifications',
    'Fun and playful': 'exciting features and delightful experiences',
    'Urgent and action-oriented': 'immediate benefits and outstanding results'
  };
  
  return adjectives[tone as keyof typeof adjectives] || 'outstanding quality and performance';
}

// Helper function to get tone-appropriate call-to-action
function getCallToAction(tone?: string): string {
  const ctas = {
    'Professional and engaging': 'Make the professional choice.',
    'Casual and friendly': 'Why not give it a try?',
    'Luxury and premium': 'Indulge in luxury you deserve.',
    'Technical and detailed': 'Upgrade to superior technology.',
    'Fun and playful': 'Join the fun today!',
    'Urgent and action-oriented': 'Don\'t wait - act now!'
  };
  
  return ctas[tone as keyof typeof ctas] || 'Make the smart choice.';
}

// Create intelligent fallback with high variation
function createIntelligentFallback(
  productName: string,
  productType?: string,
  targetAudience?: string,
  features?: string,
  tone?: string
): string {
  // Create highly varied sentence structures and vocabulary
  const openings = [
    `Meet the ${productName}`,
    `Introducing the ${productName}`,
    `Discover the ${productName}`,
    `Experience the ${productName}`,
    `The ${productName} represents`,
    `Elevate your expectations with the ${productName}`,
    `Transform your world with the ${productName}`,
    `Redefine excellence with the ${productName}`
  ];

  const productDescriptors = [
    `a ${tone === 'Luxury and premium' ? 'luxurious' : 'groundbreaking'} ${productType || 'solution'}`,
    `an ${tone === 'Technical and detailed' ? 'engineered' : 'innovative'} ${productType || 'product'}`,
    `a ${tone === 'Fun and playful' ? 'delightful' : 'sophisticated'} ${productType || 'creation'}`,
    `the ultimate ${productType || 'innovation'}`,
    `a revolutionary ${productType || 'breakthrough'}`,
    `an exceptional ${productType || 'masterpiece'}`
  ];

  const audienceConnectors = [
    `crafted specifically for ${targetAudience || 'discerning individuals'}`,
    `designed with ${targetAudience || 'quality-conscious users'} in mind`,
    `tailored to meet the needs of ${targetAudience || 'demanding customers'}`,
    `built for ${targetAudience || 'those who appreciate excellence'}`,
    `engineered for ${targetAudience || 'professionals who demand more'}`
  ];

  const featureHighlights = [
    `showcasing ${features || 'premium craftsmanship'}`,
    `featuring ${features || 'cutting-edge technology'}`,
    `delivering ${features || 'unmatched performance'}`,
    `incorporating ${features || 'innovative design elements'}`,
    `boasting ${features || 'superior quality features'}`
  ];

  const benefits = [
    `${tone === 'Luxury and premium' ? 'unparalleled sophistication' : 'exceptional value'}`,
    `${tone === 'Technical and detailed' ? 'precision performance' : 'outstanding reliability'}`,
    `${tone === 'Fun and playful' ? 'delightful user experiences' : 'superior functionality'}`,
    `${tone === 'Casual and friendly' ? 'effortless enjoyment' : 'professional results'}`,
    `${tone === 'Urgent and action-oriented' ? 'immediate impact' : 'lasting satisfaction'}`
  ];

  const closingStatements = [
    `Every detail of the ${productName} has been meticulously considered`,
    `The ${productName} sets new standards in ${productType || 'its category'}`,
    `With the ${productName}, compromise is never an option`,
    `The ${productName} represents the pinnacle of ${productType || 'innovation'}`,
    `Experience why the ${productName} leads the industry`
  ];

  // Randomly select components to ensure high variation
  const randomOpening = openings[Math.floor(Math.random() * openings.length)];
  const randomDescriptor = productDescriptors[Math.floor(Math.random() * productDescriptors.length)];
  const randomConnector = audienceConnectors[Math.floor(Math.random() * audienceConnectors.length)];
  const randomFeature = featureHighlights[Math.floor(Math.random() * featureHighlights.length)];
  const randomBenefit = benefits[Math.floor(Math.random() * benefits.length)];
  const randomClosing = closingStatements[Math.floor(Math.random() * closingStatements.length)];
  const randomCTA = getCallToAction(tone);

  // Create varied paragraph structures
  const structures = [
    `${randomOpening} - ${randomDescriptor} ${randomConnector}. ${randomFeature}, it delivers ${randomBenefit} that exceeds expectations. ${randomClosing} to ensure ${tone === 'Luxury and premium' ? 'luxury' : 'quality'} in every aspect. ${randomCTA} Experience the ${productName} difference.`,
    
    `${randomFeature.charAt(0).toUpperCase() + randomFeature.slice(1)}, the ${productName} stands as ${randomDescriptor} ${randomConnector}. This remarkable ${productType || 'product'} provides ${randomBenefit} through its ${tone === 'Technical and detailed' ? 'advanced engineering' : 'thoughtful design'}. ${randomClosing}. ${randomCTA} Join satisfied customers worldwide.`,
    
    `${randomOpening} where ${randomFeature} meets ${randomBenefit}. ${randomConnector.charAt(0).toUpperCase() + randomConnector.slice(1)}, this ${productType || 'exceptional offering'} redefines what's possible. ${randomClosing}, making the ${productName} the ${tone === 'Luxury and premium' ? 'luxury choice' : 'smart choice'} for ${targetAudience || 'quality-conscious individuals'}. ${randomCTA}`
  ];

  const selectedStructure = structures[Math.floor(Math.random() * structures.length)];
  
  return improveTextQuality(selectedStructure);
}

// Post-processing function to improve text quality
function improveTextQuality(text: string): string {
  return text
    // Fix spacing issues
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,!?])/g, '$1')
    .replace(/\s+([;:])/g, ' $1 ')
    
    // Fix capitalization
    .replace(/^[a-z]/, (letter) => letter.toUpperCase())
    .replace(/([.!?])\s*([a-z])/g, (match, punct, letter) => `${punct} ${letter.toUpperCase()}`)
    
    // Fix common grammatical issues
    .replace(/\b(i)\b/g, 'I') // Capitalize "i" when it should be "I"
    .replace(/\b(its)\s+([a-z])/g, (match, its, next) => {
      // Fix "its" vs "it's" - if followed by a verb, it's likely "it's"
      const verbs = ['is', 'was', 'will', 'has', 'had', 'does', 'did', 'can', 'could', 'should', 'would'];
      return verbs.includes(next) ? `it's ${next}` : match;
    })
    
    // Fix common punctuation issues
    .replace(/([a-z])\s*\.\s*([A-Z])/g, '$1. $2') // Ensure space after periods
    .replace(/([a-z])\s*,\s*([a-z])/g, '$1, $2') // Ensure space after commas
    
    // Fix common word issues
    .replace(/\b(youre)\b/g, "you're")
    .replace(/\b(dont)\b/g, "don't")
    .replace(/\b(cant)\b/g, "can't")
    .replace(/\b(wont)\b/g, "won't")
    .replace(/\b(shouldnt)\b/g, "shouldn't")
    .replace(/\b(couldnt)\b/g, "couldn't")
    .replace(/\b(havent)\b/g, "haven't")
    .replace(/\b(hasnt)\b/g, "hasn't")
    .replace(/\b(isnt)\b/g, "isn't")
    .replace(/\b(arent)\b/g, "aren't")
    
    // Fix common spelling issues
    .replace(/\b(recieve)\b/g, "receive")
    .replace(/\b(seperate)\b/g, "separate")
    .replace(/\b(occured)\b/g, "occurred")
    .replace(/\b(occuring)\b/g, "occurring")
    .replace(/\b(accomodate)\b/g, "accommodate")
    .replace(/\b(accomodation)\b/g, "accommodation")
    
    // Ensure proper sentence endings
    .replace(/([a-z])\s*$/g, '$1.')
    
    // Clean up multiple spaces and trim
    .replace(/\s+/g, ' ')
    .trim();
}

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

    console.log('Generating AI description for:', productName);

    // Try multiple models with different approaches
    const models = [
      "microsoft/DialoGPT-large",
      "gpt2-large", 
      "facebook/blenderbot-400M-distill",
      "microsoft/DialoGPT-medium",
      "gpt2"
    ];

    let finalDescription = null;
    let modelUsed = null;

    // Try each model until we get a good result
    for (const model of models) {
      try {
        console.log(`Trying model: ${model}`);
        
        // Create a simple, effective prompt based on the model
        let simplePrompt = '';
        if (model.includes('DialoGPT')) {
          simplePrompt = `Human: Write a ${tone || 'professional'} product description for "${productName}". It's ${productType || 'a product'} for ${targetAudience || 'customers'}. Features: ${features || 'high quality'}.\nBot: `;
        } else if (model.includes('blenderbot')) {
          simplePrompt = `Describe this product professionally: ${productName} (${productType || 'product'}) with features: ${features || 'quality features'} for ${targetAudience || 'customers'}`;
        } else {
          simplePrompt = `Product: ${productName}\nCategory: ${productType || 'General'}\nFeatures: ${features || 'High quality'}\nFor: ${targetAudience || 'Everyone'}\nTone: ${tone || 'Professional'}\n\nDescription: `;
        }

        const response = await hf.textGeneration({
          model: model,
          inputs: simplePrompt,
          parameters: {
            max_new_tokens: model.includes('large') ? 100 : 80,
            temperature: 0.8,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false,
            repetition_penalty: 1.15,
            pad_token_id: 50256,
          },
        });

        let generatedText = response.generated_text?.trim();
        
        if (!generatedText || generatedText.length < 30) {
          console.log(`Model ${model} generated insufficient content`);
          continue;
        }

        // Clean up based on model type
        if (model.includes('DialoGPT')) {
          // Remove conversation markers
          generatedText = generatedText
            .replace(/Human:|Bot:|Assistant:|User:/g, '')
            .replace(/^[:\-\s]+/, '')
            .trim();
        }

        // Clean common prompt remnants
        generatedText = generatedText
          .replace(/^(Description:|Product:|Features:)/i, '')
          .replace(/^\s*[:\-]+\s*/, '')
          .trim();

        // Apply text quality improvements
        generatedText = improveTextQuality(generatedText);

        // Check if we got a decent result
        if (generatedText.length >= 30 && 
            !generatedText.toLowerCase().includes('i cannot') && 
            !generatedText.toLowerCase().includes('i\'m not able') &&
            generatedText.toLowerCase().includes(productName.toLowerCase().split(' ')[0])) {
          
          // Enhance the generated text with context
          const enhancedDescription = createEnhancedDescription(
            generatedText, 
            productName, 
            productType, 
            targetAudience, 
            features, 
            tone
          );
          
          finalDescription = enhancedDescription;
          modelUsed = model;
          break;
        }

        console.log(`Model ${model} didn't produce suitable content, trying next...`);

      } catch (modelError) {
        console.error(`Model ${model} failed:`, modelError);
        continue;
      }
    }

    // If we got a good AI-generated description, use it
    if (finalDescription) {
      console.log(`Successfully generated description using ${modelUsed}:`, finalDescription.substring(0, 100) + '...');

      const savedDescription = await prisma.generatedDescription.create({
        data: {
          productName,
          productType,
          targetAudience,
          features,
          tone,
          description: finalDescription,
          userId: user.id,
        },
      });

      return NextResponse.json({
        id: savedDescription.id,
        description: finalDescription,
        productName,
        productType,
        targetAudience,
        features,
        tone,
        generatedAt: savedDescription.createdAt instanceof Date ? savedDescription.createdAt.toISOString() : savedDescription.createdAt,
      });
    }

    // If all AI models failed, use intelligent fallback with high variation
    console.log('All AI models failed, creating intelligent fallback description');
    
    const fallbackDescription = createIntelligentFallback(productName, productType, targetAudience, features, tone);
    
    const savedDescription = await prisma.generatedDescription.create({
      data: {
        productName,
        productType,
        targetAudience,
        features,
        tone,
        description: fallbackDescription,
        userId: user.id,
      },
    });

    return NextResponse.json({
      id: savedDescription.id,
      description: fallbackDescription,
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