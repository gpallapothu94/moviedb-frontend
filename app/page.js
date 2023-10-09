"use client"
import styles from './page.module.css'
import styled from "styled-components";
import MediaListItem, { MediaGridSection } from './MediaListItem';
import { useEffect, useState } from 'react';
import useDebounce from './useDebounce';

export const getImageHeightAndWidth = (
  ratio,
  size
) => {
  const [widthRatio, heightRatio] = ratio.split("/").map((i) => +i);

  const height =
    widthRatio > heightRatio
      ? `${size}rem`
      : `${(size * heightRatio) / widthRatio}rem`;

  const width =
    widthRatio > heightRatio
      ? `${(size * widthRatio) / heightRatio}rem`
      : `${size}rem`;

  return [height, width];
};

const environment = {
  apiKey: process.env.REACT_APP_MOVIEDB_KEY,
  baseURL: process.env.REACT_APP_BASEURL,
  imageBaseURL: "https://image.tmdb.org/t/p/"
};

const {imageBaseURL} = environment;


export const ImageSize = {
  poster: ["w92", "w154", "w185", "w342", "w500", "w780", "original"],
  backdrop: ["w300", "w780", "w1280", "original"],
  profile: ["w45", "w185", "original"],
};

export function getImageSrc(path, type) {
  const img = { src: "", srcset: "" };
  if (path) {
    img.src = `${imageBaseURL}original${path}`;
    const sizes = ImageSize[type].filter((size) => size !== "original");
    const paths = sizes.map(
      (size) => `${imageBaseURL}${size}${path} ${size.substring(1)}w`
    );
    img.srcset = paths.join(", ");
  }
  return img;
}

export const getReleaseDate = (release_date) =>
  new Date(release_date).toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });


export const ButtonContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  width: min-content;
  border-radius: .6rem;
  // border: 1px solid #ccc;

  & > button {
    border: none;
    border-radius: inherit;
  }

  & > input {
    margin-left : .5rem;
    padding-inline: .5rem;
    border-radius: inherit;
  }
`;

export const Header = styled.header`
  display: grid;
  grid-auto-flow: column;
  align-items: flex-start;
  justify-content: start;
  padding-inline: 1rem;
  padding-block: .3rem;
  grid-gap: .3rem;

  & h1 {
    font-size: 1.5rem;
  }
`;

const Button = styled.button`
  min-width: max-content;
  height: min-content;
  color: ${({ primary }) => {
    if (primary) {
      return 'hsl(40 25% 90%)';
    }
    return 'hsl(40, 100%, 10%)';
  }};

  border-radius: .4rem;
  border: 1px solid hsl(40, 100%, 10%);
  font-weight: 600;

  background-color: ${({ primary }) => {
    if (primary) {
      return 'hsl(40, 100%, 10%)';
    }
    return "inherit";
  }};

  text-transform: capitalize;
  cursor: pointer;

  padding-block: .4rem;
  padding-inline: .7rem;
`;

export default function Home() {
  let [data, setData] = useState({results: []});

  
  const [selectedMedia, setSelectedMedia] = useState("movie");
  
  const [searchTerm, setSearchTerm] = useState("");
  
  const debouceSearchValue = useDebounce(searchTerm, 150);
  console.log({debouceSearchValue});

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleButton = () => setSelectedMedia(selectedMedia === "movie" ? "tv" : "movie");

  useEffect(() => {
    async function fetchData() {
      const response = await getData(selectedMedia, debouceSearchValue);
      setData(response);
    }
    fetchData();
    return () => {};
  },[selectedMedia, debouceSearchValue]);

  
  const processedData  = data?.results.map(({id, title, original_title, backdrop_path, release_date }) => ({ id, title: title || original_title, image: getImageSrc(backdrop_path, "backdrop"),
  caption: getReleaseDate(release_date),}));
  const mediaItemSize = 7;
  const [, gridItemWidth] = getImageHeightAndWidth(
    "16/9",
    mediaItemSize
  );

  return (
    <main className={styles.main}>
    
      <Header>       
      <h1>Movie DB</h1>
      <ButtonContainer>
          <Button
            primary={selectedMedia === "movie"}
            disabled={selectedMedia === "movie"}
            onClick={handleButton}
          >
            {"movie"}
          </Button>
          <Button
            primary={selectedMedia === "tv"}
            disabled={selectedMedia === "tv"}
            onClick={handleButton}
          >
            {"tv"}
          </Button>
        <input placeholder='Search' type='text' value={searchTerm} onChange={handleSearch}/>

      </ButtonContainer>
        </Header>


      <MediaGridSection id="movies" gridItemSize={gridItemWidth}>  
            {processedData.map((item, index) => (
              <MediaListItem
                key={item.id || index}
                item={item}
                ratio="16/9"
                mediaType={"movie"}
                size={mediaItemSize}
              />
            ))}
          
        
        </MediaGridSection>
    </main>
  )
}

async function getData(selectedMedia, searchTerm, page = 1) {
  const urlPath = selectedMedia === "movie" ? "movies" : "tv-shows";
  const baseURL = 'http://localhost:8080';
  
  let url = `${baseURL}/${urlPath}`;
  if(searchTerm) {
    url = `${url}/search?query=${searchTerm}&page=${page}`;
  } else {
    url = `${url}?page=${page}`;
  }

  const res = await fetch(url);
 
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}
