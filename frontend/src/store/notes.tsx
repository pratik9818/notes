import { atom } from "recoil";
import { notestypo } from "../typo/notestypo";
export const notes = atom<notestypo[]>({
    key:'notes name and its noted id',
    default : []
})