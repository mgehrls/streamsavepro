import { faSpinner, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import type { Media, SearchResultProps } from "../types/interface"
import Image from "next/image"
import { useEffect, useState } from "react"



const SearchResult = ({listItems, result, addListItem, removeListItem, setSearch, loading}: SearchResultProps) =>{
    const [interacted, setInteracted] = useState(false)
    const listItem = listItems[listItems.findIndex(item => item.mediaID === result.id)]
    const status = listItem ? true : false
    const id = result.id
    const title = result.name ? result.name : ""
    const description = result.overview !== undefined ? result.overview : ""
    const type = result.media_type !== undefined ? result.media_type : ""
    const backdropPath = result.backdrop_path !== undefined ? `https://image.tmdb.org/t/p/w342/${result.backdrop_path}` : null
    const posterPath = result.poster_path!== undefined ? `https://image.tmdb.org/t/p/w342/${result.poster_path}` : null

    useEffect(()=>{
        if(loading === "success" || loading === "none"){
            setInteracted(false)
        }
    }, [loading])
    useEffect(()=>{
        if(status && listItem || !status && !listItem){
          setInteracted(false)
        }
    }, [status])
    
      const handleAdd = () =>{
        setInteracted(true)
        if(listItems[0]){
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
              addListItem(newListItem)
        }

      }
      const handleRemove = () =>{
        setInteracted(true)
        if(listItem)
        removeListItem({userID:listItem.userID, mediaID: listItem.mediaID })
      }
        return (
            <div key={result.id} className='m-1 gap-1 flex justify-between items-center relative w-full'>
                {interacted
                  ?
                  <div className="w-full h-12 grid place-content-center">
                  <FontAwesomeIcon icon={faSpinner} spin />
                  </div>
                  :
                  <>
                  <div style={{aspectRatio:"16:9",minWidth:"120px", width:"120px", maxWidth:"120px", height:"100%"}} className="flex justify-center items-center">
                    <Image objectFit="true" className='overflow-hidden' height={100} width={213} src={`https://image.tmdb.org/t/p/w342/${result.backdrop_path}` || ""} alt={result.name || "poster"} />
                  </div>
                  <div>
                    <h2 className="font-bold">{result.name}</h2>
                  </div>
                  {
                  listItem 
                  ? 
                  <div>
                    <div id="removeBtn" className="cursor-pointer p-4 active:scale-75" onClick={()=> handleRemove()}>
                      <FontAwesomeIcon icon={faMinus} />
                    </div> 
                  </div>
                  : 
                  <div>
                    <div className="cursor-pointer p-4" onClick={()=> handleAdd()}>
                      <FontAwesomeIcon icon={faPlus} />
                    </div>
                  </div>
                  }
                </>
                }
            </div>
        )
                  
}
export default SearchResult