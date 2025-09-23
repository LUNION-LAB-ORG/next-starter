export type SiteConfig = typeof siteConfig;

export const locales = ["ar", "en", "fr"];

export const siteConfig = {
  name: "Next-STARTER",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      key: "home",
      label: "Home",
      href: "/",
    },
    {
      key: "docs",
      label: "Docs",
      href: "/docs",
    },
    {
      key: "pricing",
      label: "Pricing",
      href: "/pricing",
    },
    {
      key: "blog",
      label: "Blog",
      href: "/blog",
    },
    {
      key: "about",
      label: "About",
      href: "/about",
    },
  ],

  navMenuItems: [
    {
      key: "profile",
      label: "Profile",
      href: "/profile",
    },
    {
      key: "dashboard",
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      key: "projects",
      label: "Projects",
      href: "/projects",
    },
    {
      key: "team",
      label: "Team",
      href: "/team",
    },
    {
      key: "calendar",
      label: "Calendar",
      href: "/calendar",
    },
    {
      key: "settings",
      label: "Settings",
      href: "/settings",
    },
    {
      key: "help_feedback",
      label: "Help & Feedback",
      href: "/help-feedback",
    }
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
