<p align="center">
  <a aria-label="storyden logo" href="https://storyden.org">
    <img src="home/public/opengraph-1584-396.png"  />
  </a>
</p>

<p align="center">
  <em>a modern community platform</em>
</p>

<p align="center">
  <a
    href="https://storyden.org/docs"
  >Documentation</a>
  |
  <a
    href="https://makeroom.club"
  >Friends</a>
</p>

<p align="center">
  With a fresh new take on traditional bulletin board web forum software,
  Storyden is a modern, secure and extensible platform for building communities.
</p>

# Storyden

Storyden is the platform for managing community and content, wherever they call home. Run a forum, a blog, post news, curate cool sites, build a directory, a knowledgebase and more. [Learn more here](https://www.storyden.org/docs/introduction/what-is-storyden).

If you'd like to help with some research, please fill in this tiny (anonymous) form: https://airtable.com/shrLY0jDp9CuXPB2X

You can try it right now! Run the image and open http://localhost:8000 in your browser:

```sh
docker run -p 8000:8000 ghcr.io/southclaws/storyden
```

![A screenshot of a Storyden instance](home/public/2026_app_screenshot.png)

## Releases and versions

Storyden releases tagged versions using a simple version number which applies to the product _as a whole_ not the API surface. For this reason, we do not use "semantic versioning" and breaking API changes are avoided as much as possible. Sometimes breaking changes may occur but these will always be documented and called out in release notes as well as in a separate list of just breaking changes.

```
  v1.25.8
   │ │  │
   │ │  └── Release: increments for every release in the year.
   │ └───── Year: releases happen frequently so we use a year marker for simplicity
   └─────── Major: will always be 1
```

This format was chosen for compatibility with package/app registries and developer expectations, but it does not follow semantic versioning, it's more of a "build number" similar to how video games are versioned.

Outside of a release commit/image, version numbers inside files and the API will be suffixed with `-post` to indicate you're off a stable release.

## What can it do

> https://www.storyden.org/docs/introduction/what-is-storyden

Storyden is a modern forum, wiki and community hub. Like the internet forums of the past, but with a fresh coat of paint and modern security, deployment and intelligence features. A discussion forum, a Notion workspace and your own Reddit platform all rolled into one. Your community can use it for discussion, sharing links or building a directory of knowledge or structured data.

It's open source, [super easy to self host](https://www.storyden.org/docs/introduction/vps) and an homage to the 2000s internet!

## Why

> https://www.storyden.org/blog/building-running-administrating-modern-forum-software

The short version is: most forums are decades old, insecure, abandoned or just not pretty. Storyden aims to solve all of that with a modern language, simple deployment and beautiful design.

## Contributing

See [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md) for local development documenation.

Contributions are very very welcome! ❤️ Until we get a proper guide set up, please open an issue if you have any questions!

## Personal frontend fork

This fork keeps Storyden's Go backend, OpenAPI contracts, persistence model,
authentication, authorization, administration, community routes, and generated
clients intact. Personal presentation is implemented through the existing
frontend composition and installation settings so upstream changes remain easy
to merge.

### Personal route map

| Personal section | Storyden surface | Content workflow |
| --- | --- | --- |
| Home | `/` | Installation title, description, About content, and index-page layout |
| Writing and notes | `/l` and `/l/<slug>` | Published Library pages |
| Projects and collections | `/c` and `/c/<id>` | Published collections |
| Elsewhere | `/links` and `/links/<slug>` | Shared link directory |
| About and people | `/m` and `/m/<handle>` | Public member profiles |

Discussion, search, notifications, authentication, settings, moderation, and
administration remain available for future participation and platform
operations.

### Instance configuration checklist

Use the supported admin UI/API rather than editing frontend source for personal
content: set the title, description, About introduction, accent colour, icon,
banner, registration mode, public-access policy, and navigation order. Add
Library pages for biography, writing, and documentation; collections for
projects and recommendations; links for external destinations; and a public
profile for owner identity. Use the existing theme asset mechanism only for
installation-wide CSS/JS that settings cannot express.

### Deployment and content backup

Deploy the same backend, database, API, and web environment required by the
upstream Storyden release. Record the upstream base version and required
environment variables with the deployment configuration used by the operator.
Back up the Storyden database and uploaded assets together; restore both into a
staging instance before production recovery. Validate anonymous access to `/`,
`/l`, `/c`, `/links`, and `/m/<handle>` after restore, then verify login and
administration separately.
