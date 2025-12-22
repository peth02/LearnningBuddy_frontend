import { HomeNavbar } from "@/components/Navbar";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <HomeNavbar />
      <main className="w-screen">
        {children}
      </main>
    </div>
  );
}
