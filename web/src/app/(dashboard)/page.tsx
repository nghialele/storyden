import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { type Node } from "@/api/openapi-schema";
import { nodeList } from "@/api/openapi-server/nodes";
import { ContentComposer } from "@/components/content/ContentComposer/ContentComposer";
import { UnreadyBanner } from "@/components/site/Unready";
import { LinkButton } from "@/components/ui/link-button";
import { PageHeading } from "@/components/ui/page-heading";
import { PageLayout } from "@/components/ui/page-layout";
import { SectionHeading } from "@/components/ui/section-heading";
import { Text } from "@/components/ui/text";
import { canonicalPage, jsonLD } from "@/lib/metadata/public";
import type { Settings } from "@/lib/settings/settings";
import { getSettings } from "@/lib/settings/settings-server";
import * as z from "@/lib/validation";
import { LStack, WStack } from "@/styled-system/jsx";

type Props = {
  searchParams: Promise<Query>;
};

const QuerySchema = z.object({
  page: z.optional(
    z
      .pipe(z.string().check(z.regex(/^[1-9]\d*$/)), z.transform(Number))
      .check(z.refine(Number.isSafeInteger)),
  ),
});
type Query = z.input<typeof QuerySchema>;

export default async function Page({ searchParams }: Props) {
  const query = QuerySchema.safeParse(await searchParams);
  if (!query.success || (query.data.page && query.data.page > 1)) {
    notFound();
  }

  let settings: Settings;
  let featuredNodes: Node[] = [];
  try {
    settings = await getSettings();
  } catch (error) {
    return <UnreadyBanner error={error} />;
  }

  try {
    const { data } = await nodeList(
      { visibility: ["published"], depth: "0" },
      { anonymous: true, cache: "no-store" },
    );
    featuredNodes = data.nodes;
  } catch {
    // The landing page remains useful when public Library content is unavailable.
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.title,
    description: settings.description,
    url: canonicalPage("/"),
  };

  return (
    <PageLayout>
      <LStack gap="6" padding="4" paddingBlockEnd="8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLD(structuredData) }}
        />

        <LStack gap="1">
          <PageHeading>{settings.title}</PageHeading>
          <Text variant="supporting">{settings.description}</Text>
        </LStack>

        {settings.content && (
          <ContentComposer
            initialValue={settings.content}
            value={settings.content}
            disabled
          />
        )}

        <WStack gap="2" flexWrap="wrap" aria-label="Primary destinations">
          <LinkButton href="/l" variant="solid">
            Writing and notes
          </LinkButton>
          <LinkButton href="/c" variant="outline">
            Projects and collections
          </LinkButton>
          <LinkButton href="/links" variant="outline">
            Elsewhere
          </LinkButton>
          <LinkButton href="/m" variant="ghost">
            Members
          </LinkButton>
        </WStack>

        <LStack gap="3">
          <LStack gap="1">
            <SectionHeading>Featured writing</SectionHeading>
            <Text variant="supporting">
              Durable notes, essays, and reference pages from the Library.
            </Text>
          </LStack>
          {featuredNodes.length > 0 ? (
            <LStack as="ul" gap="3">
              {featuredNodes.map((node) => (
                <li key={node.id}>
                  <LStack gap="1">
                    <Link href={`/l/${node.slug}`}>{node.name}</Link>
                    {node.description && (
                      <Text variant="supporting">{node.description}</Text>
                    )}
                  </LStack>
                </li>
              ))}
            </LStack>
          ) : (
            <Text variant="supporting">
              The Library is ready for its first published page.
            </Text>
          )}
        </LStack>
      </LStack>
    </PageLayout>
  );
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const query = QuerySchema.safeParse(await searchParams);

  if (!query.success || (query.data.page && query.data.page > 1)) {
    return { title: "Page not found", robots: { index: false, follow: false } };
  }

  const settings = await getSettings();
  const url = canonicalPage("/");

  return {
    title: `${settings.title} | ${settings.description}`,
    description: settings.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: settings.title,
      description: settings.description,
      url,
    },
  };
}
