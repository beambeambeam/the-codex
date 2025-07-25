import Link from "next/link";

import { Logo } from "@/components/icon";
import { Button } from "@/components/ui/button";

function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="absolute z-10">
        <div className="mx-36 flex h-screen w-screen flex-col items-start justify-center gap-y-6">
          <Logo size={400} />
          <div className="flex flex-col gap-2 text-6xl font-bold">
            Make every data, Askable.
          </div>
          <Link href="/sign-in">
            <Button variant="outline">Let&apos;s get start!</Button>
          </Link>
        </div>
        <Logo size={400} />
        <Link href="/sign-in">
          <Button>Let&apos;s get start!</Button>
        </Link>
      </div>
    </div>
  );
}

export default Page;
