import { atom } from "recoil";
import { notestypo, searchnotestypo, tracknotetypo } from "../typo/notestypo";

export const notes = atom<notestypo[]>({
    key:'notes name and its noted id',
    default : []
})

export const deletenote = atom<string|null>({
    key:'delete note',
    default : null
})

export const trackactivenote = atom<tracknotetypo>({
    key:'track active note',
    default : null
})

export const trackactivenotecolor = atom<HTMLDivElement | HTMLElement | null>({
    key:"track border color",
    default : null
})

export const issearch = atom({
    key:'search state',
    default:false
})

export const searchresultstate = atom<searchnotestypo[]>({
    key:'search result',
    default:[]
})
export const islogin = atom({
    key:'check login ',
    default:{
        islogin:true,
        reason:'',
        message:''
    }
})
export const tokenmodalstate = atom({
    key:'token expiry ',
    default:false
})
