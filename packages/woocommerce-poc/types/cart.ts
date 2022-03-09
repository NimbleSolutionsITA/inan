import { ProductPrices, ProductImage } from "./entities";


export interface Currency {
  currency_code: string;
  currency_decimal_separator: string;
  currency_minor_unit: number;
  currency_prefix: string;
  currency_suffix: string;
  currency_symbol: string;
  currency_thousand_separator: string;
}

export interface BillingAddress {
  billing_address_1: string;
  billing_address_2: string;
  billing_city: string;
  billing_company: string;
  billing_country: string;
  billing_email: string;
  billing_eu_vat_number: string;
  billing_first_name: string;
  billing_last_name: string;
  billing_phone: string;
  billing_postcode: string;
  billing_state:string;
}

export interface ShippingAddress {
  shipping_address_1: string;
  shipping_address_2: string;
  shipping_city: string;
  shipping_company: string;
  shipping_country: string;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_postcode: string;
  shipping_state:string;
}

export interface Customer {
  billing_address: BillingAddress;
  shipping_address: ShippingAddress;
}

export interface ShippingPackage {
  chosen_method: string;
  formatted_destination: string;
  index: number;
  package_details: string;
  package_name: string;
  rates: {
    [name: string]: {
      chosen_method: boolean;
      cost: string;
      html: string;
      instance_id: number;
      key: string;
      label: string;
      meta_data: {
        items: string;
      }
      method_id: string;
      taxes: string;
    }
  }
}

export interface Shipping {
  has_calculated_shipping: boolean;
  packages: {
    [name: string]: ShippingPackage;
  };
  show_package_details: boolean;
  total_packages: number;
}

export interface Totals {
  discount_tax: string;
  discount_total: string;
  fee_tax: string;
  fee_total: string;
  shipping_tax: string;
  shipping_total: string;
  subtotal: string;
  subtotal_tax: string;
  total: string;
  total_tax: string;
}

export interface CrossSellItem {
  average_rating: string;
  id: number;
  image: string;
  name: string;
  on_sale: boolean;
  price: string;
  regular_price: string;
  sale_price: string;
  slug: string;
  title: string;
  type: string;
}

export interface CartNotice {
  [status: string]: string[]
}

export interface Cart {
  cart_hash: string;
  cart_key: string;
  cross_sells: CrossSellItem[];
  coupons: string[];
  currency: Currency;
  customer: Customer;
  fees: string[];
  item_count: number;
  items: CartItem[];
  items_weight: number;
  needs_payment: boolean;
  needs_shipping: boolean;
  notices: CartNotice[];
  removed_items: string[];
  shipping: Shipping
  taxes: string[];
  totals: Totals;
}

export interface CartItemQuantity {
  "value": number;
  "min_purchase": number;
  "max_purchase": number;
}

export interface CartItemTotals {
  "subtotal": number;
  "subtotal_tax": number;
  "total": number;
  "tax": number;
}

export interface CartItemMetaDimensions {
  "length": string;
  "width":string;
  "height": string;
  "unit": string;
}

export interface CartItemMeta {
  "product_type": string;
  "sku": string;
  "dimensions": CartItemMetaDimensions;
  "weight": number;
  "variation": string[];
  "virtual": boolean;
  "downloadable": boolean;
}

export interface Category {
  "term_id": number;
  "name": string;
  "slug": string;
  "term_group": number;
  "term_taxonomy_id": number;
  "taxonomy": string;
  "description": string;
  "parent": number;
  "count": number;
  "filter": string;
}

export interface StockStatus {
  "status":string;
  "stock_quantity": number;
  "hex_color": string;
}

export interface StockStatus {
  "status":string;
  "stock_quantity": number;
  "hex_color": string;
}

export interface CartItem {
  "item_key": string;
  "id": number;
  "name": string;
  "title": string;
  "price": string;
  "quantity": CartItemQuantity;
  "totals": CartItemTotals;
  "slug": string;
  "meta": CartItemMeta;
  "backorders": string;
  "cart_item_data": string[];
  "featured_image": string;
  "categories": Category[];
  "tags": boolean;
  "stock_status": StockStatus;
  "gallery": {
    [id: string]: string;
  },
  "permalink": string;
  "is_discounted": boolean;
  "price_regular": string;
  "price_sale": string;
  "price_discounted": string;
}

export interface CartItemPrices extends ProductPrices {
  raw_prices: {
    precision: number;
    price: string;
    regular_price: string;
    sale_price: string;
  };
}