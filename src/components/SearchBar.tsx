import { faPlus, faMagnifyingGlass, faMinus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Media } from "@prisma/client"
import { signIn } from "next-auth/react"
import { useState, useEffect } from "react"
import { SearchbarPropType, SearchData } from "../types/interface"
import useDebounce from "../utils/useDebounce"
import Image from "next/image"

const SearchBar = ({listItems, addListItem, removeListItem, session}: SearchbarPropType) =>{
    const [loading, setLoading] = useState<"success" | "loading" | "none">("none")
    const [searchResults, setSearchResults] = useState<SearchData | null>(null)
    const [search, setSearch] = useState<string | null>(null)
    const apiKey = "4cc551bdbec360295f6123a443e43bb9"

    const debouncedSearch: string = useDebounce(search, 500)

    useEffect(()=>{
        setLoading("loading")
        setSearchResults(null)
        async function fetchData(){
            const searchItem = encodeURI(debouncedSearch)
            const searchData = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&language=en-US&query=${searchItem}&page=1&include_adult=false`).then((res) => res.json()).catch((e)=> console.log(e))
            setSearchResults(searchData)
            setLoading("success")
        }

        if(debouncedSearch) fetchData()
        setLoading("none")
    }, [debouncedSearch])

    const searchDisplay = searchResults?.results.map((result)=>{
        const id = result.id
        const title = result.name ? result.name : ""
        const description = result.overview !== undefined ? result.overview : ""
        const type = result.media_type !== undefined ? result.media_type : ""
        const backdropPath = result.backdrop_path !== undefined ? `https://image.tmdb.org/t/p/w342/${result.backdrop_path}` : null
        const posterPath = result.poster_path!== undefined ? `https://image.tmdb.org/t/p/w342/${result.poster_path}` : null
        //const linkAddress = result.media_type === "tv" ? `/series/${id}` : `movie/${id}`
        //const maxTitleCharacters = 25

        if(!session){
            return(
            <div key={result.id} className='border border-black flex justify-between items-center h-20 relative'>
                <Image height={100} width={50} src={`https://image.tmdb.org/t/p/w342/${result.poster_path}` || ""} alt={result.name || "poster"} />
                <h2>{result.name}</h2>
                <FontAwesomeIcon icon={faPlus} onClick={()=>signIn()}/>
            </div>
            )
        }else if(listItems !== undefined && listItems[0] === undefined && session.user){
            const newListItem: {media:Media, userID:string} = {
                media:{
                    id,
                    title,
                    description,
                    type,
                    backdropPath,
                    posterPath
                },
                userID: session.user.id
              }
            return(
                <div key={result.id} className='border border-black flex justify-between items-center h-20 relative'>
                    <Image height={100} width={50} src={`https://image.tmdb.org/t/p/w342/${result.poster_path}` || ""} alt={result.name || "poster"} />
                    <h2>{result.name}</h2>
                    <FontAwesomeIcon icon={faPlus} onClick={()=>addListItem(newListItem)}/>
                </div>
                )
        }else if(listItems !== undefined && listItems[0] !== undefined){
            const listItem = listItems[listItems.findIndex(item => item.mediaID === result.id)]
            const newListItem: {media:Media, userID:string} = {
                media:{
                    id,
                    title,
                    description,
                    type,
                    backdropPath,
                    posterPath
                },
                userID: listItems[0].userID
              }
                return (
                    <div key={result.id} className='border border-black flex justify-start gap-8 items-center h-30 relative'>
                          <Image className='overflow-hidden' height={100} width={213} src={`https://image.tmdb.org/t/p/w342/${result.backdrop_path}` || ""} alt={result.name || "poster"} />
                          <h2 className="font-bold w-30">{result.name}</h2>
                          {listItem ? <FontAwesomeIcon icon={faMinus} onClick={()=> removeListItem(listItem.id)}/> : <FontAwesomeIcon icon={faPlus} onClick={()=> addListItem(newListItem)}/>}
                    </div>
                )
          }else{
            return(
                <div>Error</div>
            )
          }})

      


    return(
        <div className='flex flex-col relative w-full'>
            <div className="relative h-12 flex justify-start items-center text-md text-white w-full">
                <FontAwesomeIcon className="h-6 m-2 absolute" icon={faMagnifyingGlass}/>
                <input 
                    className="w-full h-full pl-10 bg-zinc-900 text-white"
                    onChange={(e)=> setSearch(e.target.value)}
                    type="search" 
                    placeholder="Search StreamSave..."/>
            </div>
            <div className={loading === "none" ? "opacity-0" : 'bg-slate-900 absolute min-w-min w-1/2 min-h-min z-50 mt-12'}>
                {searchDisplay}
            </div>
        </div>
    )
 }

export default SearchBar