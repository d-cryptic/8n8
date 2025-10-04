import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";

const faq = [
  {
    question: "What is 8n8?",
    answer:
      "8n8 is a powerful, open-source workflow automation platform built from the ground up. Connect apps, services, and APIs with ease - no code required.",
  },
  {
    question: "How does 8n8 work?",
    answer:
      "8n8 allows you to connect apps, services, and APIs with ease - no code required. You can create triggers, actions, and workflows to automate your daily tasks.",
  },
  {
    question: "What can I do with 8n8?",
    answer:
      "You can automate your daily tasks, create workflows, and connect apps, services, and APIs with ease - no code required.",
  },
  {
    question: "How do I get started?",
    answer:
      "Simply create an account, connect your apps, services, and APIs, and start creating triggers, actions, and workflows.",
  },
  {
    question: "What are the benefits of using 8n8?",
    answer:
      "8n8 allows you to automate your daily tasks, create workflows, and connect apps, services, and APIs with ease - no code required.",
  },
];

const FAQ = () => {
  return (
    <div className="flex items-center justify-center px-6 pb-16">
      <div className="w-full max-w-2xl">
        <h2 className="text-4xl md:text-5xl leading-[1.15]! font-semibold tracking-tighter">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-xl text-muted-foreground">
          Quick answers to common questions about our product and features.
        </p>

        <Accordion
          type="single"
          collapsible
          className="mt-8 sm:mt-10 space-y-4"
          defaultValue="question-0"
        >
          {faq.map(({ question, answer }, index) => (
            <AccordionItem
              key={question}
              value={`question-${index}`}
              className="bg-muted py-1 px-4 rounded-xl border-none"
            >
              <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger
                  className={cn(
                    "flex flex-1 items-center justify-between pt-4 pb-3 font-semibold tracking-tight transition-all hover:underline [&[data-state=open]>svg]:rotate-45",
                    "text-start text-lg"
                  )}
                >
                  {question}
                  <PlusIcon className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200" />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionContent className="text-base text-muted-foreground">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
