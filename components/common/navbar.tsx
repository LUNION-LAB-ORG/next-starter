"use client";

import {
  Button,
  Navbar as HeroUINavbar,
  Input,
  Kbd,
  Link,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";

import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";
import NextLink from "next/link";

import {
  GithubIcon,
  Logo,
  SearchIcon
} from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { siteConfig } from "@/config/site";
import { signOut } from "@/lib/auth";
import { LogInIcon, LogOutIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "../locale-switch";

export const Navbar = () => {
  const t = useTranslations("partials.navbar");
  const tConfig = useTranslations("config");
  const {data: session} = useSession();
  const isLoggedIn = !!session;

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder={t("search.placeholder")}
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">{siteConfig.name}</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {tConfig("menu_links." + item.key)}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <LocaleSwitcher />
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
        <NavbarItem className="hidden md:flex">
          {isLoggedIn ? (
            <Button
              color="danger"
              onPress={async ()=>await signOut()}
              startContent={<LogOutIcon />}
            >
              {t("buttons.logout")}
            </Button>
          ) : (
            <Button
              as={Link}
              color="primary"
              href={"/auth/login"}
              startContent={<LogInIcon />}
            >
              {t("buttons.login")}
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          <NavbarMenuItem className="flex items-center justify-end">
            <LocaleSwitcher />
          </NavbarMenuItem>
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={index === 2 ? "primary" : "foreground"}
                href="#"
                size="lg"
              >
                {tConfig("menu_links." + item.key)}
              </Link>
            </NavbarMenuItem>
          ))}
          <NavbarMenuItem className="mt-8">
            {isLoggedIn ? (
              <Button
                color="danger"
                onPress={async ()=>await signOut()}
                startContent={<LogOutIcon />}
                fullWidth
              >
                {t("buttons.logout")}
              </Button>
            ) : (
              <Button
                as={Link}
                color="primary"
                href={"/auth/login"}
                startContent={<LogInIcon />}
                fullWidth
              >
                {t("buttons.login")}
              </Button>
            )}
          </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
