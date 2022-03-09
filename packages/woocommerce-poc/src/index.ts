import WooCommerce, { Checkout } from "../types";
import ProductHandler from "./handlers/product";
import ShopHandler from "./handlers/shop";
import CartHandler from "./handlers/cart";
import CheckoutHandler from "./handlers/checkout";
import OrderHandler from "./handlers/order";
import storeApi from "./store-api";
import CoCartAPI from "@cocart/cocart-rest-api";

const CoCart = new CoCartAPI({
  consumerKey: '',
  consumerSecret: '',
  url: 'https://inan.nimble-lab.com'
})

const wooCommerce: WooCommerce = {
  name: "woocommerce",
  state: {
    woocommerce: {
      /**
       * Indicate if the cart has been already syncronized with the backend and
       * it is ready to be shown.
       *
       * The first syncronization happens in the client side, triggered by the
       * `afterCSR` action which is run after the React hydration. We do that to
       * make every single page cachable, including the cart, the checkout, the
       * thank-you page and so on.
       */
      isCartReady: false,

      /**
       * The information of the current cart. Right now we are just
       * copying what the Store API returns, but in the future we should
       * create our own data structure.
       */
      cart: {
        cart_hash: '',
        cart_key: '',
        cross_sells: [],
        coupons: [],
        currency: {
          currency_code: '',
          currency_decimal_separator: '',
          currency_minor_unit: 0,
          currency_prefix: '',
          currency_suffix: '',
          currency_symbol: '',
          currency_thousand_separator: '',
        },
        customer: {
          billing_address: {
            billing_address_1: '',
            billing_address_2: '',
            billing_city: '',
            billing_company: '',
            billing_country: '',
            billing_email: '',
            billing_eu_vat_number: '',
            billing_first_name: '',
            billing_last_name: '',
            billing_phone: '',
            billing_postcode: '',
            billing_state:'',
          },
          shipping_address: {
            shipping_address_1: '',
            shipping_address_2: '',
            shipping_city: '',
            shipping_company: '',
            shipping_country: '',
            shipping_first_name: '',
            shipping_last_name: '',
            shipping_postcode: '',
            shipping_state:'',
          }
        },
        fees:[],
        item_count: 0,
        items: [],
        items_weight: 0,
        needs_payment: false,
        needs_shipping: false,
        notices: [],
        removed_items: [],
        shipping: {
          has_calculated_shipping: false,
          packages: {},
          show_package_details: false,
          total_packages: 0
        },
        taxes: [],
        totals: {
          discount_tax: '',
          discount_total: '',
          fee_tax: '',
          fee_total: '',
          shipping_tax: '',
          shipping_total: '',
          subtotal: '',
          subtotal_tax: '',
          total: '',
          total_tax: '',
        }
      },

      /**
       * The information of the current checkout. The billing and shipping
       * addresses are omitted because they are currently stored in the cart.
       */
      checkout: {
        /**
         * The payment method is currently hardcoded to "cheque".
         */
        payment_method: "cheque",
        customer_note: "",
      },

      /**
       * A map of orders, ordered by id. For the moment they contain what the
       * Store API returns after each successfull checkout.
       */
      order: {},
    },
    source: {
      /**
       * A map of products, ordered by id. They are retrieved using the handlers
       * of the shop (product archive) and the individual products.
       *
       * Even though products are custom post types in WordPress, the Store API
       * doesn't follow the standard schema for post types, so this data is not
       * compatible with regular post types.
       */
      product: {},
    },
  },

  actions: {
    woocommerce: {
      /**
       * Retrieve the cart from the backend. Usually triggered after the
       * client-side hydration. It also marks the cart as ready after the
       * syncronization to inform the theme that the cart is ready to be shown.
       */
      getCart: async ({ state }) => {
        const {data} = await CoCart.get('cart')
        state.woocommerce.cart =  data;
        state.woocommerce.isCartReady = true;
      },

      /**
       * Add a product to the cart.
       *
       * @param id - The cart item product or variation ID.
       * @param quantity - Quantity of this item in the cart.
       */
      addItemToCart: ({ state }) => async ({ id, quantity }) => {
        const {data} = await CoCart.post('cart/add-item', {id: id.toString(), quantity: quantity.toString()})
        console.log('add-item', data)
        state.woocommerce.cart = data;
      },

      /**
       * Remove an item from the cart.
       *
       * @param key - The key of the cart item to remove.
       */
      removeItemFromCart: ({ state }) => async ({ key }) => {




        state.woocommerce.cart = await storeApi({
          state,
          endpoint: "cart/remove-item",
          method: "POST",
          params: { key },
        });
      },

      /**
       * Update an item in the cart.
       *
       * @param key - The key of the cart item to edit.
       * @param quantity - Quantity of this item in the cart.
       */
      updateItemFromCart: ({ state }) => async ({ key, quantity }) => {
        // Update item quantity in the state.
        state.woocommerce.cart.items.find(
          (item) => item.key === key
        ).quantity = quantity;

        // Update cart in the backend.
        state.woocommerce.cart = await storeApi({
          state,
          endpoint: "cart/update-item",
          method: "POST",
          params: { key, quantity },
        });
      },

      /**
       * Apply a coupon to the current cart.
       *
       * @param code - The coupon code.
       */
      applyCoupon: ({ state }) => async ({ code }) => {
        state.woocommerce.cart = await storeApi({
          state,
          endpoint: "cart/apply-coupon",
          method: "POST",
          params: { code },
        });
      },

      /**
       * Remove a coupon from the current cart.
       *
       * @param code - The coupon code.
       */
      removeCoupon: ({ state }) => async ({ code }) => {
        state.woocommerce.cart = await storeApi({
          state,
          endpoint: "cart/remove-coupon",
          method: "POST",
          params: { code },
        });
      },

      /**
       * Update the customer information.
       *
       * @param billingAddress - The billing address. Can be a partial object.
       * @param shippingAddress - The shipping address. Can be a partial object.
       */
      updateCustomer: ({ state }) => async ({
        billingAddress = {},
        shippingAddress = {},
      }) => {
        const { billing_address, shipping_address } = state.woocommerce.cart.customer;

        // Update the current state.
        Object.assign(billing_address, billingAddress);
        Object.assign(shipping_address, shippingAddress);

        // Send the updated values.
        await storeApi({
          state,
          endpoint: "cart/update-customer",
          method: "POST",
          body: { billing_address, shipping_address },
        });
      },

      /**
       * Update the customer note in the state.
       *
       * @param customer_note - The note added by the customer.
       */
      setCustomerNote: ({ state }) => ({ customer_note }) => {
        state.woocommerce.checkout.customer_note = customer_note;
      },

      /**
       * Update the payment method in the state.
       *
       * @param payment_method - The payment method.
       */
      setPaymentMethod: ({ state }) => ({ payment_method }) => {
        state.woocommerce.checkout.payment_method = payment_method;
      },

      /**
       * Place an order and redirect to the thank-you page when it finishes.
       *
       * @param payment_data - An optional object containing the payment data.
       */
      placeOrder: ({ state, actions }) => async ({ payment_data } = {}) => {
        const { payment_method, customer_note } = state.woocommerce.checkout;
        const { billing_address, shipping_address } = state.woocommerce.cart.customer;

        // Get the checkout result from the REST API.
        const checkout: Checkout = await storeApi({
          state,
          endpoint: "checkout",
          method: "POST",
          body: {
            billing_address,
            shipping_address,
            payment_method,
            customer_note,
            payment_data: payment_data || {},
          },
        });

        // Create an order entity putting all the information together.
        state.woocommerce.order[checkout.order_id] = {
          checkout,
          // Shallow clone the current cart.
          cart: { ...state.woocommerce.cart },
        };

        // Get the current cart from the REST API. It should be empty now. We
        // don't need to wait for the response here.
        actions.woocommerce.getCart();

        // Finally, this action redirects the user to the order page.
        actions.router.set(checkout.payment_result.redirect_url);
      },

      afterCSR: ({ actions }) => {
        actions.woocommerce.getCart();
      },
    },
  },

  libraries: {
    source: {
      handlers: [
        ProductHandler,
        ShopHandler,
        CartHandler,
        CheckoutHandler,
        OrderHandler,
      ],
    },
  },
};

export default wooCommerce;

export * from "./type-guards";
