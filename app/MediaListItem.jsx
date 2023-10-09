import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { getImageHeightAndWidth } from "./page";

const Figure = styled.figure`
  scroll-snap-align: start;

  display: grid;
  gap: calc(1rem / 2);
  margin: 0;

  cursor: pointer;
  user-select: none;

  outline-offset: 12px;

  &:focus {
    outline-offset: 7px;
  }
`;


const Image = styled.img`
  inline-size: ${(props) => props.inlineSize};
  block-size: ${(props) => props.blockSize};

  aspect-ratio: ${(props) => props.aspectRatio};

  object-fit: cover;

  border-radius: 1ex;
  border: none;
  overflow: hidden;
  background-image: ${(props) =>
    `linear-gradient(to bottom, hsl(40 25% 90%), hsl(40 20% 99%))`};
`;

const Figcaption = styled.figcaption`
  line-height: 1rem;
  // inline-size: ${(props) => props.inlineSize};
  font-weight: 600;
  font-size: .7rem;

  & > p {
    font-size: .8rem;
    font-weight: 400;
    color: hsl(40 20% 15%);
    padding-block: .3rem;
  }
`;

const MediaListItem = ({
  item,
  ratio,
  mediaType,
  size,
}) => {
  const [height, width] = getImageHeightAndWidth(ratio, size);

  return (
    <div style={{ width }} className="gridItem">
        <Figure>
          <picture>
            {item.image.src ? (
              <Image
                aspectRatio={ratio}
                inlineSize={width}
                blockSize={height}
                alt={item.title}
                loading="lazy"
                srcSet={item.image.srcset}
                src={item.image.src}
              />
            ) : (
              <Skeleton width={width} height={height} />
            )}
          </picture>
          <Figcaption inlineSize={width}>
            {item.title || (
              <>
                <Skeleton />
                <Skeleton width="65%" />
              </>
            )}
            {item.caption && <p>{item.caption}</p>}
          </Figcaption>
        </Figure>
      
    </div>
  );
};

export const MediaGridSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  width: 100%;

  .gridItem {
    padding: 15px;
  }
`;


export default MediaListItem;
