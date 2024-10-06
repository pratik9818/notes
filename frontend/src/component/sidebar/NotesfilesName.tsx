import React ,{useState,useEffect,useRef} from 'react'
import { notestypo } from '../../typo/notestypo'
import { useNavigate } from 'react-router-dom'
import DeleteBtn from '../DeleteBtn'
import { useRecoilState, useSetRecoilState, } from 'recoil'
import { alertstate, deletenote, issharemodalopen, notes, trackactivenotecolor } from '../../store/notes'
import GetToken from '../../packages/GetToken'
import { servername } from '../../servername'


export default function NotesfilesName({notename,noteid,isshare,access_type}:notestypo) {
  
    const navigate = useNavigate()
    const token = GetToken()
    const [state, setstate] = useState(false)
    const[updatenotename,setupdateNotename] = useState<string>('')
    const inputref = useRef<HTMLInputElement>(null)
    const activeref = useRef<HTMLDivElement>(null)
    const [prvrestate, setRefstate] = useRecoilState(trackactivenotecolor)
    const [deleteState, setDeleteState] = useRecoilState(deletenote);
    const [allnote , setAllnote] = useRecoilState(notes)
    const [isHovered, setIsHovered] = useState(false);
    const setAlertstate = useSetRecoilState(alertstate)
    const setIssharemodalopen = useSetRecoilState(issharemodalopen)
    function handleref(target:string){
     if(target != 'delete'){
      if(prvrestate){
        prvrestate.style.background = ''
        }
        if(activeref.current){
          activeref.current.style.background = '#71797E'
          }
        setRefstate(activeref.current)
     }
    }
   
    async function getnotedes(e:React.MouseEvent<HTMLDivElement>){
      const noteid = (e.target as HTMLDivElement).id
      handleref(noteid)
      if (deleteState) {
        setDeleteState(null);
        }
       
        navigate(`/app/${noteid}`)
   } 
   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setupdateNotename(value);
  };
  const handleKeyPress = (e:React.KeyboardEvent<HTMLInputElement>)=>{
    if (e.key === 'Enter') {
        if(inputref.current){
            inputref.current.blur()
        }
        saveNameToDB()
        setstate(false)
      }
  }
  async function saveNameToDB(){
   
    if(notename == updatenotename){
        return
       } 
    const formData = new URLSearchParams();
formData.append('notename', updatenotename);
    const result =  await fetch(`${servername}/api/updatenote/notename/${noteid}`,{
        method: 'PUT',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `${token}`
        },
        body: formData.toString(),
       
      })
      const res = await result.json()
      console.log(res);
      if(res.status == 200){
        const index =  allnote?.findIndex(element => element.noteid == noteid)
        const updatednotes = [...allnote]
          
          updatednotes[index] = {
              ...updatednotes[index] ,
              notename : updatenotename
          }
          setAllnote(updatednotes)
          setAlertstate({
            isalert:true,
            alertname: res.message,
            alertcolor:'bg-green-500'
          })
      }else{
        setAlertstate({
          isalert:true,
          alertname: res.message,
          alertcolor:'bg-red-500'
        })
      }
  }
   useEffect(()=>{
    if(inputref.current){
        inputref.current.focus()
    }
   },[state])
   function editmode(){
    setstate(true)
    if(notename?.length && !updatenotename.length){
        setupdateNotename(notename)
    }
   }
   function handleMouseEnter(){
     setIsHovered(true);
    }
    function handleMouseLeave(){
      if(state){
        saveNameToDB()
      }
     setIsHovered(false);
     setstate(false)
    }
    function sharenote(noteid:string,share:boolean , accesstype:string){
      setIssharemodalopen({
        modalopen:true,
        sharenoteid:noteid,
        share:share,
        accesstype:accesstype
      })
    }
  return (
    <div id={noteid} ref={activeref} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className='flex justify-between w-full mx-auto mt-5 cursor-pointer border p-1 items-center rounded bg-bgnotename' >
     { !state || !isHovered ? <div  onClick={(e)=>getnotedes(e)} id={noteid}  className='h-7 w-[60%]'>
        {updatenotename ? updatenotename.substring(0,18):notename.substring(0,18)}
      </div> :
      <input value={updatenotename} ref={inputref} onKeyDown={handleKeyPress} onChange={handleInputChange} type="text" className='h-7 w-full outline-none bg-bgnotename' autoFocus/>}
      {!state && isHovered ?
      <div className='flex w-[90px]'>
        <button onClick={()=>sharenote(noteid,isshare,access_type)}>share</button> 
        <img onClick={editmode} className="w-5 h-5 mx-2 cursor-pointer" src="/assets/editicon.png" alt="..." /> 
       <DeleteBtn  noteid={noteid} />
      </div>: ''}
     
    </div>
  )
}
