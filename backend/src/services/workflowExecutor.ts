import { prisma } from "../index";
import { sendWorkflowExecutionEmail } from "./emailService";
import { createTelegramService } from "./telegramService";

interface WorkflowNode {
  id: string;
  type: string;
  data: any;
  position: { x: number; y: number };
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

interface ExecutionContext {
  workflowId: string;
  executionId: string;
  userId: string;
  data: any;
  variables: Record<string, any>;
}

export class WorkflowExecutor {
  private context: ExecutionContext;

  constructor(context: ExecutionContext) {
    this.context = context;
  }

  async executeWorkflow(
    nodes: WorkflowNode[],
    edges: WorkflowEdge[],
  ): Promise<Void> {
    try {
      const startNode = nodes.find((node) => node.type === "start");
      if (!startNode) {
        throw new Error("No start node found in workflow");
      }

      const executedNodes = new Set<string>();
      await this.executeNode(startNode, nodes, edges, executedNodes);

      await prisma.execution.update({
        where: { id: this.context.executionId },
        data: {
          status: "completed",
          tasksDone: `${executedNodes.size}/${nodes.length}`,
          completedAt: new Date(),
        },
      });
    } catch (error: any) {
      console.error("Workflow execution error:", error);

      await prisma.execution.update({
        where: { id: this.context.executionId },
        data: {
          status: "failed",
          error: error.message,
          completedAt: new Date(),
        },
      });

      try {
        const user = await prisma.user.findUnique({
          where: { id: this.context.userId },
          select: { email: true, name: true },
        });

        if (user?.email) {
          await sendWorkflowExecutionEmail(
            user.email,
            "Workflow Execution",
            "failed",
            error.message,
          );
        }
      } catch (emailError) {
        console.error("Failed to send failure email:", emailError);
      }

      throw error;
    }
  }

  private async executeNode(
    node: WorkflowNode,
    allNodes: WorkflowNode[],
    edges: WorkflowEdge[],
    executedNodes: Set<string>,
  ): Promise<void> {
    if (executedNodes.has(node.id)) {
      return;
    }

    executedNodes.add(node.id);

    console.log(`Executing node: ${node.type} (${node.id})`);

    switch (node.type) {
      case "start":
        await this.executeStartNode(node);
        break;
      case "end":
        await this.executeEndNode(node);
        break;
      case "webhook":
        await this.executeWebhookNode(node);
        break;
      case "email":
        await this.executeEmailNode(node);
        break;
      case "telegram":
        await this.executeTelegramNode(node);
        break;
      default:
        console.warn(`Unknown node type: ${node.type}`);
    }

    const connectedEdges = edges.filter((edge) => edge.source === node.id);
    for (const edge of connectedEdges) {
      const targetNode = allNodes.find((n) => n.id === edge.target);
      if (targetNode) {
        await this.executeNode(targetNode, allNodes, edges, executedNodes);
      }
    }
  }

  private async executeStartNode(node: WorkflowNode): Promise<void> {
    console.log("Start node executed");
  }

  private async executeEndNode(node: WorkflowNode): Promise<void> {
    console.log("End node executed");
  }

  private async executeWebhookNode(node: WorkflowNode): Promise<void> {
    console.log("Webhook node executed");
  }

  private async executeEmailNode(node: WorkflowNode): Promise<void> {
    console.log("Email node executed");

    const emailData = node.data || {};
    const { to, subject, body, from } = emailData;

    if (!to || !subject || !body) {
      throw new Error("Email node missing required fields: to, subject, body");
    }

    const credentials = await prisma.credential.findFirst({
      where: {
        userId: this.context.userId,
        platform: "email",
      },
    });

    if (!credentials) {
      throw new Error(
        "No email credentials found. Please configure email credentials first.",
      );
    }

    const { Resend } = await import("resend");
    const resend = new Resend(credentials.data.apiKey);

    await resend.emails.send({
      from: from || "8n8@yourdomain.com",
      to: [to],
      subject,
      html: body,
    });

    console.log(`Email send to ${to}`);
  }

  private async executeTelegramNode(node: WorkflowNode): Promise<void> {
    console.log("Telegram node executed");
    const telegramData = node.data || {};
    const { chatId, message, parseMode } = telegramData;

    if (!chatId || !message) {
      throw new Error("Telegram node missing required fields: chatId, message");
    }

    const credentials = await prisma.credential.findFirst({
      where: {
        userId: this.context.userId,
        platform: "telegram",
      },
    });

    if (!credentials) {
      throw new Error(
        "No Telegram credentials found. Please configure Telegram credentials first.",
      );
    }

    const telegramService = createTelegramService(credentials.data.botToken);
    await telegramService.sendMessage({
      chatId,
      text: message,
      parseMode: parseMode || "HTML",
    });

    console.log(`Telegram message sent to ${chatId}`);
  }
}

export const executeWorkflowById = async (
  workflowId: string,
  userId: string,
  data?: any,
): Promise<string> => {
  const workflow = await prisma.workflow.findFirst({
    where: {
      id: workflowId,
      userId,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  if (!workflow.enabled) {
    throw new Error("Workflow is disabled");
  }

  const execution = await prisma.execution.create({
    data: {
      workflowId,
      userId,
      status: "pending",
      tasksDone: "0/0",
      result: data ? { inputData: data } : null,
    },
  });

  setImmediate(async () => {
    try {
      const executor = new WorkflowExecutor({
        workflowId,
        executionId: execution.id,
        userId,
        data: data || {},
        variables: {},
      });
      await executor.executeWorkflow(
        workflow.nodes as WorkflowNode[],
        workflow.connections as WorkflowEdge[],
      );
    } catch (error) {
      console.error("Workflow execution failed:", error);
    }
  });

  return execution.id;
};
