import './globals.css';
import AppWalletProvider from "./components/AppWalletProvider";

export const metadata = {
  title: 'FarmLink',
  description: 'Driving Agricultural Evolution with Innovation',
};
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppWalletProvider>{children}</AppWalletProvider>
      </body>
    </html>
  );
}