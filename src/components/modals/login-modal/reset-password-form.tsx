import { yupResolver } from '@hookform/resolvers/yup';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import Button from '@components/elements/button';
import TextInput from '@components/elements/text-input';

import { ResetPasswordFormData } from '@data-types/user.type';

import { resetPasswordSchema } from '@utils/form-schemas';
import { formatError } from '@utils/format-string';
import { auth } from '@utils/init-firebase';

import { loginStep } from './login-modal';

interface ResetPasswordFormProps {
  setStep: (step: loginStep) => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = useCallback(async ({ email }: ResetPasswordFormData) => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast.success('An email have been send to you to reset your password.');
      props.setStep(loginStep.LOGIN_WITH_EMAIL);
      // Do not setLoading(false) because reset password will unmount this component.
    } catch (err) {
      toast.error(formatError(err as Error));
      console.error(err);
      setLoading(false);
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        className="mb-8"
        id="email"
        label="Email"
        placeholder="your@email.com"
        {...register('email')}
        errorText={errors.email?.message}
      />
      <div className="flex justify-end space-x-4">
        <Button
          text="Back"
          theme="gray"
          onClick={() => props.setStep(loginStep.LOGIN_WITH_EMAIL)}
        />
        <Button theme="secondary" text="Continue" type="submit" loading={loading} />
      </div>
    </form>
  );
};

export default ResetPasswordForm;
