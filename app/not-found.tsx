import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-muted/20 to-background px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* 404 Number */}
        <div className="text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-brand-blue via-primary to-brand-green bg-clip-text text-transparent animate-bounce">
          404
        </div>
        
        {/* Content */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="animate-bounce">
            <Image
              src="/raccoon.png"
              alt="Lost raccoon"
              width={120}
              height={120}
              className="w-24 h-24 md:w-30 md:h-30 drop-shadow-lg"
              priority
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
              Oops! Page not found
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Looks like our raccoon got lost in the code jungle.<br />
              Let's help you find your way back home.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="bg-gradient-to-r from-brand-blue to-primary hover:shadow-lg">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="javascript:history.back()" className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </Link>
          </Button>
        </div>

        {/* Footer */}
        <div className="pt-8 text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <span className="text-brand-green">func(Kode)</span>
            <span>—</span>
            <span>Where even raccoons code!</span>
          </p>
        </div>

        {/* Animated Code Elements */}
        <div className="absolute top-20 left-10 opacity-20 text-muted-foreground font-mono text-sm animate-pulse">
          {"{ error: 404 }"}
        </div>
        <div className="absolute bottom-20 right-10 opacity-20 text-muted-foreground font-mono text-sm animate-pulse">
          {"console.log('lost');"}
        </div>
      </div>
    </main>
  );
}
