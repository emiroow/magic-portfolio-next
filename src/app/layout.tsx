import "./globals.css";
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
