"use client";

import { Button } from "@/components/ui/button";
import { PlayIcon, SaveIcon, SettingsIcon, ShareIcon } from "lucide-react";
import { useState } from "react";

interface EditorHeaderProps {
  workflowId: string;
}

export function EditorHeader({ workflowId }: EditorHeaderProps) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Title and status */}
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-gray-900">
            Workflow Editor
          </h1>
          <span className="text-sm text-gray-500">
            ID: {workflowId}
          </span>
          {hasUnsavedChanges && (
            <span className="text-sm text-orange-500">
              • Unsaved changes
            </span>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <ShareIcon className="h-4 w-4 mr-2" />
            Share
          </Button>
          
          <Button variant="outline" size="sm">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Settings
          </Button>
          
          <Button variant="outline" size="sm">
            <SaveIcon className="h-4 w-4 mr-2" />
            Save
          </Button>
          
          <Button size="sm">
            <PlayIcon className="h-4 w-4 mr-2" />
            Run Workflow
          </Button>
        </div>
      </div>
    </header>
  );
}
