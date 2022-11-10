import React from 'react'
import SmallMediaDisplay from './SmallMediaDisplay'
import { useSession } from 'next-auth/react';
import type { ListItem, Media, SideBarPropTypes } from '../types/interface';

const SidebarList = ({listItems, removeListItem}: SideBarPropTypes) => {
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
          id: item.media.id,
          listID: item.id,
          lastSeen: item.lastSeen ? item.lastSeen : null,
          removeListItem: removeListItem
        }
        return <SmallMediaDisplay key={item.id} {...smallMediaDisplayProps} />
      })
    }
  }
  if(!listItems) return <div>Loading...</div>

  const tvDisplay = convertToJSXFromListItemArray(listItems)

  if(!tvDisplay) return <></>

  return (
  <aside id='list' style={{maxHeight:"calc(100vh - 4rem)"}} className='hidden md:flex flex-col overflow-x-hidden overflow-y-auto justify-start items-center text-black bg-slate-400'>
    <h3>Your List</h3>
      {tvDisplay}
  </aside>
  )
}

export default SidebarList