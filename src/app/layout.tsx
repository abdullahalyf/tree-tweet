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
  metadataBase: new URL('https://treetweet.vercel.app'),
  description: 'জমি কেনার আগে মালিক, নামজারি, মামলা, খাস ও অধিগ্রহণের তথ্য কোথায় যাচাই করবেন—সহজ বাংলা ও ইংরেজিতে সরকারি সেবার নির্দেশিকা।',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website', locale: 'bn_BD', alternateLocale: ['en_US'],
    url: '/', siteName: 'TreeTweet',
    title: 'TreeTweet — জমি কেনার আগে ৫টি জরুরি খোঁজ',
    description: 'মালিক, নামজারি, মামলা, খাস ও অধিগ্রহণ: সরকারি সেবা ও সহজ করণীয়। স্বাধীন সহায়ক প্রকল্প; সরাসরি সরকারি রেকর্ড সংযোগ নেই।',
    images: [{ url: '/social-card.png', width: 1200, height: 630, alt: 'TreeTweet — Check before you buy. Five essential land record checks.' }],
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/icon.svg', apple: '/apple-touch-icon.png' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn" className={`${notoSansBengali.variable} font-sans`}>
      <body className="min-h-screen antialiased font-sans flex flex-col">{children}</body>
    </html>
  );
}
