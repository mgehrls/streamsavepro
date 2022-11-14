import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image"
import { useState } from "react";
import type { ListItem, Media } from "../types/interface"

interface ListItemPropTypes  {
    removeListItem:(data:{userID: string, mediaID:number}) => boolean;
    updateListItemDate:(listItemToUpdate: {
      userID: string;
      mediaID: number;
      lastSeen: string;
    }) => void;
    item: ListItem & {
        media: Media;
}}

const Item = ({item, removeListItem, updateListItemDate}: ListItemPropTypes) =>{
    const [isLoading, setIsLoading] = useState(false)
    const [hide, setHide] = useState(false)

        if(item.media.posterPath !== undefined && item.media.posterPath !== null){
            return (
          <div className="p-2 flex relative w-full bg-slate-800 border-b-2 border-b-white max-w-md">
              <Image
                  src={item.media.posterPath}
                  alt="poster"
                  width={100}
                  height={150}/>
              <div className="flex flex-col justify-center gap-4 p-3 w-full">
                  <h3 className='text-white font-bold'>{item.media.title}</h3>
                  <div className="relative">
                      { isLoading ?
                      <FontAwesomeIcon icon={faSpinner} spin/>
                      :
                      item.lastSeen !== undefined && item.lastSeen !== null 
                      ? 
                      <input 
                        onChange={(e) => {updateListItemDate({userID: item.userID, mediaID:item.mediaID, lastSeen: e.target.value })}}
                        className="absolute text-white bg-transparent outline-none border-none opacity-50 hover:opacity-full" 
                        value={item.lastSeen} 
                        type={"date"}/>
                     :
                     !hide ?
                        <p className="text-white italic opacity-50 hover:opacity-100 cursor-pointer" onClick={()=> setHide(true)}>last watched?</p>
                        :
                      <input 
                        autoFocus
                        onChange={(e) => {updateListItemDate({userID: item.userID, mediaID:item.mediaID, lastSeen: e.target.value })}}
                        className="absolute text-white bg-transparent outline-none border-none opacity-50 hover:opacity-full"  
                        type={"date"}/>
                      }
                  </div>
                  <p className="cursor-pointer text-red-700 absolute bottom-2 right-2" onClick={()=> removeListItem({userID: item.userID, mediaID: item.mediaID})}>remove</p>
              </div>
          </div>
              )}else{
                  return(
          <div style={{backgroundColor: "pink" }}>
              <h3>{item.media.posterPath}</h3>
          </div>
                  )
              }
          }
    


export default Item