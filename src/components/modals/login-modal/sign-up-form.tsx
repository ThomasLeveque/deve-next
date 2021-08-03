import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import Button from '@components/elements/button';
import TextInput from '@components/elements/text-input';

import { useAuth } from '@hooks/auth/useAuth';

import { SignUpFormData } from '@data-types/user.type';

import { signUpSchema } from '@utils/form-schemas';
import { formatError } from '@utils/format-string';

import { loginStep } from './login-modal';

interface SignUpFormProps {
  setStep: (step: loginStep) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const { signUpWithEmail } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit = useCallback(async ({ displayName, email, password }: SignUpFormData) => {
    setLoading(true);
    await signUpWithEmail(email, password, { displayName }).catch((err) => {
      toast.error(formatError(err));
      console.error(err);
      setLoading(false);
    });
    // Do not setLoading(false) because Signup will unmount this component.
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        className="mb-6"
        id="displayName"
        label="Username"
        placeholder="Your username"
        {...register('displayName')}
        errorText={errors.displayName?.message}
      />
      <TextInput
        className="mb-6"
        id="email"
        label="Email"
        placeholder="your@email.com"
        {...register('email')}
        errorText={errors.email?.message}
      />
      <TextInput
        className="mb-8"
        id="password"
        label="Password"
        type="password"
        placeholder="123456"
        {...register('password')}
        errorText={errors.password?.message}
      />
      <div className="flex justify-end space-x-4">
        <Button text="Back" theme="gray" onClick={() => props.setStep(loginStep.LOGIN_SELECTION)} />
        <Button theme="secondary" text="Continue" type="submit" loading={loading} />
      </div>
    </form>
  );
};

export default SignUpForm;
