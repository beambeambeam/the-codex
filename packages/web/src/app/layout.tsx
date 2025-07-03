import './global.css';

export const metadata = {
  title: 'The Codex',
  description: 'Your personal Librarian that handle every file for you.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen w-full antialiased bg-background h-full">
        {children}
      </body>
    </html>
  );
}
