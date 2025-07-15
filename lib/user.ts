import { prisma } from './prisma';

export async function getOrCreateUser(clerkUserId: string, userData?: { email?: string; name?: string }) {
  try {
    // First, try to find user by Clerk ID (if we had stored it)
    // Since we don't store Clerk ID, we'll use a different approach
    
    // Try to find existing user by email
    let user = null;
    if (userData?.email) {
      user = await prisma.user.findUnique({
        where: {
          email: userData.email,
        },
      });
    }
    
    // If no user found by email, try to find by a generated email pattern
    if (!user) {
      const generatedEmail = `user-${clerkUserId}@example.com`;
      user = await prisma.user.findFirst({
        where: {
          email: generatedEmail,
        },
      });
    }
    
    // If still no user found, create a new one
    if (!user) {
      const email = userData?.email || `user-${clerkUserId}@example.com`;
      const name = userData?.name || 'User';
      
      user = await prisma.user.create({
        data: {
          email,
          name,
        },
      });
      
      console.log('Created new user:', { id: user.id, email: user.email });
    } else {
      console.log('Found existing user:', { id: user.id, email: user.email });
    }

    return user;
  } catch (error) {
    console.error('Error getting or creating user:', error);
    
    // If it's a unique constraint error, try to find the existing user
    if (error instanceof Error && error.message.includes('Unique constraint failed')) {
      console.log('Unique constraint failed, trying to find existing user...');
      
      try {
        const email = userData?.email || `user-${clerkUserId}@example.com`;
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });
        
        if (existingUser) {
          console.log('Found existing user after constraint error:', { id: existingUser.id, email: existingUser.email });
          return existingUser;
        }
      } catch (findError) {
        console.error('Error finding existing user after constraint error:', findError);
      }
    }
    
    throw error;
  }
} 