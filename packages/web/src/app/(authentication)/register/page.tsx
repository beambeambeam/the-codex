'use client';

import Link from 'next/link';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import RegisterForm from '@/app/(authentication)/register/form';
import { Logo } from '@/components/icon';

function RegisterPage() {
  return (
    <div className="grid h-screen grid-cols-1 lg:grid-cols-2">
      <div className="hidden h-full flex-col items-center justify-center lg:flex">
        <div>
          <Logo size={250} />
          <h1 className="text-3xl">Your&apos;s Agentic Ai Librarians</h1>
        </div>
      </div>
      <div className="flex h-full flex-col items-center justify-center gap-2.5">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">
              🤗 Create an Account and Join us today.
            </CardTitle>
            <CardDescription className="text-sm">
              Create your account and start managing your data with TheCodex,
              your intelligent library assistant.
            </CardDescription>
          </CardHeader>
          <RegisterForm
            defaultValues={{
              username: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            onSubmit={function (values: {
              username: string;
              email: string;
              password: string;
              confirmPassword: string;
            }): void {
              throw new Error('Function not implemented.');
            }}
          />
        </Card>
        <p className="text-accent-foreground/60">
          Already have an account?{' '}
          <Link href="/sign-in">
            <b>Sign in!</b>
          </Link>
        </p>
      </div>
    </div>
  );
}
export default RegisterPage;
