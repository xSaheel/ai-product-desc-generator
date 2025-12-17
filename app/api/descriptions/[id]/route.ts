import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/user';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Get the description ID from params
    const { id } = await params;
    const descriptionId = parseInt(id);
    if (isNaN(descriptionId)) {
      return NextResponse.json(
        { error: 'Invalid description ID' },
        { status: 400 }
      );
    }

    // Check if the description exists and belongs to the user
    const description = await prisma.generatedDescription.findFirst({
      where: {
        id: descriptionId,
        userId: user.id,
      },
    });

    if (!description) {
      return NextResponse.json(
        { error: 'Description not found' },
        { status: 404 }
      );
    }

    // Delete the description
    await prisma.generatedDescription.delete({
      where: {
        id: descriptionId,
      },
    });

    return NextResponse.json(
      { message: 'Description deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting description:', error);
    return NextResponse.json(
      { error: 'Failed to delete description', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

