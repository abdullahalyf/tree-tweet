export const checks = [
  {
    id: 'owner', title: ['মালিক ও জমির পরিচয়', 'Owner and plot identity'],
    body: ['বিক্রেতার কাছ থেকে দলিল, খতিয়ান ও পরিচয়পত্র দেখুন। জেলা, উপজেলা, মৌজা, জরিপ, খতিয়ান ও দাগ মিলিয়ে রেকর্ড খুঁজুন। শুধু দাগ নম্বর দিয়ে সারা দেশের জমি চেনা যায় না।', 'Ask the seller for the deed, khatian and identity document. Match district, upazila, mouza, survey, khatian and plot. A plot number alone is not unique across Bangladesh.'],
    office: ['দলিলের নকল ও হস্তান্তরের ধারাবাহিকতা সংশ্লিষ্ট সাব-রেজিস্ট্রি অফিসে মিলিয়ে নিন। খতিয়ান একাই চূড়ান্ত মালিকানার নিশ্চয়তা নয়।', 'Check certified deed copies and the transfer chain at the relevant sub-registry office. A khatian alone does not establish a clear title.'],
    links: [{ bn: 'খতিয়ান ও ম্যাপের সরকারি সেবা', en: 'Official khatian and map service', href: 'https://dlrms.land.gov.bd/' }],
  },
  {
    id: 'mutation', title: ['নামজারির কাগজ ও ইতিহাস', 'Mutation papers and history'],
    body: ['বিক্রেতার নামজারি খতিয়ান, আদেশ, আবেদন বা মামলা নম্বর এবং আগের নামজারির কাগজ চান। দলিলের দাগ ও জমির পরিমাণের সঙ্গে মিলিয়ে নিন।', 'Ask for the seller’s mutation khatian, order, application or case number, and earlier mutation papers. Compare the plots and area with the deed.'],
    office: ['অসম্পূর্ণ ইতিহাস বা অমিল থাকলে সহকারী কমিশনার (ভূমি) অফিসে মূল নথি যাচাই করুন। অনলাইনে পুরো ইতিহাস নাও থাকতে পারে।', 'For gaps or differences, check the original file at the Assistant Commissioner (Land) office. The complete history may not be online.'],
    links: [{ bn: 'সরকারি নামজারি সেবা', en: 'Official mutation service', href: 'https://mutation.land.gov.bd/' }],
  },
  {
    id: 'case', title: ['মামলা বা নিষেধাজ্ঞা', 'Cases or court orders'],
    body: ['বিক্রেতার কাছে মামলা নম্বর, সাল ও আদালতের নাম জানতে চান। জানা মামলা সরকারি কার্যতালিকায় দেখুন; ভূমি রাজস্ব মামলার তথ্যও আলাদা করে মিলিয়ে নিন।', 'Ask the seller for known case numbers, years and court names. Look up known cases in the official cause list, and check land revenue cases separately.'],
    office: ['অনুসন্ধানে কিছু না পাওয়া মানে মামলা নেই নয়। সংশ্লিষ্ট আদালত, ভূমি অফিস ও আইনজীবীর সাহায্যে আদেশ ও জমির পরিচয় মিলিয়ে নিন।', 'No search result does not mean no case exists. Match orders and plot identity with the relevant court, land office and a lawyer.'],
    links: [{ bn: 'আদালতের সরকারি কার্যতালিকা', en: 'Official court cause list', href: 'https://causelist.judiciary.gov.bd/' }, { bn: 'ভূমি রাজস্ব মামলা সেবা', en: 'Land revenue case service', href: 'https://case.gov.bd/' }],
  },
  {
    id: 'khas', title: ['সরকারি খাস জমি কি না', 'Government khas land status'],
    body: ['সর্বশেষ রেকর্ড ও জমির শ্রেণি দেখুন। সরকারি খাস জমি কি না তা নিয়ে সন্দেহ হলে বিক্রেতার কথার ওপর নির্ভর করবেন না।', 'Check the latest record and land classification. If government khas ownership is uncertain, do not rely on the seller’s statement alone.'],
    office: ['ইউনিয়ন ভূমি অফিস ও সহকারী কমিশনার (ভূমি) অফিসে সংশ্লিষ্ট খাস রেজিস্টার ও রেকর্ড মিলিয়ে দেখুন। লিখিত তথ্য পাওয়ার উপায় জিজ্ঞেস করুন। এই অ্যাপে সরাসরি খাস রেজিস্টার নেই।', 'Ask the Union Land Office and Assistant Commissioner (Land) office to check the relevant khas register and records, and how to obtain written information. This app cannot query that register.'],
    links: [{ bn: 'ভূমি মন্ত্রণালয়ের সেবার প্রবেশপথ', en: 'Ministry of Land service portal', href: 'https://www.land.gov.bd/' }],
  },
  {
    id: 'acquisition', title: ['অধিগ্রহণের নোটিশ বা মামলা', 'Acquisition notices or cases'],
    body: ['কোনো সরকারি প্রকল্পের অধিগ্রহণের নোটিশ, এলএ মামলা বা জমির তফসিল আছে কি না খোঁজ নিন। মৌজা ও দাগ ধরে নথি মিলিয়ে দেখুন।', 'Ask whether an acquisition notice, LA case or land schedule applies to a public project. Match the documents using mouza and plot details.'],
    office: ['জেলা প্রশাসকের কার্যালয়ের ভূমি অধিগ্রহণ (এলএ) শাখায় নোটিশ ও বর্তমান অবস্থা নিশ্চিত করুন। নিচের সেবা সব জমির জন্য উন্মুক্ত অনুসন্ধান নয়।', 'Confirm notices and current status with the Deputy Commissioner’s Land Acquisition (LA) section. The service below is not an open search covering every plot.'],
    links: [{ bn: 'সরকারি অধিগ্রহণ ব্যবস্থাপনা সেবা', en: 'Official acquisition management service', href: 'https://larms.land.gov.bd/' }],
  },
] as const;

export type CheckId = typeof checks[number]['id'];
export type PaperStatus = 'missing' | 'collected' | 'mismatch';
export type GuideTopic = CheckId | 'papers' | 'preparation' | 'help';

export const guideTopicTitles: Record<GuideTopic, readonly [string, string]> = {
  owner: checks[0].title,
  mutation: checks[1].title,
  case: checks[2].title,
  khas: checks[3].title,
  acquisition: checks[4].title,
  papers: ['আগে যে কাগজগুলো হাতে রাখবেন', 'Papers to gather first'],
  preparation: ['আপনার প্রস্তুতির তালিকা', 'Your preparation checklist'],
  help: ['সহজ সাহায্য ও তথ্যের উৎস', 'Help and information sources'],
};

export function isGuideTopic(value: string): value is GuideTopic {
  return Object.prototype.hasOwnProperty.call(guideTopicTitles, value);
}

