import { Code } from "@heroui/code";
import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { button as buttonStyles } from "@heroui/theme";

import { GithubIcon } from "@/components/icons";
import Content from "@/components/primitives/Content";
import Subtitle from "@/components/primitives/Subtitle";
import Title from "@/components/primitives/Title";
import { siteConfig } from "@/config/site";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("home.hero");

  return (
    <Content>
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="inline-block max-w-xl text-center justify-center mt-16">
          <Title>{t("title")}</Title>
          <Subtitle className="mt-4">{t("subtitle")}</Subtitle>
        </div>

        <div className="flex gap-3">
          <Link
            isExternal
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            href={siteConfig.links.docs}
          >
            {t("documentation")}
          </Link>
          <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={siteConfig.links.github}
          >
            <GithubIcon size={20} />
            {t("github")}
          </Link>
        </div>

        <div className="mt-8">
          <Snippet hideCopyButton hideSymbol variant="bordered">
            <span className="text-primary">
              {t("snippet_text")}{" "}
              <Code color="primary">{t("snippet_file")}</Code>
            </span>
          </Snippet>
        </div>
      </div>
    </Content>
  );
}
