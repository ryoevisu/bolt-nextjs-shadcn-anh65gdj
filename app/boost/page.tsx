"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/lib/api";

const formSchema = z.object({
  cookie: z.string().min(1, "Cookie is required"),
  url: z.string().url("Must be a valid Facebook URL"),
  amount: z.number().min(1).max(50000),
  interval: z.number().min(1).max(30),
});

export default function BoostPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSessionId, setLastSessionId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cookie: "",
      url: "",
      amount: 100,
      interval: 2,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await api.submitShare(values);
      setLastSessionId(response.session_id);
      toast.success("Share request submitted successfully!", {
        description: `Session ID: ${response.session_id}`,
      });
      form.reset();
    } catch (error: any) {
      toast.error("Failed to submit share request", {
        description: error.response?.data?.detail || "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container max-w-2xl py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Boost Your Facebook Post</CardTitle>
          <CardDescription>
            Enter your Facebook cookie and post URL to start boosting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Make sure your Facebook cookie is valid and the post URL is public
                </AlertDescription>
              </Alert>

              <FormField
                control={form.control}
                name="cookie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook Cookie</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Paste your Facebook cookie here"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormDescription>
                      Your cookie is securely handled and never stored
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook Post URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://facebook.com/..." {...field} />
                    </FormControl>
                    <FormDescription>
                      The post must be public and accessible
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Share Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={50000}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>Maximum 50,000 shares</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interval (seconds)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={30}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>1-30 seconds between shares</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                size="lg"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Start Boosting
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {lastSessionId && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>Your boost request has been submitted successfully.</p>
            <p className="font-mono text-sm">Session ID: {lastSessionId}</p>
            <Button
              variant="link"
              className="p-0"
              onClick={() => window.location.href = '/dashboard'}
            >
              View progress in dashboard →
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}