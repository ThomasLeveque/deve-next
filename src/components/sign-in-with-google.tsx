import React, { useState } from 'react';

import { useAuth } from '@hooks/useAuth';

const SignInWithGoogle: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { signInWithGoogle } = useAuth();

  const handleSignInWithGoogle = async (): Promise<void> => {
    try {
      setLoading(true);
      await signInWithGoogle();
      // Do not setLoading(false) because Signin with google will unmount this component.
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center flex-col mb-8">
      <h2 className="text-3xl text-center mb-4">Sign in with google</h2>
      <button className="bg-black text-white p-2" onClick={handleSignInWithGoogle}>
        {loading ? 'loading...' : 'Sign in with google'}
      </button>
    </div>
  );
};

export default SignInWithGoogle;
