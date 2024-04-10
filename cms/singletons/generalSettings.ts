import { fields, singleton } from "@keystatic/core";
import * as customFields from "../fields";
export const generalSettings = singleton({
  label: "General Settings",
  path: "src/settings/general",
  format: { data: "json" },
  schema: {
    favicon: fields.image({
      label: "Favicon",
      directory: "src/assets/images/general",
      publicPath: "../../assets/images/general/",
    }),
  },
});
