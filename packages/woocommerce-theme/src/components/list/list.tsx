import React from "react";
import { connect, styled, decode, useConnect } from "frontity";
import Item from "./list-item";
import Pagination from "./pagination";
import { Packages } from "../../../types";
import { isTerm, isAuthor, isArchive } from "@frontity/source";
import { ArchiveData } from "@frontity/source/types";

interface Props {
  when?: boolean;
  data: ArchiveData;
}

const List: React.FC<Props> = ({ data }) => {
  const { state } = useConnect<Packages>();

  return (
    <Container>
      {/* If the list is a term, we render a title. */}
      {isTerm(data) && (
        <Header>
          {data.taxonomy}:{" "}
          <b>{decode(state.source[data.taxonomy][data.id].name)}</b>
        </Header>
      )}

      {/* If the list is for a specific author, we render a title. */}
      {isAuthor(data) && (
        <Header>
          Author: <b>{decode(state.source.author[data.id].name)}</b>
        </Header>
      )}

      {/* Iterate over the items of the list. */}
      {data.items.map(({ type, id }) => {
        const item = state.source[type][id];
        // Render one Item component for each one.
        return <Item key={item.id} item={item} />;
      })}
      <Pagination />
    </Container>
  );
};

export default connect(List);

const Container = styled.section`
  width: 800px;
  margin: 0;
  padding: 24px;
  list-style: none;
`;

const Header = styled.h3`
  font-weight: 300;
  text-transform: capitalize;
  color: rgba(12, 17, 43, 0.9);
`;
