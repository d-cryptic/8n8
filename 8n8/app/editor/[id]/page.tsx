import { EditorHeader } from "@/components/editor/EditorHeader";
import { EditorSidebar } from "@/components/editor/EditorSidebar";
import { WorkflowEditor } from "@/components/editor/WorkflowEditor";

interface EditorPageProps {
  params: {
    id: string;
  };
}

export default function EditorPage({ params }: EditorPageProps) {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <EditorHeader workflowId={params.id} />
      <div className="flex flex-1 overflow-hidden">
        <EditorSidebar workflowId={params.id} />
        <main className="flex-1 overflow-hidden">
          <WorkflowEditor workflowId={params.id} />
        </main>
      </div>
    </div>
  );
}
