import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-6">Welcome to Investment-X</h1>
      <p className="text-xl mb-8 text-center">
        Advanced investment research and strategy platform
      </p>
      <div className="space-y-4">
        <Link href="/sign-up">
          <Button>Sign Up</Button>
        </Link>
        <Link href="/sign-in">
          <Button variant="outline">Sign In</Button>
        </Link>
      </div>
    </div>
  );
}
