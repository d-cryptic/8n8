import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	CalendarIcon,
	DatabaseIcon,
	FileTextIcon,
	MailIcon,
	SlackIcon,
	WebhookIcon
} from "lucide-react";

interface EditorSidebarProps {
  workflowId: string;
}

export function EditorSidebar({ workflowId }: EditorSidebarProps) {
  const nodeTypes = [
    { name: "Webhook", icon: WebhookIcon, description: "Trigger via HTTP requests" },
    { name: "Email", icon: MailIcon, description: "Send and receive emails" },
    { name: "Schedule", icon: CalendarIcon, description: "Time-based triggers" },
    { name: "Database", icon: DatabaseIcon, description: "Database operations" },
    { name: "Document", icon: FileTextIcon, description: "Text processing" },
    { name: "Slack", icon: SlackIcon, description: "Slack integration" }
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Node Library</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {nodeTypes.map((nodeType) => (
              <div
                key={nodeType.name}
                className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                draggable
              >
                <nodeType.icon className="h-5 w-5 text-gray-500 mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{nodeType.name}</p>
                  <p className="text-xs text-gray-500">{nodeType.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm">Workflow Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs text-gray-500">Name</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Enter workflow name"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Description</label>
              <textarea 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20 resize-none"
                placeholder="Describe your workflow"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
