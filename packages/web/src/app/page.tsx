import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Index() {
  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col gap-y-4">
      <h1 className="text-4xl">The Codex</h1>
      <Link href="/sign-in">
        <Button>Let&apos;s get start!</Button>
      </Link>
    </div>
  );
}
