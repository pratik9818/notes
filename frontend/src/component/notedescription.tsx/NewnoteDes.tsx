// import React from 'react'
import {useState,useEffect, ChangeEvent, useRef, ClipboardEvent}from 'react'
import {useNavigate} from 'react-router-dom'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { notes } from '../../store/notes'
import GetToken from '../../packages/GetToken'
import { sidebardisplayState } from '../../store/modal'
type descriptiontypo = string
export default function NewnoteDes() {
  const setDisplay = useSetRecoilState(sidebardisplayState)
  useEffect(()=>{
    const innerwidth = window.innerWidth
    const max = 450
    if(max >= innerwidth){
      setDisplay(true)
    }
  },[])
  const textarearef = useRef<HTMLTextAreaElement>(null)
  const token = GetToken()
  const navigate = useNavigate()

    const [allnotes,setNotes]= useRecoilState(notes)
   const [description, setDescription] = useState<descriptiontypo>('')
   const [wordscount , setWordscount] = useState<number>(0)
   const  maxchartoUpdate = 5
    const [idstate , setIdstate] = useState<string>('')
    const [isname , setIsname] = useState<boolean>(false)
    useEffect(() => {
    if(textarearef.current) textarearef.current.focus()
      }, [])
    
   useEffect(()=>{
    async function addnote() {
      const formData = new URLSearchParams();
      const createnotename = description.substring(0,15)
      
      formData.append('notename', createnotename);
      
    const result =  await fetch(`http://localhost:3001/api/addnote`,{
      method: 'POST',
      headers:{
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:  `${token}`
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
              setIsname(true)
    }
    if(!isname && wordscount == maxchartoUpdate){
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
                Authorization:  `${token}`
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
            navigate(`/app/${idstate}`)
          }
  }
  
  if(wordscount >= maxchartoUpdate && isname){
    updatedescription()
    setWordscount(0)
  }
},[description,isname])
    const textonchnage = (e:ChangeEvent<HTMLTextAreaElement>)=>{
        setDescription(e.target.value)
        setWordscount(prvcount=>++prvcount ) // need to solve this doubt
      }
      const onpaste = (e:ClipboardEvent<HTMLTextAreaElement>)=>{
        e.preventDefault()
          const paste = e.clipboardData?.getData('text/plain')
          if(paste.length >= maxchartoUpdate){
            setWordscount(maxchartoUpdate)
            setDescription(paste)
            return
          }
          setWordscount(paste.length)
            setDescription(paste)
      }

  return (
    <div className='w-full'>
      {/* <TextArea/> */}
      <textarea onPaste={onpaste}  onChange={textonchnage} ref={textarearef} value={description} className='w-full h-full p-2 outline-none resize-none'>
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