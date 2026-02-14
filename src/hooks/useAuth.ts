import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSignIn, useClerk, useUser } from '@clerk/clerk-react';
import { useNavigate } from '@tanstack/react-router';
import { signInWithGoogle } from '../lib/auth';

export function useGoogleSignIn() {
  const { signIn } = useSignIn();
  const clerk = useClerk();
  const { user, isSignedIn } = useUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ['auth', 'signIn'],
    mutationFn: async () => {
      // Check if user is already signed in
      if (isSignedIn && user) {
        console.log('User already signed in, redirecting to dashboard...');
        navigate({ to: '/dashboard' });
        return { success: true, alreadySignedIn: true };
      }

      if (!signIn) {
        throw new Error('SignIn not loaded');
      }
      await signInWithGoogle(signIn, clerk);
      return { success: true, alreadySignedIn: false };
    },
    onSuccess: (data) => {
      // Save session data to query cache
      if (user && !data.alreadySignedIn) {
        queryClient.setQueryData(['session'], {
          userId: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          signedInAt: new Date().toISOString(),
        });
      }
    },
    onError: (error: any) => {
      // Handle "already signed in" error
      if (error.message?.includes('already signed in')) {
        console.log('Already signed in error caught, redirecting...');
        navigate({ to: '/dashboard' });
      } else {
        console.error('Sign in mutation error:', error);
      }
    },
  });
}

export function useSession() {
  const { user, isSignedIn, isLoaded } = useUser();
  const queryClient = useQueryClient();

  // Sync Clerk session to TanStack Query cache
  if (isLoaded && isSignedIn && user) {
    queryClient.setQueryData(['session'], {
      userId: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      imageUrl: user.imageUrl,
      lastSynced: new Date().toISOString(),
    });
  }

  return queryClient.getQueryData(['session']);
}
