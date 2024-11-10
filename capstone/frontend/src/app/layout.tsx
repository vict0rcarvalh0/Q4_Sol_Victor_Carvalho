import './globals.css';

export const metadata = {
  title: 'FarmLink',
  description: 'Driving Agricultural Evolution with Innovation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
