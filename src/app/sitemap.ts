import type { MetadataRoute } from 'next';
import { guideTopicTitles } from '@/components/guide/guideTopics';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://treetweet.vercel.app';
  return [
    { url: `${base}/`, changeFrequency: 'monthly', priority: 1 },
    ...Object.keys(guideTopicTitles).map(topic => ({
      url: `${base}/check/${topic}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
