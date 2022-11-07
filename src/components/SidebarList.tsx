import React from 'react'
import SmallMediaDisplay from './SmallMediaDisplay'
import {trpc} from '../utils/trpc'
import { useSession } from 'next-auth/react';
import { ListItem, Media } from '../types/interface';

const SidebarList = () => {
  const session = useSession()
  const userShows = trpc.user.getUserShows.useQuery()

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
        }
        return <SmallMediaDisplay key={item.id} {...smallMediaDisplayProps} />
      })
    }
  }
  if(!userShows.data) return <div>Loading...</div>

  const tvDisplay = convertToJSXFromListItemArray(userShows.data)

  if(!tvDisplay) return <></>

  return (
  <aside id='list' className='hidden md:flex flex-col justify-start items-center mt-16 text-black bg-slate-400'>
    <h3>Your List</h3>
      {tvDisplay}
  </aside>
  )
}

export default SidebarList