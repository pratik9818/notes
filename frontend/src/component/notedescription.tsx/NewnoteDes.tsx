// import React from 'react'
import {useState,useEffect, ChangeEvent}from 'react'
// import { useParams,useNavigate} from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { notes } from '../../store/notes'
// import { notestypo } from '../../typo/notestypo'

type descriptiontypo = string
// interface newnote {
//   noteid:string,
//   notename:string,
//   notedescription?:string
// }
export default function NewnoteDes() {
    const [allnotes,setNotes]= useRecoilState(notes)
   const [description, setDescription] = useState<descriptiontypo>('')
   const [wordscount , setWordscount] = useState<number>(0)
   const  maxchartoUpdate = 5
    const [idstate , setIdstate] = useState<string>('')
    const [isname , setIsname] = useState<boolean>(false)
  //   const [newnote , setNewnote] = useState<newnote>({
  //     noteid:'',
  // notename:'',
  //   })
  //  const index =  allnotes?.findIndex(element => element.noteid === idstate)

   useEffect(()=>{
    async function addnote() {
        const formData = new URLSearchParams();
    const createnotename = description.substring(0,15)
    
    formData.append('notename', createnotename);
    const result =  await fetch(`http://localhost:3001/api/addnote`,{
      method: 'POST',
      headers:{
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwcmF0aWtzaW5naDIxMjAwMEBnbWFpbC5jb20iLCJpYXQiOjE3MTgyMTE2NTcsImV4cCI6MTcxODU3MTY1N30.8BEBSU1MmqTFERMnvK_KJ7PdE5uYY53Ol3NWwHAU9_s`
      },
      body: formData.toString(),
    })
      const res = await result.json()
      const res_noteid = res.noteid
      console.log(res);
      const updatednotes = [...allnotes]
              updatednotes.unshift({ 
                noteid:res_noteid,
                notename:createnotename}
                )
              setIdstate(res_noteid)
              setNotes(updatednotes)
              // console.log(allnotes);
              setIsname(true)
      
    }
    if(!isname && wordscount > maxchartoUpdate){
      addnote()
    }
},[description])
   
useEffect(()=>{
  async function updatedescription(){ //the problem is here notedes do not get update if word is less then 5 like whywhy forexample , updatename get update but updatedescription() do no call --problem solved , just add new useeffect with des and isname dependency
    
    const formData = new URLSearchParams();
    formData.append('notedescription', description);
        const result =  await fetch(`http://localhost:3001/api/updatenote/notedescription/${idstate}`,{
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwcmF0aWtzaW5naDIxMjAwMEBnbWFpbC5jb20iLCJpYXQiOjE3MTgyMTE2NTcsImV4cCI6MTcxODU3MTY1N30.8BEBSU1MmqTFERMnvK_KJ7PdE5uYY53Ol3NWwHAU9_s`,
            },
            body: formData.toString(),
          })
          const res = await result.json()
          // console.log(res);
          if(res.status == 200){
            const updatednotes = [...allnotes]
            updatednotes[0] = {
                ...updatednotes[0] ,
                notedescription : description ? description : ' '
            }
            setNotes(updatednotes)
          }
  }
  
  if(wordscount > maxchartoUpdate && isname){
    updatedescription()
    setWordscount(0)
  }
},[description,isname])
    const textonchnage = (e:ChangeEvent<HTMLTextAreaElement>)=>{
        setDescription(e.target.value)
        console.log(description);
        
        setWordscount(prvcount=>++prvcount ) // need to solve this doubt
      }

      // useEffect(()=>{
      //   async function createnewnote(){
      //       const formData = new URLSearchParams();
      //       const createnotename = description.substring(0,15)
      //       console.log(createnotename);
            
      //       formData.append('notedescription', createnotename);
      //           const result =  await fetch(`http://localhost:3001/api/addnote`,{
      //               method: 'POST',
      //               headers:{
      //                   'Content-Type': 'application/x-www-form-urlencoded',
      //                   Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwcmF0aWtzaW5naDIxMjAwMEBnbWFpbC5jb20iLCJpYXQiOjE3MTgyMTE2NTcsImV4cCI6MTcxODU3MTY1N30.8BEBSU1MmqTFERMnvK_KJ7PdE5uYY53Ol3NWwHAU9_s`
      //               },
      //               body: formData.toString(),
                   
      //             })
      //             const res = await result.json()
      //             console.log(res.noteid);
      //           //   const url = `/app/newnote/${res.noteid}`;
      //             setIdstate(res.noteid)
      //         setNewnote({
      //           noteid:res.noteid,
      //           notename:''
      //         })
                  
      //     }
      //       if(!idstate){
      //         createnewnote()
      //       }
      //   },[])

  return (
    <div className='border-2 w-4/5'>
      {/* <TextArea/> */}
      <textarea onChange={textonchnage} value={description} className='w-full h-full'>
      </textarea>
    </div>
  )
}


       
    // if(!id){
    //     //new text area
    //     //after 5 word insert new notes 
    //     //get that note and append id in url
    //     //create notename by taking starting some word 
    //   }