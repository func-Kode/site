import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      <div className="text-8xl font-extrabold mb-4 animate-bounce">404</div>
      <div className="flex items-center mb-6">
        <Image
          src="/raccoon.png"
          alt="Lost raccoon"
          width={96}
          height={96}
          className="w-24 h-24 mr-4 drop-shadow-lg"
          priority
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">Oops! Page not found</h1>
          <p className="text-lg">Looks like our raccoon got lost in the code jungle.</p>
        </div>
      </div>
      <Link href="/" className="mt-8 px-6 py-3 bg-purple-700 hover:bg-purple-800 rounded-lg text-lg font-semibold shadow-lg transition">Go Home</Link>
      <div className="mt-10 text-sm opacity-70">funcKode &mdash; Where even raccoons code!</div>
    </main>
  );
}
