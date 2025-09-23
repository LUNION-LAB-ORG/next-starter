"use client";
import { Link } from "@heroui/link";
import { useTranslations } from "next-intl";

export const Footer = () => {
  const t = useTranslations("partials.footer");
  return (
    <footer className="w-full flex items-center justify-center py-3">
      <Link
        isExternal
        className="flex items-center gap-1 text-current"
        href="https://lunion-lab.com"
        title="Lunion-Lab homepage"
      >
        <span className="text-default-600">{t("powered_by")}</span>
        <p className="text-violet-500">Lunion-Lab</p>
      </Link>
    </footer>
  );
};
