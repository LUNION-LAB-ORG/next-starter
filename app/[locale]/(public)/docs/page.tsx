import Content from "@/components/primitives/Content";
import Title from "@/components/primitives/Title";
import { getTranslations } from "next-intl/server";

export default async function DocsPage() {
  const t = await getTranslations("docs");

  return (
    <Content>
      <Title>{t("title")}</Title>
    </Content>
  );
}
