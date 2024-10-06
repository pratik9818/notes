import { atom } from "recoil";
const sidebardisplayStateType : string = 'block'
export const sidebardisplayState = atom({
    key:'sidebardispay',
    default:sidebardisplayStateType
})
