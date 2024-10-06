import { useRecoilState, useSetRecoilState } from 'recoil'
import { alertstate, issharemodalopen, notes } from '../../store/notes'
import React, { useEffect, useState } from 'react'
import { servername, webname } from '../../servername'
import GetToken from '../../packages/GetToken'
function ShareModal() {
  const token = GetToken()
    const [ismodalopen,setIsmodalopen] = useRecoilState(issharemodalopen)
    const [isshare , setIsshare] = useState<string | null>(null)
    const [allnotes,setNotes]= useRecoilState(notes)
    const [accesstype , setAccesstype] = useState<string | null>(null)
    const setAlertstate = useSetRecoilState(alertstate)
    
    function closemodal(e:React.MouseEvent<HTMLDivElement>){
      const modalcoverid = 'modalcover';
      const target = (e.target as HTMLDivElement).id;
      if(target === modalcoverid) setIsmodalopen({
        modalopen:false,
        sharenoteid:null,
        share:null,
        accesstype:null
      });
    }
    function copysharelink(){
      const copytxt = ismodalopen.sharenoteid ? `${webname}/app/sharenote/${ismodalopen.sharenoteid}` :''
      navigator.clipboard.writeText(copytxt)
    }

    function sharenote(e:React.ChangeEvent<HTMLSelectElement>){
      //the problem is here and changeaccesstpe fun , state do not chnage when onchange listener run due to this useeffect do not run hence fetch function do not run and update do not happen
        setIsshare(e.target.value)
      }
      function changeaccesstype(e:React.ChangeEvent<HTMLSelectElement>){
        setAccesstype(e.target.value)
      }
    useEffect(() => {
      if(isshare)
      updateshareaccess()
  }, [isshare])

    useEffect(() => {
     if(accesstype) updateacesstype()
     }, [accesstype])
    async function updateshareaccess() {
      try {
        const index =  allnotes?.findIndex(element => element.noteid === ismodalopen.sharenoteid)
        const formData = new URLSearchParams();
        if(isshare){
          formData.append('share',isshare)
        }
        const res = await fetch(`${servername}/api/sharelink/edit/shareaccess/${ismodalopen.sharenoteid}`,{
          method:'PATCH',
          headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `${token}`
        },
        body:formData
        })
        const endres = await res.json()        
        const updatednotes = [...allnotes]
        
        updatednotes[index] = {
            ...updatednotes[index] ,
            isshare : isshare === 'true' ? true : false
        }
        setNotes(updatednotes)
        console.log(allnotes[index]);
        
        setAlertstate({
          isalert:true,
          alertname: endres.message,
          alertcolor:'bg-green-500'
        })
      } catch (error) {
        setAlertstate({
          isalert:true,
          alertname:'something went wrong please try again',
          alertcolor:'bg-red-500'
        })
      }
    }
    async function updateacesstype() {
      try {
        const index =  allnotes?.findIndex(element => element.noteid === ismodalopen.sharenoteid)
        const formData = new URLSearchParams();
        if(accesstype){
          formData.append('accesstype',accesstype)
        }
        const res = await fetch(`${servername}/api/sharelink/edit/accesstype/${ismodalopen.sharenoteid}`,{
          method:'PATCH',
          headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `${token}`
        },
        body:formData
        })
        const endres = await res.json()        
        const updatednotes = [...allnotes]
        updatednotes[index] = {
            ...updatednotes[index] ,
            access_type : accesstype ? accesstype : 'read'
        }
        setNotes(updatednotes)
        setAlertstate({
          isalert:true,
          alertname: endres.message,
          alertcolor:'bg-green-500'
        })
      } catch (error) {
        setAlertstate({
          isalert:true,
          alertname:'something went wrong please try again',
          alertcolor:'bg-red-500'
        })
      }
    }
    
  return !ismodalopen.modalopen || (
    <div onClick={(e)=>closemodal(e)} className='h-full w-full bg-transparent text-black absolute flex' id='modalcover'>
     <div className='border w-[100%] h-[25%] m-auto bg-gray-300 flex justify-around flex-col p-2 lg:w-[35%] md:w-[45%] sm:w-[60%]'>
        <div className='flex justify-between'>
            <span className='w-[75%] break-words'>{`localhost:5173/app/sharenote/`+ ismodalopen.sharenoteid}</span>
            <button className='border-2 border-black h-9  px-2' onClick={copysharelink}>copy</button>
        </div>
        <div className='h-[50%] flex flex-col justify-around'>
           <div>
            <span className='mr-4'>Share Note</span>
            {ismodalopen.share ?<select onChange={(e)=>sharenote(e)}><option value="true">true</option><option value="false">false</option></select>:<select onChange={(e)=>sharenote(e)}><option value="false">false</option><option value="true">true</option></select>}
           </div>

           <div>
            <span className='mr-4'>Change Access Type</span>
           {
            ismodalopen.accesstype === 'read' ? <select onChange={changeaccesstype}> <option value="read">read only</option><option value="edit">edit</option></select> : <select onChange={changeaccesstype}> <option value="edit">edit</option><option value="read">read only</option></select>
           }
           </div>
        </div>
     </div>
    </div>
  )
}

export default ShareModal
