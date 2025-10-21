import './globals.css'
import AuthProvider from '@/components/providers/AuthProvider'

export const metadata = {
  title: "Shopping Platform",
  description: "A modern shopping platform with admin dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}