import { useEffect } from 'react'
import { notes } from '../../store/notes'
import { useRecoilState } from 'recoil'

import NotesfilesName from './NotesfilesName'
export default function NotesSection() {
    const [allnotes, setNotes] = useRecoilState(notes)
    
    useEffect(()=>{
        async function getallnotename() {
            const result = await fetch('http://localhost:3001/api/getnote/allnotenames',{
            headers:{
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwcmF0aWtzaW5naDIxMjAwMEBnbWFpbC5jb20iLCJpYXQiOjE3MTgyMTE2NTcsImV4cCI6MTcxODU3MTY1N30.8BEBSU1MmqTFERMnvK_KJ7PdE5uYY53Ol3NWwHAU9_s'
            }
        })
        const res = await result.json()
        // console.log(res.data);
            setNotes(res.data)
        }
        getallnotename()
    },[])
  return (
    <div className='my-8 border-2'>
        {
            allnotes.length ?allnotes?.map((element) =>{
                if(!element) return
                return <NotesfilesName key={element.noteid} notename={element.notename} noteid={element.noteid}/>
            }) :'loading'
        }
    </div>
  )
}

// async function sendreq(){
//     const result = await fetch('http://localhost:3001/api/getnote/allnotenames',{
//         headers:{
//             Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwcmF0aWtzaW5naDIxMjAwMEBnbWFpbC5jb20iLCJpYXQiOjE3MTY2OTY5NDcsImV4cCI6MTcxNjcwNDE0N30.5YFEJfC2PvwSpI4wJSGvIqGagDkSWUfX5zLodwLOjSo'
//         }
//     })
//     const f = await result.json()
//     console.log(f);
// }