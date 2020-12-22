import React from "react";
import { connect, useConnect, styled } from "frontity";
import { CartItem } from "woocommerce-poc/types";
import { Packages } from "../../../types";

const ItemQuantity: React.FC<{ item: CartItem }> = ({ item }) => {
  const { actions } = useConnect<Packages>();

  return (
    <Input
      type="number"
      step="1"
      min="1"
      max=""
      name="quantity"
      value={item.quantity}
      onChange={(event) => {
        actions.woocommerce.updateItemFromCart({
          key: item.key,
          quantity: parseInt(event.target.value, 10) || 0,
        });
      }}
      title="Qty"
      size={4}
      placeholder=""
      inputMode="numeric"
    />
  );
};

export default connect(ItemQuantity);

const Input = styled.input`
  margin-right: 16px;
  padding-left: 1em;
  max-width: 4em;
  height: 2.5em;
`;
