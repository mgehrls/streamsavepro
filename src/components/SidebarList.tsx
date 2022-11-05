import React from 'react'
import SmallMediaDisplay from './SmallMediaDisplay'
import styles from './Home.module.css'
import {trpc} from '../utils/trpc'
import type { PrismaListItem } from '../types/interface';
import { signIn, useSession } from 'next-auth/react';

export default function SidebarList() {
  const userShows = trpc.user.getUserShows.useQuery()
  const userMovies = trpc.user.getUserMovies.useQuery()
  const session = useSession()

  const convertToJSXFromListItemArray = (listItemArray: PrismaListItem[] | undefined) => {
    if(!session){
      return(
        <div>
          <p>Please Log In</p>
          <button onClick={()=> signIn()}>Sign In</button>
        </div>
      )
    }
    if(!listItemArray){
      <div>Add Shows to your List to keep track of them here!</div>
    }else{
      return listItemArray.map((item: PrismaListItem)=>{
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
if(!userMovies.data || !userShows.data) return <div>Loading...</div>

  const movieDisplay = convertToJSXFromListItemArray(userMovies.data)
  const tvDisplay = convertToJSXFromListItemArray(userShows.data)

  return (
    <aside id='list' className={styles.sidebarContainer}>
    <h3>Your List</h3>
    <div className={styles.sidebarSeriesContainer}>
      {tvDisplay}
    </div>
    <div className={styles.sidebarSeriesContainer}>
      {movieDisplay}
    </div>
  </aside>
  )
}

