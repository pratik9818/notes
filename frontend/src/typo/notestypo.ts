export interface notestypo{
    noteid :string
    notename :string
    notedescription?:string
}
export interface searchnotestypo{
    noteid :string
    notename :string
    notedescription?:string
}
// export interface tracknotetypo{
//     noteid:string
// }
export type tracknotetypo = string | null