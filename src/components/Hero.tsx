import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faFilledHeart } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { HeroPropTypes, Media, ResultProps, UnauthedResultProps,} from '../types/interface';
import Image from "next/image"
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import useHover from '../utils/useHover';

function Hero({trending, listItems, addListItem, removeListItem, user}: HeroPropTypes) {
  const trendingSeries = trending.series;

  return (
    <div className='m-6 xs:w-screen sm:max-w-7xl relative flex flex-wrap justify-center'>
      {trendingSeries.map((result) => {
        if(user === null){
          return(
            <UnauthedResult 
              key={result.id} 
              result={result}  />
          )
        }else if(listItems === undefined){
          return(
            <Result 
              key={result.id} 
              result={result} 
              user={user} 
              addListItem={addListItem}
              removeListItem={removeListItem}
              listItem={undefined} />
          )
        }else{
          const listItem = listItems[listItems.findIndex(item => item.mediaID === result.id)]
          return(
            <Result 
              key={result.id} 
              result={result} 
              user={user} 
              addListItem={addListItem}
              removeListItem={removeListItem}
              listItem={listItem} />
          )

          }})}
    </div>
  );
}

export default Hero;

const UnauthedResult = ({result}: UnauthedResultProps) =>{
  const [hoverRef, isHovered] = useHover()
  const id = result.id
  const linkAddress = result.media_type === "tv" ? `/series/${id}` : `movie/${id}`
  const title = result.media_type === "tv" ? result.name !== undefined ? result.name : "unknown" : result.title !== undefined ? result.title : "unknown"
  const description = result.overview !== undefined ? result.overview : ""
  const maxTitleCharacters = 25

  return(
    <Image src={`https://image.tmdb.org/t/p/w342/${result.backdrop_path}`} alt={result.name || "show backdrop"} className="relative">
      <div ref={hoverRef} className={'w-full h-full'}>
        <div onClick={()=>signIn()}>
              <p>Sign in to Add</p>
            </div>
        <Link href={linkAddress}><h2>{title.length > maxTitleCharacters ? title.substring(0, maxTitleCharacters) + "..." : title}</h2></Link>
        <p>{description.substring(0, 70) + "..."}</p>
      </div>
    </Image>
  )
}

const Result = ({result, listItem, user, addListItem, removeListItem}: ResultProps) =>{
  const [hoverRef, isHovered] = useHover()
  const id = result.id
  const title = result.media_type === "tv" ? result.name !== undefined ? result.name : "unknown" : result.title !== undefined ? result.title : "unknown"
  const description = result.overview !== undefined ? result.overview : ""
  const type = result.media_type !== undefined ? result.media_type : ""
  const backdropPath = result.backdrop_path !== undefined ? `https://image.tmdb.org/t/p/w342/${result.backdrop_path}` : null
  const posterPath = result.poster_path!== undefined ? `https://image.tmdb.org/t/p/w342/${result.poster_path}` : null
  const linkAddress = result.media_type === "tv" ? `/series/${id}` : `movie/${id}`
  const maxTitleCharacters = 25
  
  const handleAdd = (itemToAdd:{media:Media, userID:string}) =>{
    addListItem(itemToAdd)
  }
  const handleRemove = (id:string) =>{
    removeListItem(id)
  }

  const newListItem: {media:Media, userID:string} = {
    media:{
        id,
        title,
        description,
        type,
        backdropPath,
        posterPath
    },
    userID: user.id
  }
  
  const btn = whichBtn()

  function whichBtn(){
  if(!listItem){
      return <FontAwesomeIcon onClick={()=> handleAdd(newListItem)} className='absolute top-3 right-3 cursor-pointer hover:scale-125 text-red-700 shadow-lg' icon={faHeart}/>
    }else{
      return <FontAwesomeIcon onClick={()=>{ handleRemove(listItem.id)}} className='absolute top-3 right-3 cursor-pointer hover:scale-125 text-red-700 shadow-lg' icon={faFilledHeart}/>
    }
  }
    return(
      <div ref={hoverRef} key={id} className={'flex justify-between items-center gap-2 p-6 text-white drop-shadow'}>
      <div className='flex flex-col items-center relative w-max'>
        <Image 
          className='w-full m-0 p-0'
          src={backdropPath || ""} 
          alt={title}
          width={300}
          height={163}/>
        <h2 className='text-md font-bold absolute bottom-2 left-2 text-white'>{title}</h2>
        {btn}
      </div>
    </div>
    )
  }