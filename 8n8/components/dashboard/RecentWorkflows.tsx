import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditIcon, PlayIcon, TrashIcon } from "lucide-react";

export function RecentWorkflows() {
  const workflows = [
    {
      id: 1,
      name: "Email Newsletter Automation",
      status: "active",
      lastRun: "2 hours ago",
      executions: 156
    },
    {
      id: 2,
      name: "Lead Processing Pipeline",
      status: "active",
      lastRun: "5 hours ago",
      executions: 89
    },
    {
      id: 3,
      name: "Invoice Generation",
      status: "paused",
      lastRun: "1 day ago",
      executions: 23
    },
    {
      id: 4,
      name: "Customer Support Ticket",
      status: "active",
      lastRun: "30 minutes ago",
      executions: 234
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Workflows</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                  <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                    {workflow.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Last run: {workflow.lastRun} • {workflow.executions} executions
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <PlayIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href={`/editor/${workflow.id}`}>
                    <EditIcon className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="sm">
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
