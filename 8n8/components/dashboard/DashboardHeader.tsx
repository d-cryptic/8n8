"use client";

import { Button } from "@/components/ui/button";
import { BellIcon, PlusIcon, UserIcon } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="bashadow-sm bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">8n8</h1>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <PlusIcon className="h-4 w-4 mr-2" />
              New Workflow
            </Button>
            
            <Button variant="ghost" size="sm">
              <BellIcon className="h-4 w-4" />
            </Button>
            
            <Button href="/profile" variant="ghost" size="sm">
              <UserIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
