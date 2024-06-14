import React ,{useState,useEffect, ChangeEvent,useRef} from 'react'
import { notestypo } from '../../typo/notestypo'
import { useNavigate } from 'react-router-dom'
import DeleteBtn from '../DeleteBtn'

export default function NotesfilesName({notename,noteid}:notestypo) {
    const navigate = useNavigate()
    const [state, setstate] = useState(false)
    const[updatenotename,setupdateNotename] = useState<string>('')
    const inputref = useRef<HTMLInputElement>(null)
   async function getnotedes(e:React.MouseEvent<HTMLDivElement>){
    const noteid = (e.target as HTMLDivElement).id
    navigate(`app/${noteid}`)
   } 
   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setupdateNotename(value);
  };
   const handleClickOutside = (event:MouseEvent) => {
    if (inputref.current && !inputref.current.contains(event.target as Node)) {
        saveNameToDB()
        setstate(false)
    }
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
    // if(notename == updatenotename){
    //     return
    //    } // this condition full fill if notename state will update when updatenotename staate change because updatenotename state get chnage but notename state get unchanged
    //need to apply this condition -- very imp
    const formData = new URLSearchParams();
formData.append('notename', updatenotename);
    const result =  await fetch(`http://localhost:3001/api/updatenote/notename/${noteid}`,{
        method: 'PUT',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwcmF0aWtzaW5naDIxMjAwMEBnbWFpbC5jb20iLCJpYXQiOjE3MTgyMTE2NTcsImV4cCI6MTcxODU3MTY1N30.8BEBSU1MmqTFERMnvK_KJ7PdE5uYY53Ol3NWwHAU9_s`
        },
        body: formData.toString(),
       
      })
      const res = await result.json()
      console.log(res);
      
  }
   useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [updatenotename])

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
  return (
    <div className='flex justify-between w-11/12 mx-auto my-3 cursor-pointer' >
     { !state ? <div onClick={(e)=>getnotedes(e)}  id={noteid} className='h-7 w-3/4'>
        {updatenotename ? updatenotename:notename}
      </div> :
      <input value={updatenotename} ref={inputref} onKeyDown={handleKeyPress} onChange={handleInputChange} type="text" className='h-7 w-3/4' autoFocus/>}
      {!state ?
      <div className='flex px-2'>
        <img onClick={editmode} className="w-4 h-4 mx-2 cursor-pointer" src="/src/assets/editicon.png" alt="..." /> 
        <DeleteBtn noteid={noteid}/>
      </div>: ''}
    </div>
  )
}

//i think i need to update the main allnote state 
//need to check before updateing notes name , is old and new note name different or same
