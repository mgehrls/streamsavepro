import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faChartLine, faList, faSearch, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import Trending from "../components/Trending";

import { type NextPage } from "next";
import {  useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

import type { Media } from "../types/interface";
import Item from "../components/ListItem";
import Searchbar from "../components/Searchbar";

const Home: NextPage = () => {
  const session = useSession()
  const utils = trpc.useContext()
  const user = trpc.user.getUser.useQuery()
  const listItems = trpc.listItem.getUserListItems.useQuery()
  const { data: trending } = trpc.media.getTrendingData.useQuery()
  
  const [showMenu, setShowMenu] = useState(false)
  const [showTrending, setShowTrending] = useState(false)
  
  const addListItemToDB = trpc.listItem.newListItem.useMutation()
  const removeListItemFromDB = trpc.listItem.removeListItem.useMutation()
  const updateListItem = trpc.listItem.updateListItem.useMutation()
  const [loading, setLoading] = useState<"success" | "loading" | "none">("none")

  
  if(!trending || session.status === "loading"){
    
    return (
      <div className="w-screen h-screen bg-slate-600 flex flex-col gap-8 justify-center items-center">
        <FontAwesomeIcon spin icon={faSpinner} size={"10x"}/>
        <div className="text-white font-bold cursor-pointer p-6 bg-black">Loading...</div>
      </div>
      )

  }else {

    const addListItem = (newListItem:{media:Media, userID:string}) =>{
      setLoading("loading")
      addListItemToDB.mutate(newListItem, {
        onSuccess:async ()=>{ 
          utils.listItem.getUserListItems.invalidate() 
          setLoading("success")}, 
        onError: async (err)=>{
          console.log(err)
          setLoading("none")
        }})
    }
    const removeListItem = (itemToRemove:{userID: string, mediaID: number} ) =>{
      setLoading("loading")
      removeListItemFromDB.mutate(itemToRemove, {
        onSuccess:async ()=>{ 
          utils.listItem.getUserListItems.invalidate() 
          setLoading("success")}, 
        onError: async (err)=>{
          console.log(err)
          setLoading("none")
        }})
    }
    const updateListItemDate = (listItemToUpdate:{userID: string, mediaID: number, lastSeen:string}) => {
      setLoading("loading")
      updateListItem.mutate(listItemToUpdate, {
        onSuccess:async ()=>{ 
          utils.listItem.getUserListItems.invalidate() 
          setLoading("success")}, 
        onError: async (err)=>{
          console.log(err)
          setLoading("none")
        }})
    }
    function getUserImageURL(){
        if(session){
            if(session.data?.user !== undefined){
                if(session.data.user.image!== null && session.data.user.image !== undefined){
                    return session.data.user.image
                }
            }
        }
        return ""
    }
    const userImageURL = getUserImageURL()

    return (
      <>
        <Head>
          <title>StreamSave</title>
          <meta name="description" content="Generated by create-t3-app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <header className="flex justify-start items-center p-4 gap-4 bg-slate-600 fixed h-16 text-white top-0 z-50 w-screen" onClick={()=> showMenu && setShowMenu(false)}>
          <div className='hidden md:block'>
            <Link  
              href={"/"} >
            <h1>StreamSave</h1>
            </Link>
          </div>

          <Searchbar/>

              {/* dropdown menu */
              session.status === "authenticated" ?
              <>
                  <div className={showMenu? "w-12" : "hidden"}>

                  </div>
                  <div className={showMenu ? "absolute z-50 top-0 right-0 flex flex-col justify-start gap-6 items-center self-start bg-black max-w-min w-2/12 h-screen text-white" : "block"} onClick={()=> setShowMenu(!showMenu)}>
                      <Image className={showMenu ? 'rounded-full max-h-full max-w-none m-2' : 'rounded-full max-h-full max-w-none'} onClick={()=> { setShowMenu(!showMenu) }} alt={"user profile from your email"} src={userImageURL} height={46} width={46} />
                      <Link href={"/"} className={showMenu ? "flex flex-col justify-center items-between" : "hidden"}>     
                          <FontAwesomeIcon className='w-6 cursor-pointer' icon={faList}/>
                      </Link>
                      <FontAwesomeIcon icon={faArrowRightFromBracket} className={showMenu ? "w-6 cursor-pointer justify-self-end" : "hidden"} onClick={()=>{signOut()}}/>
                  </div>
              </>
              :
                  <button onClick={()=>signIn("google")}>Sign In w/ Google</button>

              }
        </header>
        <body className="bg-slate-300 mt-16 z-0">
          <div className="flex flex-col md:flex-row justify-center max-w-8xl">
            
          {listItems.data 
            && 
            <div id='list' className='flex flex-wrap gap-1 justify-center items-center text-black bg-slate-400'>
              <div className="flex items-center justify-between w-full p-4">
                <h3 className="font-bold text-white">Your List</h3>
                <div className="flex flex-col justify-center items-center">
                  <p>sort by</p>
                  <div className="flex gap-4">
                    <p>last seen</p>
                    <p>A,B,C...</p>
                  </div>
                </div>
              </div>
                <div className='flex flex-wrap gap-1'>
                  {listItems.data 
                    && 
                    listItems.data.map((item)=>{
                      return(
                        <Item key={item.mediaID} item={item} removeListItem={removeListItem} updateListItemDate={updateListItemDate} loading={loading} />
                      )})
                  } 
                </div>
            </div>/* end of your list if it's there. */
            }



            {
              !showTrending
              ?
              <div style={{height:"calc(100vh - 4rem)"}} className="md:flex max-w-10x w-full flex-col justify-center items-center p-10">
              <h1 style={{textShadow:"2px 2px 2px rgba(0,0,0,.5), 4px 4px 4px rgba(0,0,0,.3)"}} className="font-bold text-5xl max-w-3xl text-orange-600 tracking-tight text-start py-8">Welcome to <span>Streamsave!</span></h1>
              <div className="grid sm:grid-cols-3 gap-4">
                <div onClick={()=> document.getElementById("searchBar")?.focus()} className="w-24 h-28 grid place-content-center bg-pink-700 hover:scale-125 transition-all p-2 cursor-pointer">
                  <FontAwesomeIcon icon={faSearch} />
                </div>
                <div onClick={()=> setShowTrending(true)} className="w-24 h-28 grid place-content-center bg-pink-700 hover:scale-125 transition-all p-2 cursor-pointer">
                  <FontAwesomeIcon icon={faChartLine} />
                </div>
                <div className="w-24 h-28 grid place-content-center bg-pink-700 hover:scale-125 transition-all p-2 cursor-pointer" onClick={()=> signIn()}>
                  <FontAwesomeIcon icon={faGoogle}  />Sign In</div>
                </div>
              </div>
              
              :

              <Trending trending={trending} listItems={listItems.data ? listItems.data : undefined} addListItem={addListItem} removeListItem={removeListItem} session={session.data} user={user.data ? user.data : null} />
            }
           
           
          </div>
        </body>
        <footer className="w-full h-16 bg-slate-600 flex justify-center items-center">
        <Link className="text-white" href='https://www.themoviedb.org/'>
            Images and data curtosy of themoviedb.org
        </Link>
        </footer>
      </>
    );
  }};

export default Home;