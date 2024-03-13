import { config, fields, collection, singleton } from "@keystatic/core";
import { wrapper } from "@keystatic/core/content-components";

export default config({
  storage: {
    kind: "local",
  },
  collections: {
    projects: collection({
      label: "Projects",
      slugField: "title",
      columns: ["title"],
      previewUrl: "/projects/{slug}",
      path: "src/content/projects/*",
      entryLayout: "content",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        thumbnail: fields.image({
          label: "Thumbnail Image",
          directory: "src/assets/images/projects",
          publicPath: "../../assets/images/projects/",
        }),
        content: fields.markdoc({
          label: "Content",
          options: {
            image: {
              directory: "src/assets/images/projects",
              publicPath: "../../assets/images/projects/",
            },
          },
          components: {
            Columns: wrapper({
              label: "Columns",
              schema: {},
            }),
            Column: wrapper({
              label: "Column",
              schema: {},
            }),
          },
        }),
      },
    }),
    pages: collection({
      label: "Pages",
      slugField: "title",
      path: "src/content/pages/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        content: fields.document({
          label: "Content",
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: "src/assets/images/pages",
            publicPath: "../../assets/images/pages/",
          },
        }),
      },
    }),
  },
  singletons: {
    settings: singleton({
      label: "Settings",
      schema: {
        name: fields.text({ label: "Name" }),
      },
    }),
  },
});
