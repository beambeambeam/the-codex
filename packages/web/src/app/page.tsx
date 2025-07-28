import Link from "next/link";

import { Logo } from "@/components/icon";
import { Button } from "@/components/ui/button";

function Page() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
      <Logo size={400} />
      <div className="flex flex-col gap-2 text-6xl font-bold">
        Make every data, Askable.
      </div>
      <Link href="/sign-in">
        <Button variant="outline">Let&apos;s get start!</Button>
      </Link>
    </div>
  );
}

export default Page;
