import { Logo } from '@/components/icon';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Index() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-y-10">
      <Logo size={400} />
      <Link href="/sign-in">
        <Button>Let&apos;s get start!</Button>
      </Link>
    </div>
  );
}
