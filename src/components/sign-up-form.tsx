import React, { useState } from 'react';

import { useAuth } from '@hooks/useAuth';

const SignUp: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { signUpWithEmail } = useAuth();

  const handleSignUpWithEmail = async (): Promise<void> => {
    try {
      setLoading(true);
      await signUpWithEmail(email, password, { displayName });
      // Do not setLoading(false) because Signup will unmount this component.
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center flex-col mb-8">
      <h2 className="text-3xl text-center mb-4">Sign up</h2>
      <input
        className="border-black border-2"
        value={displayName}
        placeholder="DisplayName"
        onChange={(event) => setDisplayName(event.target.value)}
      />
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
      <button className="bg-black text-white p-2" onClick={handleSignUpWithEmail}>
        {loading ? 'loading...' : 'Sign up with email'}
      </button>
    </div>
  );
};

export default SignUp;
