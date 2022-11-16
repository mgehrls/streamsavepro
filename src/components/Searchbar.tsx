import { faMagnifyingGlass, faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import type { Media } from "@prisma/client"
import { signIn, useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import type { SearchData } from "../types/interface"
import useDebounce from "../utils/useDebounce"
import Image from "next/image"
import { trpc } from "../utils/trpc"
import SearchResult from "./SearchResult"

const Searchbar = () =>{
    const session = useSession()
    const listItems = trpc.listItem.getUserListItems.useQuery()
    const utils = trpc.useContext()
    const [loading, setLoading] = useState<"success" | "loading" | "none">("none")
    const [searchResults, setSearchResults] = useState<SearchData | null>(null)
    const [search, setSearch] = useState<string | null>(null)
    const apiKey = "4cc551bdbec360295f6123a443e43bb9"
    const debouncedSearch: string = useDebounce(search, 500)
    const addListItemToDB = trpc.listItem.newListItem.useMutation()
    const removeListItemFromDB = trpc.listItem.removeListItem.useMutation()

    const addListItem = (newListItem:{media:Media, userID:string}) =>{
        addListItemToDB.mutate(newListItem, {onSuccess:async ()=>{ utils.listItem.getUserListItems.invalidate()}})
        return addListItemToDB.isLoading ? true : false
      }
      const removeListItem = (itemToRemove:{userID: string, mediaID: number} ) =>{
        removeListItemFromDB.mutate(itemToRemove, {onSuccess:async ()=>{ utils.listItem.getUserListItems.invalidate()}})
        return removeListItemFromDB.isLoading ? true : false
      }
    
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
    
    return(
    <div className='flex flex-col relative w-full'>
    <div className="relative h-12 flex justify-start items-center text-md text-white w-full">
        <FontAwesomeIcon className="h-6 m-2 absolute" icon={faMagnifyingGlass}/>
        <input
            id="searchBar" 
            className="w-full h-full pl-10 bg-zinc-900 text-white"
            onChange={(e)=> setSearch(e.target.value)}
            value={search || ""}
            type="search" 
            placeholder="Search StreamSave..."/>
    </div>
    <div className={loading === "none" ? "opacity-0" : 'w-10/12 bg-slate-900 absolute min-w-min md:w-1/2 z-50 mt-12'}>
            {
                loading === "loading" 
                ?
                <div className="grid place-content-center"><FontAwesomeIcon icon={faSpinner} spin /></div> 
                :
              searchResults?.results.slice(0,4).map((result)=>{
          
                if(!session.data){
                    return(
                    <div key={result.id} className='border border-black flex justify-between items-center h-20 relative'>
                        <Image height={100} width={50} src={`https://image.tmdb.org/t/p/w342/${result.poster_path}` || ""} alt={result.name || "poster"} />
                        <h2>{result.name}</h2>
                        <div className="p-4 cursor-pointer" onClick={()=>signIn()}>
                          <FontAwesomeIcon icon={faPlus} />
                        </div>
                    </div>
                    )
                }else if(listItems.data !== undefined && listItems.data[0] !== undefined){
                    return (
                      <SearchResult key={result.id} listItems={listItems.data} result={result} addListItem={addListItem} removeListItem={removeListItem} setSearch={setSearch} loading={loading} />
                    )
                  }})/* End of Searchbar */
            }
        </div>
        </div>
        )
}

export default Searchbar