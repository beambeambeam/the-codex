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
      <body>{children}</body>
    </html>
  );
}
