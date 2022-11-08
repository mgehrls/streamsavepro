import React from 'react'
import { faList, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'
import type { HeaderPropType} from '../types/interface'
import SearchBar from './SearchBar'

const Header = ({signIn, signOut, session, listItems, show, setShow, addListItem, removeListItem}: HeaderPropType) => {

    const profileClasses = show ? "absolute top-0 right-0 flex flex-col justify-between items-around self-start bg-black max-w-min w-2/12 h-screen text-white" : "block"
    const linkClasses = show ? "flex flex-col justify-center items-between" : "hidden"
    const btnClasses = show ? "w-6 cursor-pointer" : "hidden"
    const spacerClass = show? "w-12" : "hidden"
    const imageClasses = show ? 'rounded-full max-h-full max-w-none m-2' : 'rounded-full max-h-full max-w-none'
        
    function getUserImageURL(){
        if(session){
            if(session.user !== undefined){
                if(session.user.image!== null && session.user.image !== undefined){
                    return session.user.image
                }
            }
        }
        return ""
    }
    const userImageURL = getUserImageURL()

    const searchbarProps = {
        listItems: listItems ? listItems : undefined,
        addListItem: addListItem,
        removeListItem: removeListItem,
        session: session
    }
    
    const imageProps = {
        src: userImageURL,
        height: 46,
        width:46,
    }

    return (
        <header className="flex justify-start items-center p-4 gap-4 bg-slate-600 fixed h-16 text-white top-0 z-50 w-screen" onClick={()=> show && setShow(false)}>
            <div className='hidden md:block'>
                <Link  
                    href={"/"} >
                    <h1>StreamSave</h1>
                </Link>
            </div>
            <SearchBar {...searchbarProps}/>
            {session ?
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
            :
                <button onClick={()=>signIn("google")}>Sign In w/ Google</button>

            }
        </header>
 )}

export default Header