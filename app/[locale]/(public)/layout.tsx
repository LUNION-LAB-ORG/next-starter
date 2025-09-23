import "@/styles/globals.css";

import { Navbar } from "@/components/common/navbar";

import { Footer } from "@/components/common/footer";
import Main from "@/components/primitives/Main";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Main>
      <Navbar />
      {children}
      <Footer />
    </Main>
  );
}
