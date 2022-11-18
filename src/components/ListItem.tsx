import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ListItem } from "@prisma/client";
import Image from "next/image"
import { useEffect, useState } from "react";
import type { Media } from "../types/interface"

interface ListItemPropTypes  {
    removeListItem:(data:{userID: string, mediaID:number}) => void;
    updateListItemDate:(listItemToUpdate: {
      userID: string;
      mediaID: number;
      lastSeen: string;
    }) => void;
    item: ListItem & {
        media: Media;
    }
    loading: "loading" | "success" | "none";
}

const Item = ({item, removeListItem, updateListItemDate, loading}: ListItemPropTypes) =>{
    const [interacted, setInteracted] = useState(false)
    const [hide, setHide] = useState(false)


    useEffect(()=>{
        if(loading === "success" || loading === "none"){
            setInteracted(false)
        }
    },[loading])

        if(item.media.posterPath !== undefined && item.media.posterPath !== null){
            return (
          <div className="p-2 flex relative w-full bg-slate-800 max-w-md">
              <Image
                  src={item.media.posterPath}
                  alt="poster"
                  width={100}
                  height={150}/>

              {
              interacted 
              ?
              <div className="w-full grid place-content-center text-white">
                <FontAwesomeIcon icon={faSpinner} spin />
              </div>
                :
                <div className="flex flex-col justify-center gap-4 p-3 w-full">
                    <h3 className='text-white font-bold'>{item.media.title}</h3>
                    <div className="relative">
                     {
                     item.lastSeen !== undefined && item.lastSeen !== null 
                     ? 
                     <input 
                       onChange={(e) => {
                           setInteracted(true)
                           updateListItemDate({userID: item.userID, mediaID:item.mediaID, lastSeen: e.target.value })
                       }}
                       className="absolute text-white bg-transparent outline-none border-none opacity-50 hover:opacity-full" 
                       value={item.lastSeen} 
                       type={"date"}/>
                    :
                    !hide ?
                       <p className="text-white italic opacity-50 hover:opacity-100 cursor-pointer" onClick={()=> setHide(true)}>last watched?</p>
                       :
                     <input 
                       autoFocus
                       onChange={(e) => {
                           setInteracted(true)
                           updateListItemDate({userID: item.userID, mediaID:item.mediaID, lastSeen: e.target.value })
                       }}
                       className="absolute text-white bg-transparent outline-none border-none opacity-50 hover:opacity-full"  
                       type={"date"}/>
                     }
                 </div>
                 <p className="cursor-pointer text-red-700 absolute bottom-2 right-2 opacity-60 hover:opacity-100" onClick={()=> {
                   setInteracted(true)
                   removeListItem({userID: item.userID, mediaID: item.mediaID})
                   }}>X</p>
             </div>}
         </div>

              )} else{
                  return(
                    <div style={{backgroundColor: "pink" }}>
                        <h3>{item.media.posterPath}</h3>
                    </div>
                  )
              }
          }
    


export default Item