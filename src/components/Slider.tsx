import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import { ListItem, Media, SearchResult } from '../types/interface';
import Image from "next/image"

interface SliderPropTypes{
    trending: {
        series: SearchResult[];
        movies: SearchResult[];
    };
    listItems: (ListItem & {
        media: Media;
    })[] | undefined;
}

function Slider({trending, listItems}: SliderPropTypes) {
  const trendingSeries = trending.series;
  const [activeSlide, setActiveSlide] = useState(0);
  console.log(trendingSeries)

  const prevSliderHandler = (index: number) => {
    if (index === 0) {
      setActiveSlide(trendingSeries.length);
    } else if (index > 0) {
      setActiveSlide(activeSlide - 1);
    } else {
      setActiveSlide(trendingSeries.length - 1);
    }
  };

  const nextSliderHandler = (index: number) => {
    if (index === trendingSeries.length) {
      setActiveSlide(1);
    } else if (index < trendingSeries.length) {
      setActiveSlide(activeSlide + 1);
    } else {
      setActiveSlide(trendingSeries.length - 1);
    }
  };

  return (
    <div className='m-6 xs:w-screen sm:max-w-7xl sm:w-1/2'>
      {trendingSeries.map((item, index) => {
        const { id, backdrop_path, name, overview } = item;
        return (
          <div
            key={id}
            className={
              activeSlide === index
                ? 'flex justify-between items-center text-white'
                : 'hidden'
            }
          >
            <button
              className='text-3xl absolute left-0'
              onClick={() => prevSliderHandler(index)}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div className='flex flex-col items-center relative w-max'>
              <Image 
                className='w-full m-0 p-0'
                src={`https://image.tmdb.org/t/p/w342/${backdrop_path}`} 
                alt={name ? name : "series backdrop"}
                width={600}
                height={326}/>
              <h2 className='text-lg font-bold my-6 absolute text-white'>{name}</h2>
            </div>
            <button
              className='text-3xl absolute right-0'
              onClick={() => nextSliderHandler(index)}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Slider;