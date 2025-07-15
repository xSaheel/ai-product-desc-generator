import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/user';

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Ensure user exists in our database
    const user = await getOrCreateUser(userId);

    // Get query parameters for pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    console.log('Fetching descriptions for userId:', user.id);

    // Fetch descriptions for the user
    const descriptions = await prisma.generatedDescription.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    // Get total count for pagination
    const total = await prisma.generatedDescription.count({
      where: {
        userId: user.id,
      },
    });

    console.log(`Found ${descriptions.length} descriptions out of ${total} total`);
    console.log('Sample description date:', descriptions[0]?.createdAt);

    return NextResponse.json({
      descriptions: descriptions.map(desc => ({
        ...desc,
        createdAt: desc.createdAt instanceof Date ? desc.createdAt.toISOString() : desc.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Error fetching descriptions:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: 'Failed to fetch descriptions', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 