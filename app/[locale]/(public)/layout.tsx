import "@/styles/globals.css";
import Main from "@/components/primitives/Main";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Main>
      {/*<Navbar />*/}
      {children}
      {/*<Footer />*/}
    </Main>
  );
}
