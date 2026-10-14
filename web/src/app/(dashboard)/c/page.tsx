import type { Metadata } from "next";

import { collectionList } from "@/api/openapi-server/collections";
import { getServerSession } from "@/auth/server-session";
import { UnreadyBanner } from "@/components/site/Unready";
import { canonicalPage } from "@/lib/metadata/public";
import { getSettings } from "@/lib/settings/settings-server";
import { CollectionIndexScreen } from "@/screens/collection/CollectionIndexScreen";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const url = canonicalPage("/c");

  return {
    title: `Collections | ${settings.title}`,
    description: settings.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: `Collections | ${settings.title}`,
      description: settings.description,
      url,
    },
  };
}

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function Page(props: Props) {
  const { page } = await props.searchParams;

  try {
    const session = await getServerSession();
    const { data } = await collectionList({ page });

    return (
      <CollectionIndexScreen session={session} initialCollections={data} />
    );
  } catch (e) {
    return <UnreadyBanner error={e} />;
  }
}
