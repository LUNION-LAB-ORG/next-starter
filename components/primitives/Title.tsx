import React from "react";
import { tv } from "tailwind-variants";

export const titleStyle = tv({
  base: "tracking-tight inline font-semibold",
  variants: {
    color: {
      violet: "from-violet-500 to-pink-500",
      yellow: "from-yellow-500 via-yellow-600 to-orange-800",
      blue: "from-blue-500 to-cyan-500",
      cyan: "from-cyan-500 to-teal-500",
      green: "from-green-500 to-emerald-500",
      pink: "from-pink-500 to-red-500",
      foreground: "from-foreground to-[#BBBBBB] dark:to-[#4B4B4B]",
    },
    size: {
      xs: "text-2xl lg:text-3xl",
      sm: "text-3xl lg:text-4xl",
      md: "text-[2.3rem] lg:text-5xl",
      lg: "text-4xl lg:text-6xl",
    },
    fullWidth: {
      true: "w-full block",
    },
  },
  defaultVariants: {
    size: "md",
    color: "foreground",
  },
  compoundVariants: [
    {
      color: [
        "violet",
        "yellow",
        "blue",
        "cyan",
        "green",
        "pink",
        "foreground",
      ],
      class: "bg-clip-text text-transparent bg-gradient-to-b",
    },
  ],
});

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  color?: keyof typeof titleStyle.variants.color;
  size?: keyof typeof titleStyle.variants.size;
  fullWidth?: boolean;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children?: React.ReactNode;
}

export default function Title({
  color,
  size,
  fullWidth,
  children,
  className,
  level = 1,
  ...props
}: TitleProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return React.createElement(
    Tag,
    {
      className: titleStyle({ color, size, fullWidth, className }),
      ...props,
    },
    children
  );
}
