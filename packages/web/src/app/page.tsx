import Link from "next/link";

import { Logo } from "@/components/icon";
import { Button } from "@/components/ui/button";
import EthermalShadowBg from "@/components/ui/etheral-shadow";

function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <EthermalShadowBg
        color="rgba(128, 128, 128, 1)"
        animation={{ scale: 100, speed: 90 }}
        noise={{ opacity: 1, scale: 1.2 }}
        sizing="fill"
      >
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
      </EthermalShadowBg>
    </div>
  );
}

export default Page;
