import styles from './Home.module.css'
import Image from "next/image"
import React, { useState } from 'react';
import {trpc} from "../utils/trpc"
import { useRouter } from 'next/router';
import { SmallDisplayProps } from '../types/interface';

const SmallMediaDisplay = ({title, posterPath, lastSeen, listID}: SmallDisplayProps)=>{
    const [hide, setHide] = useState(true)
    const router = useRouter()
    const updateListItem = trpc.listItem.updateListItem.useMutation({onSuccess(){router.reload()}})
    const removeListItem = trpc.listItem.removeListItem.useMutation({onSuccess(){router.reload()}})
    let dateDisplay

    if(lastSeen !== undefined && lastSeen !== null){
        dateDisplay = <input onChange={(e) => updateListItem.mutate({id: listID, data:{ lastSeen: e.target.value} })} className={styles.listItemLastSeen} value={lastSeen} type={"date"}/>
    }else if(hide){
        dateDisplay = <p className={styles.listItemLastSeenFacade} onClick={() => setHide(!hide)}>last watched?</p>
    }else{
        dateDisplay = <input onChange={(e) => updateListItem.mutate({id: listID, data:{ lastSeen: e.target.value} })} autoFocus className={styles.listItemLastSeen} type={"date"}/>
    }

    if(posterPath !== undefined){
        return (
            <div className={styles.listItemContainer}>
                <Image
                    className={styles.listItemPoster}
                    src={posterPath}
                    alt="poster"
                    width={100}
                    height={150}/>
                <div className={styles.listItemDetails}>
                    <h3 className={styles.listItemTitle}>{title}</h3>
                    <div className={styles.listItemLastSeenContainer}>
                        {dateDisplay}
                    </div>
                    <p className={styles.listItemRemove} onClick={()=> removeListItem.mutate(listID)}>remove</p>
                </div>
            </div>
    )}else{
        return(
            <div style={{backgroundColor: "pink" }} className={styles.listItem}>
            <h3 className={styles.listItemTitle}>{posterPath}</h3>
        </div>
        )
    }
}
    

export default SmallMediaDisplay