import Content from "@/components/primitives/Content";
import Section from "@/components/primitives/Section";
import Subtitle from "@/components/primitives/Subtitle";
import Title from "@/components/primitives/Title";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { getTranslations } from "next-intl/server";

export default async function BlogPage() {
  const t = await getTranslations("blog");

  return (
    <Content>
      <Title>{t("title")}</Title>
      <Section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex-col justify-start align-start">
            <Title size="sm">Card Title</Title>
            <Subtitle size="sm">Card Description</Subtitle>
          </CardHeader>
          <CardBody>
            <p>Card Text</p>
          </CardBody>
          <CardFooter>
            <Button>Card Button</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-col justify-start">
            <Title size="sm">Card Title</Title>
            <Subtitle size="sm">Card Description</Subtitle>
          </CardHeader>
          <CardBody>
            <p>Card Text</p>
          </CardBody>
          <CardFooter>
            <Button>Card Button</Button>
          </CardFooter>
        </Card>
      </Section>
      <svg
        width="100%"
        height="auto"
        viewBox="0 0 450 90"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="svg-pricing-clip">
            <path d="m0,2.34C5.18,1.48,11.96.74,20.58.74c10.6,0,18.37,2.47,23.3,6.9,4.56,3.94,7.27,9.98,7.27,17.38s-2.22,13.44-6.41,17.75c-5.67,6.04-14.91,9.12-25.39,9.12-3.2,0-6.16-.12-8.63-.74v33.28H0V2.34Zm10.72,40.06c2.34.62,5.3.86,8.88.86,12.94,0,20.83-6.29,20.83-17.75s-7.77-16.27-19.6-16.27c-4.68,0-8.26.37-10.11.86v32.29Z" />
            <path d="m65.57,2.47c5.42-1.11,13.19-1.73,20.58-1.73,11.46,0,18.86,2.1,24.04,6.78,4.19,3.7,6.53,9.37,6.53,15.78,0,10.97-6.9,18.24-15.65,21.2v.37c6.41,2.22,10.23,8.13,12.2,16.76,2.71,11.59,4.68,19.6,6.41,22.8h-11.09c-1.36-2.34-3.2-9.49-5.55-19.84-2.46-11.46-6.9-15.78-16.64-16.15h-10.11v35.99h-10.72V2.47Zm10.72,37.84h10.97c11.46,0,18.74-6.29,18.74-15.78,0-10.72-7.77-15.41-19.11-15.53-5.18,0-8.88.49-10.6.99v30.32Z" />
            <path d="m142.6,1.36v83.08h-10.72V1.36h10.72Z" />
            <path d="m219.39,81.72c-3.94,1.97-11.83,3.94-21.94,3.94-23.42,0-41.05-14.79-41.05-42.03S174.03,0,199.79,0c10.35,0,16.89,2.22,19.72,3.7l-2.59,8.75c-4.07-1.97-9.86-3.45-16.76-3.45-19.48,0-32.42,12.45-32.42,34.27,0,20.34,11.71,33.4,31.92,33.4,6.53,0,13.19-1.36,17.5-3.45l2.22,8.5Z" />
            <path d="m243.55,1.36v83.08h-10.72V1.36h10.72Z" />
            <path d="m262.28,84.43V1.36h11.71l26.62,42.03c6.16,9.74,10.97,18.49,14.91,26.99l.25-.12c-.99-11.09-1.23-21.2-1.23-34.14V1.36h10.11v83.08h-10.85l-26.38-42.16c-5.79-9.24-11.34-18.74-15.53-27.73l-.37.12c.62,10.48.86,20.46.86,34.27v35.5h-10.11Z" />
            <path d="m406.61,80.74c-4.81,1.73-14.3,4.56-25.51,4.56-12.57,0-22.93-3.2-31.06-10.97-7.15-6.9-11.59-18-11.59-30.94.12-24.78,17.13-42.89,44.99-42.89,9.61,0,17.13,2.1,20.71,3.82l-2.59,8.75c-4.44-1.97-9.98-3.57-18.37-3.57-20.21,0-33.4,12.57-33.4,33.4s12.7,33.53,32.05,33.53c7.03,0,11.83-.99,14.3-2.22v-24.78h-16.89v-8.63h27.36v39.94Z" />
          </clipPath>
          <linearGradient id="svg-pricing-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D8D8D8"></stop>
            <stop offset="100%" stopColor="#f7f7f7"></stop>
          </linearGradient>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          clip-path="url(#svg-pricing-clip)"
          fill="url(#svg-pricing-gradient)"
        ></rect>
      </svg>
      <Section className="bg-blue-200">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae
        voluptatum doloremque nisi neque saepe ullam, assumenda quas officia
        voluptates a illo ipsam quae, suscipit iusto enim? Quae optio, maiores,
        porro alias tempora error eius consectetur architecto quaerat cupiditate
        eveniet rerum facilis illum repellat ab. Cupiditate, modi! Delectus
        nostrum magnam rem?
      </Section>
      <Section className="bg-blue-500"></Section>
    </Content>
  );
}
