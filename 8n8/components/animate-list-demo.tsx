"use client"

import { AnimatedList } from "@/components/ui/animated-list"
import { cn } from "@/lib/utils"
import { ChatBubbleIcon } from "@radix-ui/react-icons"
import { IconMoneybagEdit } from "@tabler/icons-react"
import { ClockIcon, MailIcon } from "lucide-react"

interface Item {
  name: string
  description: string
  icon: string
  color: string
  time: string
}

let notifications = [
  {
    name: "Email received",
    description: "Run your automation when you receive an email.",
    time: "15m ago",

    icon: <MailIcon />,
    color: "#00C9A7",
  },
  {
    name: "Telegram message received",
    description: "Receive messages from your customers on Telegram.",
    time: "10m ago",
    icon: <ChatBubbleIcon />,
    color: "#FFB800",
  },
  {
    name: "Cron job completed",
    description: "Run your automation when a cron job completes.",
    time: "5m ago",
    icon: <ClockIcon />,
    color: "#FF3D71",
  },
  {
    name: "Stock price changed",
    description: "Run your automation when the stock price changes.",
    time: "2m ago",
    icon: <IconMoneybagEdit />,
    color: "#1E86FF",
  },
]

notifications = Array.from({ length: 10 }, () => notifications).flat()

const Notification = ({ name, description, icon, color, time }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center text-lg font-medium whitespace-pre dark:text-white">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  )
}

export default function AnimatedListDemo({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full flex-col overflow-hidden p-2",
        className
      )}
    >
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>

      <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t"></div>
    </div>
  )
}