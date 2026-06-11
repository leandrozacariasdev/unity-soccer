"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Users,
  Briefcase,
  Newspaper,
  Mail,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { label: "Início", icon: Home, href: "/#top" },
  { label: "Atletas", icon: Users, href: "/#atletas" },
  { label: "Serviços", icon: Briefcase, href: "/#servicos" },
  { label: "Notícias", icon: Newspaper, href: "/#noticias" },
  { label: "Contato", icon: Mail, href: "/#contato" },
];

const MOBILE_LABEL_WIDTH = 72;

type BottomNavBarProps = {
  className?: string;
  defaultIndex?: number;
  stickyBottom?: boolean;
};

export function BottomNavBar({
  className,
  defaultIndex = 0,
  stickyBottom = false,
}: BottomNavBarProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  return (
    <nav
      aria-label="Navegação principal"
      className={cn(
        "bg-ink-soft border border-border-inv rounded-full flex items-center p-1.5 shadow-2xl backdrop-blur-xl",
        stickyBottom && "fixed inset-x-0 bottom-4 mx-auto z-40 w-fit",
        className,
      )}
    >
      {navItems.map((item, idx) => {
        const Icon = item.icon;
        const isActive = activeIndex === idx;

        return (
          <a
            key={item.label}
            href={item.href}
            onClick={() => setActiveIndex(idx)}
            className={cn(
              "flex items-center gap-0 px-3 py-2.5 rounded-full transition-colors duration-200 relative h-11 min-w-[44px] min-h-[44px] max-h-[44px]",
              isActive
                ? "bg-gold/15 text-gold"
                : "text-paper/50 hover:text-paper hover:bg-paper/5",
            )}
          >
            <Icon
              size={20}
              strokeWidth={2}
              className="transition-colors duration-200"
            />

            <motion.div
              initial={false}
              animate={{
                width: isActive ? `${MOBILE_LABEL_WIDTH}px` : "0px",
                opacity: isActive ? 1 : 0,
                marginLeft: isActive ? "8px" : "0px",
              }}
              transition={{
                width: { type: "spring", stiffness: 350, damping: 32 },
                opacity: { duration: 0.19 },
                marginLeft: { duration: 0.19 },
              }}
              className={cn("overflow-hidden flex items-center max-w-[72px]")}
            >
              <span
                className={cn(
                  "font-medium text-xs whitespace-nowrap select-none transition-opacity duration-200 overflow-hidden text-ellipsis text-[clamp(0.625rem,0.5263rem+0.5263vw,1rem)] leading-[1.9]",
                  isActive ? "text-gold" : "opacity-0",
                )}
              >
                {item.label}
              </span>
            </motion.div>
          </a>
        );
      })}
    </nav>
  );
}

export default BottomNavBar;