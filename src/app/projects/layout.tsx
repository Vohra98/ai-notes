import NavBar from './NavBar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        <html lang="en">
            <body suppressHydrationWarning={true}>
                <NavBar />
                <main className="p-4 max-w-7xl m-auto">{children}</main>
            </body>
        </html>
    </>
  );
}
