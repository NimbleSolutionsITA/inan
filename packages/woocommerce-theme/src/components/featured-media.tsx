import React from "react";
import { connect, styled, useConnect } from "frontity";
import { Packages } from "../../types";

interface MediaSizes {
  source_url: string;
  width: number;
}

const FeaturedMedia: React.FC<{ id: number }> = ({ id }) => {
  const { state } = useConnect<Packages>();
  const media = state.source.attachment[id];

  if (!media) return null;

  const srcset =
    Object.values(media.media_details.sizes)
      // Get the url and width of each size.
      .map((item: MediaSizes) => [item.source_url, item.width])
      // Recude them to a string with the format required by `srcset`.
      .reduce(
        (final, current, index, array) =>
          final.concat(
            `${current.join(" ")}w${index !== array.length - 1 ? ", " : ""}`
          ),
        ""
      ) || null;

  return (
    <Container>
      <StyledImage
        // @ts-ignore until this PR is merged: https://github.com/frontity/frontity/pull/650
        alt={media.title?.rendered}
        src={media.source_url}
        srcSet={srcset}
        loading="lazy"
      />
    </Container>
  );
};

export default connect(FeaturedMedia);

const Container = styled.div`
  margin-top: 16px;
  height: 300px;
`;

const StyledImage = styled.img`
  display: block;
  height: 100%;
  width: 100%;
  object-fit: cover;
`;
