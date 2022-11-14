import { faPlus, faMagnifyingGlass, faMinus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { signIn } from "next-auth/react"
import { useState, useEffect } from "react"
import type { SearchbarPropType, SearchData, Media } from "../types/interface"
import useDebounce from "../utils/useDebounce"
import Image from "next/image"

