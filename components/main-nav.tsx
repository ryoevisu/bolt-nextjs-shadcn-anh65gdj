import Link from "next/link";
import { Facebook } from "lucide-react";
import { cn } from "@/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/"
        className="flex items-center space-x-2 text-xl font-bold text-primary"
      >
        <Facebook className="h-6 w-6" />
        <span>RyoBoosting</span>
      </Link>
      <Link
        href="/boost"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Boost Now
      </Link>
      <Link
        href="/dashboard"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Dashboard
      </Link>
    </nav>
  );
}