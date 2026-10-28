import AuthProvider from "./context/AuthContext"; // Apne path ke hisab se update kar lein

export const metadata = {
  title: "Waqas Website",
  description: "Management portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}