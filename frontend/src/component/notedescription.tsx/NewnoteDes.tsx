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
  
  const [typing, setTyping ] = useState<NodeJS.Timeout | null>(null)
  const [allnotes,setNotes]= useRecoilState(notes)
  const [description, setDescription] = useState<descriptiontypo>('')
  const descriptionRef = useRef(description);
    const [isaddnoted , addIsaddnoted] = useState<boolean>(false)
    const updatetime = 1000
    const maxchar = 4
    useEffect(() => {
    if(textarearef.current) textarearef.current.focus()
      }, [])
    
  //  useEffect(()=>{
    async function addnote() {
      if(!description) return
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
                notename:createnotename,
                notedescription : descriptionRef.current
              }
                )
              setNotes(updatednotes)
              navigate(`/app/${res_noteid}`)
    }

    const textonchnage = (e:ChangeEvent<HTMLTextAreaElement>)=>{
      const value = e.target.value
        setDescription(value)
        descriptionRef.current = value
        if(typing){
          clearTimeout(typing)
        }
        const timeoutid = setTimeout(() => {
         if(description.length > maxchar && !isaddnoted){
           addnote() //bug here test properly
           addIsaddnoted(true)
         }
      }, updatetime);
      
      setTyping(timeoutid)
      }
      const onpaste = (e:ClipboardEvent<HTMLTextAreaElement>)=>{
        e.preventDefault()
          const paste = e.clipboardData?.getData('text/plain')
          setDescription(description+paste)
          descriptionRef.current = description+paste
          if(typing){
            clearTimeout(typing)
          }
          const timeoutid = setTimeout(() => {
           if(description.length > maxchar && !isaddnoted){
             addnote() 
             addIsaddnoted(true)
           }
        }, updatetime);
        
        setTyping(timeoutid)
      }
     
  return (
    <div className='w-full'>
      <textarea onPaste={onpaste} placeholder='Write here' onChange={textonchnage} ref={textarearef} value={description} className='w-full h-full p-2 outline-none resize-none'>
      </textarea>
    </div>
  )
}