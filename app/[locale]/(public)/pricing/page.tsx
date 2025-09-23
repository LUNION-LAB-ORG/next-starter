import Content from "@/components/primitives/Content";
import Title from "@/components/primitives/Title";
import { getTranslations } from "next-intl/server";

export default async function PricingPage() {
  const t = await getTranslations("pricing");

  return (
    <Content>
      <Title>{t("title")}</Title>
    </Content>
  );
}
