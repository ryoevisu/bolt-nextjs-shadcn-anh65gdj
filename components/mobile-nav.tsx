import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col space-y-4">
          <Link
            href="/"
            className="text-lg font-bold"
          >
            RyoBoosting
          </Link>
          <Link
            href="/boost"
            className="text-sm font-medium"
          >
            Boost Now
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium"
          >
            Dashboard
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}