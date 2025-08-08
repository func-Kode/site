import { SignUpForm } from "@/components/sign-up-form";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-brand-gray">
      <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-6">
        <span className="inline-block animate-bounce">
          <Image src="/raccoon.png" alt="Raccoon Mascot" width={48} height={48} />
        </span>
        <h1 className="text-2xl font-bold text-brand-blue text-center">Sign in with GitHub</h1>
        <p className="text-sm text-muted-foreground text-center -mt-2">No passwords. Just your GitHub account.</p>
        <div className="w-full">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
