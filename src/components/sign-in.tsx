import React, { useState } from 'react';

import { useAuth } from '@hooks/useAuth';

const SignIn: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { signInWithEmail } = useAuth();

  const handleSignInWithEmail = async (): Promise<void> => {
    try {
      setLoading(true);
      await signInWithEmail(email, password);
      // Do not setLoading(false) because Signin will unmount this component.
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center flex-col mb-8">
      <h2 className="text-3xl text-center mb-4">Sign in</h2>
      <input
        className="border-black border-2"
        value={email}
        placeholder="Email"
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        className="border-black border-2"
        value={password}
        placeholder="Password"
        type="password"
        onChange={(event) => setPassword(event.target.value)}
      />
      <button className="bg-black text-white p-2" onClick={handleSignInWithEmail}>
        {loading ? 'loading...' : 'Sign in with email'}
      </button>
    </div>
  );
};

export default SignIn;
