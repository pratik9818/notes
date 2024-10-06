export interface notestypo{
    noteid :string
    notename :string
    notedescription?:string
    created_at?:string
    isshare:boolean
    access_type:string
}
export interface searchnotestypo{
    noteid :string
    notename :string
    notedescription?:string
    isshare:boolean
    access_type:string
}
// export interface tracknotetypo{
//     noteid:string
// }
export type tracknotetypo = string | null
export interface alerttypo{
    isalert:boolean
    alertname:string
    alertcolor:string
}

export interface sharemodalinfo{
    modalopen : boolean
    sharenoteid:string | null
    accesstype:string | null
    share:boolean | null
}