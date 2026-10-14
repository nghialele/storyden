import type { Metadata } from "next";

import { linkList } from "@/api/openapi-server/links";
import { UnreadyBanner } from "@/components/site/Unready";
import { canonicalPage } from "@/lib/metadata/public";
import { getSettings } from "@/lib/settings/settings-server";
import { LinkIndexScreen } from "@/screens/library/links/LinkIndexScreen";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const url = canonicalPage("/links");

  return {
    title: `Links | ${settings.title}`,
    description: settings.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: `Links | ${settings.title}`,
      description: settings.description,
      url,
    },
  };
}

type Props = {
  searchParams: Promise<{
    q: string;
    page: number;
  }>;
};

export default async function Page(props: Props) {
  try {
    const searchParams = await props.searchParams;

    const { data } = await linkList({
      q: searchParams.q,
      page: searchParams.page?.toString(),
    });

    return (
      <LinkIndexScreen
        initialResult={data}
        query={searchParams.q}
        page={searchParams.page}
      />
    );
  } catch (e) {
    return <UnreadyBanner error={e} />;
  }
}
