"use client";

import { useEffect, useState } from "react";
import { useInterval } from "@/hooks/use-interval";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api, Session, MetricsResponse, FailedUrlsResponse } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [failedUrls, setFailedUrls] = useState<FailedUrlsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [sessionsData, metricsData, failedUrlsData] = await Promise.all([
        api.getTotalSessions(),
        api.getMetrics(),
        api.getFailedUrls(),
      ]);
      setSessions(sessionsData);
      setMetrics(metricsData);
      setFailedUrls(failedUrlsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useInterval(() => {
    fetchData();
  }, 1000);

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {metrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Shares"
            value={metrics.shares_statistics.total_shares}
            description="All-time shares"
            icon={<CheckCircle2 className="h-4 w-4" />}
            trend={metrics.shares_statistics.success_rate}
          />
          <StatsCard
            title="Success Rate"
            value={metrics.shares_statistics.success_rate}
            description="Overall success rate"
            icon={<CheckCircle2 className="h-4 w-4" />}
            trend="↑"
          />
          <StatsCard
            title="Active Sessions"
            value={sessions.length}
            description="Currently running"
            icon={<Loader2 className="h-4 w-4 animate-spin" />}
          />
          <StatsCard
            title="Failed Shares"
            value={metrics.shares_statistics.failed_shares}
            description="Total failed attempts"
            icon={<AlertCircle className="h-4 w-4" />}
            trend="↓"
            variant="destructive"
          />
        </div>
      )}

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Sessions</TabsTrigger>
          <TabsTrigger value="failed">Failed Sessions</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Currently running share sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>URL</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>Last Update</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell className="max-w-[200px] truncate">
                            <a
                              href={session.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {session.url}
                            </a>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <Progress
                                value={(session.count / session.target) * 100}
                              />
                              <p className="text-sm text-muted-foreground">
                                {session.count} / {session.target} ({session.success_rate})
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                session.last_status === "Success"
                                  ? "success"
                                  : "destructive"
                              }
                            >
                              {session.last_status}
                            </Badge>
                            {session.last_error && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {session.last_error}
                              </p>
                            )}
                          </TableCell>
                          <TableCell>
                            {formatDistanceToNow(new Date(session.start_time), {
                              addSuffix: true,
                            })}
                          </TableCell>
                          <TableCell>
                            {formatDistanceToNow(new Date(session.last_update), {
                              addSuffix: true,
                            })}
                          </TableCell>
                        </TableRow>
                      ))}
                      {sessions.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            No active sessions
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="failed">
          <Card>
            <CardHeader>
              <CardTitle>Failed Sessions</CardTitle>
              <CardDescription>
                Sessions that encountered errors or failed to complete
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>URL</TableHead>
                        <TableHead>Error</TableHead>
                        <TableHead>Completion Rate</TableHead>
                        <TableHead>Duration</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {failedUrls?.failed_urls.map((url: any) => (
                        <TableRow key={url.session_id}>
                          <TableCell className="max-w-[200px] truncate">
                            <a
                              href={url.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {url.url}
                            </a>
                          </TableCell>
                          <TableCell className="max-w-[300px]">
                            <Badge variant="destructive">{url.reason}</Badge>
                          </TableCell>
                          <TableCell>{url.completion_rate}</TableCell>
                          <TableCell>{url.duration}</TableCell>
                        </TableRow>
                      ))}
                      {!failedUrls?.failed_urls.length && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center">
                            No failed sessions
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  variant = "default",
}: {
  title: string;
  value: string | number;
  description: string;
  icon?: React.ReactNode;
  trend?: string;
  variant?: "default" | "destructive";
}) {
  return (
    <Card className={variant === "destructive" ? "border-destructive/50" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{description}</p>
          {trend && (
            <span
              className={
                variant === "destructive"
                  ? "text-destructive text-sm font-medium"
                  : "text-emerald-600 text-sm font-medium"
              }
            >
              {trend}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}