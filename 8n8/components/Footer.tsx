import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DribbbleIcon,
  GithubIcon,
  GlobeIcon,
  LinkedinIcon,
  MailIcon,
  TwitchIcon,
  TwitterIcon,
} from "lucide-react";
import Link from "next/link";
import { NavbarLogo } from "./ui/resizable-navbar";

const footerLinks = [
  {
    title: "Overview",
    href: "#how-it-works",
  },
  {
    title: "Features",
    href: "#features",
  },
  {
    title: "Pricing",
    href: "#pricing",
  }
];

const FooterSection = () => {
  return (
    <div className="flex flex-col">
      <div className="grow bg-muted" />
      <footer className="border-t">
        <div className="max-w-(--breakpoint-xl) mx-auto">
          <div className="py-12 flex flex-col sm:flex-row items-start justify-between gap-x-8 gap-y-10 px-6 xl:px-0">
            <div>
              {/* Logo */}
              <NavbarLogo />

              <ul className="mt-6 flex items-center gap-4 flex-wrap">
                {footerLinks.map(({ title, href }) => (
                  <li key={title}>
                    <Link
                      href={href}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subscribe Newsletter */}
            <div className="max-w-xs w-full">
              <h6 className="font-medium">Stay up to date</h6>
              <form className="mt-6 flex items-center gap-2">
                <Input type="email" placeholder="Enter your email" />
                <Button>Subscribe</Button>
              </form>
            </div>
          </div>
          <Separator />
          <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
            {/* Copyright */}
            <span className="text-muted-foreground">
              &copy; {new Date().getFullYear()}{" "}
              <Link href="/" target="_blank">
                8n8
              </Link>
              . All rights reserved.
            </span>

            <div className="flex items-center gap-5 text-muted-foreground">
              <Link href="https://x.com/hey_barun" target="_blank">
                <TwitterIcon className="h-5 w-5" />
              </Link>
              <Link href="mailto:barundebnath91@gmail.com" target="_blank">
                <MailIcon className="h-5 w-5" />
              </Link>
              <Link href="https://github.com/d-cryptic/8n8" target="_blank">
                <GithubIcon className="h-5 w-5" />
              </Link>
             <Link href="https://www.linkedin.com/in/barundebnath/" target="_blank">
                <LinkedinIcon className="h-5 w-5" />
              </Link> 
              <Link href="https://barundebnath.com" target="_blank">
                <GlobeIcon className="h-5 w-5" />
              </Link> 
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FooterSection;
