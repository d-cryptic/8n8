import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardStats() {
  const stats = [
    {
      title: "Total Workflows",
      value: "12",
      description: "Active workflows",
      trend: "+2 this week"
    },
    {
      title: "Executions Today",
      value: "324",
      description: "Successful runs",
      trend: "+12% from yesterday"
    },
    {
      title: "Average Response Time",
      value: "2.4s",
      description: "Across all workflows",
      trend: "-0.3s improvement"
    },
    {
      title: "Success Rate",
      value: "98.2%",
      description: "Past 30 days",
      trend: "+1.2% this month"
    }
  ];

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <p className="text-xs text-green-600">
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
