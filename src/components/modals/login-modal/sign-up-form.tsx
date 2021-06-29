import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Button from '@components/elements/button';
import TextInput from '@components/elements/text-input';

import { useAuth } from '@hooks/useAuth';

import { loginStep } from './login-modal';

interface FormData {
  displayName: string;
  email: string;
  password: string;
}

const schema = yup.object().shape({
  displayName: yup.string().required().max(255),
  email: yup.string().email().required().max(255),
  password: yup.string().required().min(6).max(255),
});

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
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ displayName, email, password }: FormData) => {
    setLoading(true);
    await signUpWithEmail(email, password, { displayName }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
    // Do not setLoading(false) because Signup will unmount this component.
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        className="mb-6"
        id="displayName"
        label="Username"
        placeholder="Your username"
        {...register('displayName')}
        error={errors.displayName}
      />
      <TextInput
        className="mb-6"
        id="email"
        label="Email"
        placeholder="your@email.com"
        {...register('email')}
        error={errors.email}
      />
      <TextInput
        className="mb-8"
        id="password"
        label="Password"
        type="password"
        placeholder="123456"
        {...register('password')}
        error={errors.password}
      />
      <div className="flex justify-end">
        <Button
          text="Back"
          className="!bg-gray-100 text-black"
          onClick={() => props.setStep(loginStep.LOGIN_SELECTION)}
        />
        <Button text="Continue" className="ml-5" type="submit" loading={loading} />
      </div>
    </form>
  );
};

export default SignUpForm;
