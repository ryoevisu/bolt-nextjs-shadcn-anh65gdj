import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-background to-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Boost Your Facebook Engagement
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Enhance your social media presence with our powerful Facebook sharing service.
              Fast, reliable, and secure.
            </p>
          </div>
          <div className="space-x-4">
            <Link href="/boost">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}