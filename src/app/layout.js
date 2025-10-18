// ...existing code...
export const metadata = {
  title: "Shopping Platform",
  description: "A simple shopping platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}
// ...existing code...