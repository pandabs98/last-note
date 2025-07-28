'use client';

import { SignIn, useUser } from '@clerk/nextjs';

export default function Home() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SignIn />
      </div>
    );
  }

  return <div className="p-4 text-center">Welcome!</div>;
}
