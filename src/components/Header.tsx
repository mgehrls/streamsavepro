import React, { useEffect, useState } from 'react'
import { faMagnifyingGlass, faList, faArrowRightFromBracket, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { HeaderPropType, ListItem, Media, ProfileSectionPropTypes, SearchbarPropType, SearchData, SearchResult } from '../types/interface'
import useDebounce from '../utils/useDebounce'
import { trpc } from '../utils/trpc'
import { signIn } from 'next-auth/react'

const Header = ({signIn, signOut, session, listItems}: HeaderPropType) => {
    const [show, setShow] = useState(false)
    
    function getUserImage(){
        if(session){
            if(session.user !== undefined){
                if(session.user.image!== null && session.user.image !== undefined){
                    return session.user.image
                }
            }
        }
        return ""
    }
    const userImage = getUserImage()

    const searchbarProps = {
        listItems: listItems ? listItems : undefined
    }
    
    const profileSectionProps = {
        session,
        signIn,
        signOut,
        imageProps:{
            src: userImage,
            height: 46,
            width:46,
        },
        show,
        setShow
    }

    return (
        <header className="flex justify-start items-center p-4 gap-4 bg-slate-600 fixed h-16 text-white top-0 z-50 w-screen">
            <Logo/>
            <SearchBar {...searchbarProps}/>
            <ProfileSection {...profileSectionProps} />
        </header>
 )}

 const Logo = () =>{
    return (
        <div className='hidden md:block'>
            <Link  
                href={"/"} >
                <h1>StreamSave</h1>
            </Link>
        </div>
    )
 }

 const SearchBar = ({listItems}: SearchbarPropType) =>{
    const [loading, setLoading] = useState<"success" | "loading" | "none">("none")
    const [searchResults, setSearchResults] = useState<SearchData | null>(null)
    const [search, setSearch] = useState<string | null>(null)
    const apiKey = "4cc551bdbec360295f6123a443e43bb9"
    const addListItemToDB = trpc.listItem.newListItem.useMutation()
    const removeListItemFromDB = trpc.listItem.removeListItem.useMutation()
    const router = useRouter()
    
    
    const addListItem = (newListItem:{media:Media, userID:string}) =>{
      addListItemToDB.mutate(newListItem, {onSuccess:async ()=>{ router.reload()}})
      return addListItemToDB.isLoading ? true : false
    }
    const removeListItem = (id:string) =>{
      removeListItemFromDB.mutate(id, {onSuccess:async ()=>{ router.reload()}})
      return removeListItemFromDB.isLoading ? true : false
    }

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

        if(listItems === undefined){
            return(
            <div className='border border-black flex justify-between items-center h-20 relative'>
                <Image height={100} width={50} src={`https://image.tmdb.org/t/p/w342/${result.poster_path}` || ""} alt={result.name || "poster"} />
                <h2>{result.name}</h2>
                <FontAwesomeIcon icon={faPlus} onClick={()=>signIn()}/>
            </div>
            )
        }else if(listItems[0]=== undefined){
            return(
                <div className='border border-black flex justify-between items-center h-20 relative'>
                    <Image height={100} width={50} src={`https://image.tmdb.org/t/p/w342/${result.poster_path}` || ""} alt={result.name || "poster"} />
                    <h2>{result.name}</h2>
                    <FontAwesomeIcon icon={faPlus} onClick={()=>signIn()}/>
                </div>
                )
        }else{
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
                  <div className='border border-black flex justify-between items-center h-20 relative'>
                      <Image height={100} width={50} src={`https://image.tmdb.org/t/p/w342/${result.poster_path}` || ""} alt={result.name || "poster"} />
                      <h2>{result.name}</h2>
                      <FontAwesomeIcon icon={faPlus} onClick={()=> handleAdd(newListItem)}/>
                  </div>
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
            <div className={loading === "none" ? "opacity-0" : 'bg-pink-500 absolute w-full min-h-min z-50 mt-12'}>
                {searchDisplay}
            </div>
        </div>
    )
 }

const ProfileSection = ({session, signIn, signOut, imageProps, show, setShow}: ProfileSectionPropTypes) =>{
    const profileClasses = show ? "absolute top-0 right-0 flex flex-col justify-between items-around self-start bg-black max-w-min w-2/12 h-screen text-white" : "block"
    const linkClasses = show ? "flex flex-col justify-center items-between" : "hidden"
    const btnClasses = show ? "w-6 cursor-pointer" : "hidden"
    const spacerClass = show? "w-12" : "hidden"
    const imageClasses = show ? 'rounded-full max-h-full max-w-none m-2' : 'rounded-full max-h-full max-w-none'

    if(session){
        return(
            <>
                <div className={spacerClass}>

                </div>
                <div className={profileClasses} onClick={()=> setShow(!show)}>
                    <Image className={imageClasses} onClick={()=> { setShow(!show) }} alt={"user profile from your email"} {...imageProps}/>
                    <Link href={"/#list"} className={linkClasses}>     
                        <FontAwesomeIcon className='w-6 cursor-pointer' icon={faList}/>
                    </Link>
                    <FontAwesomeIcon icon={faArrowRightFromBracket} className={btnClasses} onClick={()=>{signOut()}}/>
                </div>
            </>

        )
    }else{
        return(
            <>
                <button onClick={()=>signIn("google")}>Sign In w/ Google</button>
            </>
        )
    }
}

export default Header