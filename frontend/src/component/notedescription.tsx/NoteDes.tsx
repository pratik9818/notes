import {useState,useEffect, ChangeEvent}from 'react'
import { useParams,useNavigate} from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { notes } from '../../store/notes'
import TextArea from './TextArea'

type descriptiontypo = string
export default function NoteDes() {
   const [allnotes,setNotes]= useRecoilState(notes)
   const [description, setDescription] = useState<descriptiontypo>('')
   const [wordscount , setWordscount] = useState<number>(0)
    const {id} = useParams()
    const  maxchartoUpdate = 5 //what if user cut/remove the notes before 20 char
    //i can do one thing , i take updateed note every 2or 4 sec and store in local storage and every 1 minutes all the notes send to db . 2 probem will sove through it 1 is i dont have send req in every update of notes and 2nd is i dont have to worry for what if 20 word not completerd or what if (user computer shutdown i need to think is although apert from it) user switch notes , close the tab 
    //need to think when user copy and paste
    //need to think if i use ls logic then what is storage size of ls and need to limit also note size according to ls size
    //big-problem is ls apporch when user open its notes on another device , then he wont find its update notes (if user close tab before 1 minutes and login to other devices)
    //solution ladies -- > i will use indexDB for storing data and for updating the data in the case of close tab , i will use Page Unload Event
    const index =  allnotes?.findIndex(element => element.noteid === id)
 

   useEffect(()=>{
    
    async function getdes() {
       const isdescription = allnotes[index]?.notedescription
       console.log(isdescription);
       
        if(!isdescription){
         const result =  await fetch(`http://localhost:3001/api/getnote/notedescription/${id}`,{
            headers:{
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwcmF0aWtzaW5naDIxMjAwMEBnbWFpbC5jb20iLCJpYXQiOjE3MTgyMTE2NTcsImV4cCI6MTcxODU3MTY1N30.8BEBSU1MmqTFERMnvK_KJ7PdE5uYY53Ol3NWwHAU9_s`
            }
          })
          const res = await result.json()
          const resdes = res.data[0].notedescription
          console.log(resdes);
          resdes ? setDescription(resdes) : setDescription('') 
          
          const updatednotes = [...allnotes]
          
          updatednotes[index] = {
              ...updatednotes[index] ,
              notedescription : resdes ? resdes :' '
          }
          setNotes(updatednotes)
        
    }
    else setDescription(isdescription)
    
}
    getdes()
},[id]) //need to fix rerender due to allnotes state

const textonchnage = (e:ChangeEvent<HTMLTextAreaElement>)=>{
  setDescription(e.target.value)
  console.log(description);
  
  setWordscount(prvcount=>++prvcount ) // need to solve this doubt
}
useEffect(()=>{

    async function updatedescription(){
      const formData = new URLSearchParams();
      formData.append('notedescription', description);
          const result =  await fetch(`http://localhost:3001/api/updatenote/notedescription/${id}`,{
              method: 'PATCH',
              headers:{
                  'Content-Type': 'application/x-www-form-urlencoded',
                  Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwcmF0aWtzaW5naDIxMjAwMEBnbWFpbC5jb20iLCJpYXQiOjE3MTgyMTE2NTcsImV4cCI6MTcxODU3MTY1N30.8BEBSU1MmqTFERMnvK_KJ7PdE5uYY53Ol3NWwHAU9_s`
              },
              body: formData.toString(),
             
            })
            const res = await result.json()
            // console.log(res);
            if(res.status == 200){
              const updatednotes = [...allnotes]
              updatednotes[index] = {
                  ...updatednotes[index] ,
                  notedescription : description ? description :' '
              }
              setNotes(updatednotes)
            }
    }
    
    if(wordscount > maxchartoUpdate){ //need to think about how i can do it another optimize way
      updatedescription()
      setWordscount(0)
    }
 
},[description])

  return (
    <div className='border-2 w-4/5'>
      {/* <TextArea/> */}
      <textarea onChange={textonchnage} value={description} className='w-full h-full'>
      </textarea>
    </div>
  )
}