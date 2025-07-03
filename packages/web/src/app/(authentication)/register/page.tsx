'use client';

import Link from 'next/link';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import RegisterForm from '@/app/(authentication)/register/form';

function RegisterPage() {
  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="flex items-center justify-center h-full flex-col ">
        <div>
          <h1 className="text-3xl font-bold">The Codex</h1>
          <h1 className="text-3xl">Your&apos;s Agentic Ai Librarians</h1>
        </div>
      </div>
      <div className="flex items-center justify-center h-full flex-col gap-2.5">
        <Card className="w-full max-w-md space-y-5">
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
