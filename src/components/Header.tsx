import React, { useState } from 'react'
import { faMagnifyingGlass, faList, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { HeaderPropType, ProfileSectionPropTypes } from '../types/interface'

const Header = ({signIn, signOut, session}: HeaderPropType) => {
    const [show, setShow] = useState(false)
    
    function getUserImage(){
        if(session){
            if(session.user !== undefined){
                if(session.user.image!== null && session.user.image !== undefined){
                    return session.user.image
                }
            }
        }
        return ""
    }
    const userImage = getUserImage()
    
    const profileSectionProps = {
        session,
        signIn,
        signOut,
        imageProps:{
            src: userImage,
            height: 46,
            width:46,
        },
        show,
        setShow
    }

    return (
        <header className="flex justify-start items-center p-4 gap-4 bg-slate-600 fixed h-16 text-white top-0 z-50 w-screen">
            <Logo/>
            <SearchBar/>
            <ProfileSection {...profileSectionProps} />
        </header>
 )}

 const Logo = () =>{
    return (
        <div className='hidden md:block'>
            <Link  
                href={"/"} >
                <h1>StreamSave</h1>
            </Link>
        </div>
    )
 }

 const SearchBar = () =>{

    const router = useRouter()

    function search(){
        const searchItem = encodeURI((document.getElementById("searchinput") as HTMLInputElement).value)
        if(searchItem){
            router.push({
                pathname:`/search/${searchItem}`
            })
        }
    }

    return(
        <form className="relative h-12 flex justify-start items-center text-md text-white w-full"
            onSubmit={(e)=>{
            e.preventDefault()
            search()}}>
            <FontAwesomeIcon className="h-6 m-2 cursor-pointer absolute"icon={faMagnifyingGlass} onClick={() => { search() }}/>
            <input 
                className="w-full h-full pl-10 bg-zinc-900 text-white"
                id="searchinput"
                type="text" 
                placeholder="Search StreamSave..."/>
            <button className="absolute right-0 p-4" 
                onClick={()=> search()}>
                    Search
            </button>
        </form>

    )
 }

const ProfileSection = ({session, signIn, signOut, imageProps, show, setShow}: ProfileSectionPropTypes) =>{
    const profileClasses = show ? "absolute top-0 right-0 flex flex-col justify-between items-around self-start bg-black max-w-min w-2/12 h-screen text-white" : "block"
    const linkClasses = show ? "flex flex-col justify-center items-between" : "hidden"
    const btnClasses = show ? "w-6 cursor-pointer" : "hidden"
    const spacerClass = show? "w-12" : "hidden"
    const imageClasses = show ? 'rounded-full max-h-full max-w-none m-2' : 'rounded-full max-h-full max-w-none'

    if(session){
        return(
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

        )
    }else{
        return(
            <>
                <button onClick={()=>signIn("google")}>Sign In w/ Google</button>
            </>
        )
    }
}

export default Header