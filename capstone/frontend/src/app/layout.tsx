import './globals.css';
import AppWalletProvider from "../components/AppWalletProvider";
import { Toaster } from '@/components/ui/toaster'

export const metadata = {
  title: 'FarmLink',
  description: 'Driving Agricultural Evolution with Innovation',
};
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppWalletProvider>
          {children}
          <Toaster />
        </AppWalletProvider>
      </body>
    </html>
  )
}
