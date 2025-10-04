"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckIcon, PlayIcon } from "lucide-react";
import { useCallback, useState } from "react";

interface WorkflowEditorProps {
  workflowId: string;
}

interface Node {
  id: string;
  type: string;
  x: number;
  y: number;
  data: any;
}

export function WorkflowEditor({ workflowId }: WorkflowEditorProps) {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: "start",
      type: "webhook",
      x: 100,
      y: 100,
      data: { label: "Start Trigger", url: "/webhook/start" }
    },
    {
      id: "process",
      type: "email",
      x: 300,
      y: 100,
      data: { label: "Send Email", to: "user@example.com" }
    },
    {
      id: "end",
      type: "slack",
      x: 500,
      y: 100,
      data: { label: "Notify Slack", channel: "#alerts" }
    }
  ]);

  const [isRunning, setIsRunning] = useState(false);

  const handleRunWorkflow = useCallback(async () => {
    setIsRunning(true);
    try {
      // Simulate workflow execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Workflow executed successfully!");
    } catch (error) {
      alert("Workflow execution failed!");
    } finally {
      setIsRunning(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Canvas Header */}
      <div className="border-b border-gray-200 px-6 py-3 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button size="sm" onClick={handleRunWorkflow} disabled={isRunning}>
              <PlayIcon className="h-4 w-4 mr-2" />
              {isRunning ? "Running..." : "Run Workflow"}
            </Button>
            <Button variant="outline" size="sm" disabled>
              <CheckIcon className="h-4 w-4 mr-2" />
              Last run: Never
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative bg-gray-50 p-8 overflow-auto">
        <div className="relative w-full h-full">
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Draw connections between nodes */}
            {nodes.length > 1 && (
              <>
                <line 
                  x1={100 + 150} 
                  y1={100 + 50} 
                  x2={300 + 150} 
                  y2={100 + 50} 
                  stroke="#94a3b8" 
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                <line 
                  x1={300 + 150} 
                  y1={100 + 50} 
                  x2={500 + 150} 
                  y2={100 + 50} 
                  stroke="#94a3b8" 
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                <defs>
                  <marker 
                    id="arrowhead" 
                    markerWidth="10" 
                    markerHeight="7" 
                    refX="9" 
                    refY="3.5" 
                    orient="auto"
                  >
                    <polygon 
                      points="0 0, 10 3.5, 0 7" 
                      fill="#94a3b8" 
                    />
                  </marker>
                </defs>
              </>
            )}
          </svg>

          {/* Render Nodes */}
          {nodes.map((node) => (
            <Card
              key={node.id}
              className="absolute w-48 cursor-move"
              style={{
                left: node.x,
                top: node.y,
              }}
            >
              <CardContent className="p-4">
                <div className="text-sm font-medium">{node.data.label}</div>
                <div className="text-xs text-gray-500 mt-1">{node.type}</div>
                {node.data.url && (
                  <div className="text-xs text-blue-600 mt-1">{node.data.url}</div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Drop Zone Indicator */}
          <div className="absolute top-4 right-4 bg-green-100 border-2 border-dashed border-green-300 rounded-lg p-6 text-center">
            <p className="text-sm text-green-700">Drop nodes here to build your workflow</p>
          </div>
        </div>
      </div>
    </div>
  );
}
