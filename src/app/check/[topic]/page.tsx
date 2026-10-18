import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LandTechApp from '@/components/LandTechApp';
import { guideTopicTitles, isGuideTopic } from '@/components/guide/guideTopics';

type TopicPageProps = { params: Promise<{ topic: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(guideTopicTitles).map(topic => ({ topic }));
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { topic } = await params;
  if (!isGuideTopic(topic)) notFound();
  const title = `${guideTopicTitles[topic][0]} — TreeTweet`;
  const description = `${guideTopicTitles[topic][0]}: কী কাগজ দেখবেন ও কোথায় সাহায্য পাবেন। সহজ বাংলা ও ইংরেজিতে স্বাধীন সহায়িকা; সরকারি রেকর্ড সরাসরি যাচাই করা হয় না।`;
  const url = `/check/${topic}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'bn_BD',
      alternateLocale: ['en_US'],
      siteName: 'TreeTweet',
      title,
      description,
      url,
      images: [{ url: '/social-card.png', width: 1200, height: 630, alt: 'TreeTweet — Check before you buy. Five essential land record checks.' }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/social-card.png'] },
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { topic } = await params;
  if (!isGuideTopic(topic)) notFound();
  return <LandTechApp guideTopic={topic} />;
}
