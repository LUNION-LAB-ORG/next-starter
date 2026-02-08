import "@/styles/globals.css";

import { Navbar } from "@/components/common/navbar";

import { Footer } from "@/components/common/footer";
import Main from "@/components/primitives/Main";
import MountedProvider from "@/providers/mounted.provider";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MountedProvider>
      <Main>
        <Navbar />
        {children}
        <Footer />
      </Main>
    </MountedProvider>
  );
}
