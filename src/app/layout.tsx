import type { Metadata } from 'next';
import { Noto_Sans_Bengali } from 'next/font/google';
import './globals.css';

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-bengali',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TreeTweet — জমি কেনার আগে ঝুঁকি যাচাই',
  description: 'বাংলা ও ইংরেজিতে জমির রেকর্ডের প্রাথমিক ঝুঁকি যাচাই। Synthetic land record risk assessment prototype.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn" className={`${notoSansBengali.variable} font-sans`}>
      <body className="min-h-screen antialiased font-sans flex flex-col">{children}</body>
    </html>
  );
}
