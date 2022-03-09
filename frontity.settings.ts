import { Settings } from "frontity/types";
import Source from "@frontity/source/types";
import WooCommerce from "woocommerce-poc/types";
import WooCommerceTheme from "woocommerce-theme/types";

const {
  NAME,
  TITLE,
  DESCRIPTION,
  URL,
} = process.env

const settings: Settings<Source | WooCommerce | WooCommerceTheme> = {
  name: NAME,
  state: {
    frontity: {
      url: URL,
      title: TITLE,
      description: DESCRIPTION,
    },
  },
  packages: [
    {
      name: "woocommerce-theme",
      state: {
        theme: {
          menu: [
            ["Home", "/"],
            ["Shop", "/shop/"],
          ],
          autoPrefetch: "in-view",
        },
      },
    },
    {
      name: "@frontity/wp-source",
      state: {
        source: {
          url: URL
        },
      },
    },
    "@frontity/tiny-router",
    "@frontity/html2react",
    "woocommerce-poc",
  ],
};

export default settings;
