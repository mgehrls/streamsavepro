import { ListItem, User } from "@prisma/client";
import { Session } from "next-auth/core/types";
import { RedirectableProviderType, BuiltInProviderType } from "next-auth/providers";
import { LiteralUnion, SignInOptions, SignInAuthorizationParams, SignInResponse, SignOutParams, SignOutResponse } from "next-auth/react";
import { Dispatch, SetStateAction } from "react";

export interface Media {
    id: number;
    title: string;
    description: string | null;
    type: string;
    backdropPath: string | null;
    posterPath: string | null;
}

export interface SearchResult{
    adult?: boolean;
    poster_path?: string;
    genre_ids?:number[];
    id: number;
    media_type?: string;
    name?:string;
    original_language?:string;
    original_title?:string;
    overview?: string;
    popularity?: number;
    backdrop_path?:string;
    profile_path?:string;
    realease_date?:string;
    title?:string;
    video?:boolean;
    vote_average?:number;
    vote_count?:number;
  }
export interface SearchData{
      page: number;
      results: SearchResult[];
      total_pages: number;
      total_results: number;
  }
export interface MovieData{
  id:number;
  title?: string;
  description?:string;
  backdropPath?:string;
  posterPath?:string;
  lastSeen?:string;
  tier?:"s" | "a" | "b" | "c" | "g";
}
export interface ShowData{
  id:number;
  title?: string;
  description?:string;
  backdropPath?:string;
  posterPath?:string;
  lastSeen?:string;
  tier?:"s" | "a" | "b" | "c" | "g";
}
export interface ResultProps{
  result: SearchResult;
  listItem?: (ListItem & {
    media: Media;
}) | undefined;
  user:User;
  addListItem: (newListItem: {
    media: Media;
    userID: string;
  }) => void;
  removeListItem:(data:{userID: string, mediaID:number}) => void;
}
export interface SearchProps{
  searchData: SearchData;
  listItems: (ListItem & {media: Media;})[] | undefined;
  user: User | null;
  addListItem: (newListItem: {
    media: Media;
    userID: string;
  }) => void;
  removeListItem:(data:{userID: string, mediaID:number}) => void;
}
export interface SearchResultProps {
  result: SearchResult;
  listItems: (ListItem & {media: Media})[];
  addListItem: (newListItem: {
    media: Media;
    userID: string;
  }) => void;
  removeListItem:(data:{userID: string, mediaID:number}) => void;
  setSearch: Dispatch<SetStateAction<string | null>>;
  loading: "success" | "loading" | "none";
}

export interface SmallDisplayProps{
  item: ListItem & {media: Media;}
  removeListItem:(data:{userID: string, mediaID:number}) => void;
  updateListItemDate:(listItemToUpdate: {
    userID: string;
    mediaID: number;
    lastSeen: string;
  }) => void;
}
export interface HeaderPropType {
  signIn:<P extends RedirectableProviderType | undefined = undefined>(provider?: LiteralUnion<P extends RedirectableProviderType ? P | BuiltInProviderType : BuiltInProviderType>, options?: SignInOptions, authorizationParams?: SignInAuthorizationParams)=> Promise<P extends RedirectableProviderType ? SignInResponse | undefined : undefined>,
  signOut:<R extends boolean = true>(options?: SignOutParams<R>)=> Promise<R extends true ? undefined : SignOutResponse>,
  session: Session | null,
  listItems: (ListItem & {
    media: Media;
})[] | undefined;
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  addListItem: (newListItem: {
    media: Media;
    userID: string;
}) => void;
removeListItem:(data:{userID: string, mediaID:number}) => void;
}

export interface ProfileSectionPropTypes {
  signIn:<P extends RedirectableProviderType | undefined = undefined>(provider?: LiteralUnion<P extends RedirectableProviderType ? P | BuiltInProviderType : BuiltInProviderType>, options?: SignInOptions, authorizationParams?: SignInAuthorizationParams)=> Promise<P extends RedirectableProviderType ? SignInResponse | undefined : undefined>,
  signOut:<R extends boolean = true>(options?: SignOutParams<R>)=> Promise<R extends true ? undefined : SignOutResponse>,
  session: Session | null
  imageProps:{
      src: string,
      height:number,
      width:number,
  },
  show: boolean,
  setShow: React.Dispatch<React.SetStateAction<boolean>>
}
export interface TrendingPropTypes{
  trending: {
      series: SearchResult[];
      movies: SearchResult[];
  };
  listItems: (ListItem & {
      media: Media;
  })[] | undefined;
  addListItem: (newListItem: {
    media: Media;
    userID: string;
}) => void;
removeListItem:(data:{userID: string, mediaID:number}) => void;
  session: Session | null;
  user: User | null;
}
export interface SearchbarPropType{
  listItems: (ListItem & {
    media: Media;
})[] | undefined;
addListItem: (newListItem: {
  media: Media;
  userID: string;
}) => void;
removeListItem:(data:{userID: string, mediaID:number}) => void;
session: Session | null;
isLoading:boolean;
}
export interface ListPropTypes {
  listItems:(ListItem & {
    media: Media;
})[] | undefined;
removeListItem:(data:{userID: string, mediaID:number}) => void;
updateListItemDate:(listItemToUpdate: {
  userID: string;
  mediaID: number;
  lastSeen: string;
}) => void;
}