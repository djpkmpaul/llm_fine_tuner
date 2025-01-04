import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 py-4 px-6 bg-zinc-800 text-white">
      <nav className="flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">LLM Fine-tuner</Link>
        <div className="space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}

