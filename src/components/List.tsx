import React, { useState } from 'react'
import { useSession } from 'next-auth/react';
import type { ListItem, Media, ListPropTypes, SmallDisplayProps } from '../types/interface';
import { useRouter } from 'next/router';
import { trpc } from '../utils/trpc';
import Image from 'next/image';

const List = ({listItems, removeListItem}: ListPropTypes) => {
  const session = useSession()

  function convertToJSXFromListItemArray(listItemArray: (ListItem & {media: Media;})[] | undefined){
    if(!session) return <></>
    if(!listItemArray){
      return <></>
    }else if(!listItemArray.length){
      <div className='text-white font-bold'>Add Shows to your List to keep track of them here!</div>
    }else{
      return listItemArray.map((item)=>{
        const smallMediaDisplayProps={
          title: item.media.title,
          backdropPath: item.media.backdropPath ? item.media.backdropPath: "",
          posterPath: item.media.posterPath ? item.media.posterPath : "",
          mediaID: item.mediaID,
          userID: item.userID,
          lastSeen: item.lastSeen ? item.lastSeen : null,
          removeListItem: removeListItem
        }
        return <SmallMediaDisplay key={item.mediaID} {...smallMediaDisplayProps} />
      })
    }
  }
  if(!listItems) return <div>Loading...</div>

  const tvDisplay = convertToJSXFromListItemArray(listItems)

  if(!tvDisplay) return <></>

  return (
  <div id='list' className='flex flex-wrap gap-1 justify-start items-center text-black bg-slate-400'>
    <h3>Your List</h3>
    <div className='flex flex-wrap gap-1'>
      {tvDisplay}
    </div>
  </div>
  )
}

export default List

const SmallMediaDisplay = ({title, posterPath, lastSeen, removeListItem, userID, mediaID }: SmallDisplayProps)=>{
  const [hide, setHide] = useState(true)
  const router = useRouter()
  const updateListItem = trpc.listItem.updateListItem.useMutation({onSuccess(){router.reload()}})
  let dateDisplay

  if(lastSeen !== undefined && lastSeen !== null){
      dateDisplay = <input onChange={(e) => updateListItem.mutate({userID: userID, mediaID:mediaID, lastSeen: e.target.value })} className="absolute text-white bg-transparent outline-none border-none" value={lastSeen} type={"date"}/>
  }else if(hide){
      dateDisplay = <p className="cursor-pointer p-0 m-0 text-gray-400 italic" onClick={() => setHide(!hide)}>last watched?</p>
  }else{
      dateDisplay = <input onChange={(e) => updateListItem.mutate({userID: userID, mediaID:mediaID, lastSeen: e.target.value })} autoFocus className="absolute text-white bg-transparent outline-none border-none" type={"date"}/>
  }

  if(posterPath !== undefined){
      return (
          <div className="p-2 flex relative w-full bg-slate-800 border-b-2 border-b-white max-w-md">
              <Image
                  src={posterPath}
                  alt="poster"
                  width={100}
                  height={150}/>
              <div className="flex flex-col justify-center gap-4 p-3 w-full">
                  <h3 className='text-white font-bold'>{title}</h3>
                  <div className="relative">
                      {dateDisplay}
                  </div>
                  <p className="cursor-pointer text-red-700 absolute bottom-2 right-2" onClick={()=> removeListItem({userID, mediaID})}>remove</p>
              </div>
          </div>
  )}else{
      return(
          <div style={{backgroundColor: "pink" }}>
          <h3>{posterPath}</h3>
      </div>
      )
  }
}