import React from "react";
import { styled, connect, useConnect } from "frontity";
import Link from "./link";
import { Packages } from "../../types";

const MenuModal = () => {
  const { state } = useConnect<Packages>();
  const { menu } = state.theme;
  const isThereLinks = menu != null && menu.length > 0;

  return (
    <>
      <MenuOverlay />
      <MenuContent>
        {isThereLinks &&
          menu.map(([name, link]) => (
            <MenuLink
              key={name}
              link={link}
              aria-current={state.router.link === link ? "page" : undefined}
            >
              {name}
            </MenuLink>
          ))}
        <MenuLink key={"cart"} link={"/cart/"}>
          Cart ({state.woocommerce.cart.items.length})
        </MenuLink>
      </MenuContent>
    </>
  );
};

const MenuOverlay = styled.div`
  background-color: #1f38c5;
  width: 100vw;
  height: 100vh;
  overflow: hidden auto;
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
`;

const MenuContent = styled.nav`
  z-index: 3;
`;

const MenuLink = styled(Link)`
  width: 100%;
  display: inline-block;
  outline: 0;
  font-size: 20px;
  text-align: center;
  padding: 1.2rem 0;

  &:hover,
  &:focus {
    background-color: rgba(0, 0, 0, 0.05);
  }
  /* styles for active link */
  &[aria-current="page"] {
    color: yellow;
    font-weight: bold;
    /* border-bottom: 4px solid yellow; */
  }
`;

export default connect(MenuModal);
