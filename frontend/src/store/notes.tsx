import { atom } from "recoil";
import { notestypo, searchnotestypo, tracknotetypo , alerttypo, sharemodalinfo } from "../typo/notestypo";

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

export const device = atom<null | string>({
    key :"check device",
    default:null
})

export const totalnotesnumber = atom<string>({
    key :'last note created time',
    default : '0'
})

export const alertstate = atom<alerttypo>({
    key:'alert state',
    default:{
        isalert:false,
        alertname:'none',
        alertcolor:'none'
    }
})

export const issharemodalopen = atom<sharemodalinfo>({
    key:"share modal state handle",
    default:{
        modalopen:false,
        sharenoteid:null,
        accesstype:null,
        share:null
    }
    
})