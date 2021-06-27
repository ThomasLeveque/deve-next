import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Button from '@components/elements/button';
import TextInput from '@components/elements/text-input';

import { auth } from '@libs/firebase';

import { loginStep } from './login-modal';

interface FormData {
  email: string;
}

const schema = yup.object().shape({
  email: yup.string().email().required().max(255),
});

interface ResetPasswordFormProps {
  setStep: (step: loginStep) => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ email }: FormData) => {
    try {
      setLoading(true);
      await auth.sendPasswordResetEmail(email);
      props.setStep(loginStep.LOGIN_WITH_EMAIL);
      // Do not setLoading(false) because Signin will unmount this component.
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        className="mb-8"
        id="email"
        label="Email"
        placeholder="your@email.com"
        {...register('email')}
        error={errors.email}
      />
      <div className="flex justify-end">
        <Button
          text="Back"
          className="bg-gray-100 text-black"
          onClick={() => props.setStep(loginStep.LOGIN_WITH_EMAIL)}
        />
        <Button text="Continue" className="ml-5" type="submit" loading={loading} />
      </div>
    </form>
  );
};

export default ResetPasswordForm;
