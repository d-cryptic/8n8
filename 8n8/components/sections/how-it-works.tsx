import { cn } from "@/lib/utils";
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconMail,
  IconMoneybagEdit,
  IconRobot,
  IconRouteAltLeft,
  IconTerminal2,
  IconWebhook,
} from "@tabler/icons-react";

export default function HowItWorks() {
  const features = [
    {
      title: "Create your automation",
      description:
        "Create your automation with a simple drag and drop interface.",
      icon: <IconTerminal2 />,
    },
    {
      title: "Add context to your automation",
      description:
        "Upload your files to add context to your automation.",
      icon: <IconEaseInOut />,
    },
    {
      title: "Add triggers to your automation",
      description:
        "Add triggers to your automation to run your automation when something happens.",
      icon: <IconWebhook />,
    },
    {
      title: "Add integrations to your automation",
      description: "Add integrations to your automation to connect to your favorite apps.",
      icon: <IconCloud />,
    },
    {
      title: "Schedule your tasks",
      description: "Schedule your tasks to run at a specific time.",
      icon: <IconRouteAltLeft />,
    },
    {
      title: "Poll stock prices",
      description:
        "Poll stock prices to run your automation when the stock price changes.",
      icon: <IconMoneybagEdit />,
    },
    {
      title: "Send emails",
      description:
        "Send emails to your customers to run your automation.",
      icon: <IconMail />,
    },
    {
      title: "Control your Agents",
      description: "Control your Agents to run your automation.",
      icon: <IconRobot />,
    },
  ];
  return (
    <div id="how-it-works" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto pb-20 w-3/4">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
