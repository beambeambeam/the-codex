'use client';

import Link from 'next/link';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import SignInForm from '@/app/(authentication)/sign-in/form';
import { Logo } from '@/components/icon';

function SignInPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
      <div className="hidden lg:flex items-center justify-center h-full flex-col">
        <div>
          <Logo size={250} />
          <h1 className="text-3xl">Your’s Agentic Ai Librarians</h1>
        </div>
      </div>
      <div className="flex items-center justify-center h-full flex-col gap-2.5">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">🤗 Welcome back.</CardTitle>
            <CardDescription className="text-sm">
              Welcome to TheCodex, Your not so Library that help you managed the
              data.
            </CardDescription>
          </CardHeader>
          <SignInForm
            defaultValues={{
              username: '',
              password: '',
            }}
            onSubmit={function (values: {
              username: string;
              password: string;
            }): void {
              throw new Error('Function not implemented.');
            }}
          />
        </Card>
        <p className="text-accent-foreground/60">
          Don’t have an account?{' '}
          <Link href="/register">
            <b>Sign up!</b>
          </Link>
        </p>
      </div>
    </div>
  );
}
export default SignInPage;
