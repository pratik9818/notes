import { useEffect } from 'react'
import { islogin, issearch, notes, searchresultstate } from '../../store/notes'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import NotesfilesName from './NotesfilesName'
import GetToken from '../../packages/GetToken'
import { useNavigate } from 'react-router-dom'
// import WaitingIcon from '../../packages/WaitingIcon'
 function NotesSection() {
    const navigate = useNavigate()
    const [allnotes, setNotes] = useRecoilState(notes)
    const searchresult = useRecoilValue(searchresultstate)
    const token = GetToken()
    const issearchstate  = useRecoilValue(issearch)
    const setTokeninfo = useSetRecoilState(islogin)
    const maxstringLimit = 20
    useEffect(()=>{        
        async function getallnotename() {
            const result = await fetch('http://localhost:3001/api/getnote/allnotenames',{
            headers:{
                Authorization:`${token}`
            }
        })
        const res = await result.json()
        console.log(res);
        
            if(res.error){
                 if(res.error == 'token expiry') {
                    setTokeninfo({
                        islogin:false,
                        reason:'Your session has expiry please login',
                        message:'token expiry'
                      })
                    navigate('/app/token')
                }
            }
            setNotes(res.data)
        }
        getallnotename()
    },[token])
    
  return (
    <div className='my-3 overflow-y-auto h-3/4 scrollbar w-full'>
        {!issearchstate ? 
            allnotes.length ? allnotes?.map((element) =>{
                if(!element) return
                return <NotesfilesName key={element.noteid} notename={element.notename} noteid={element.noteid}/>
            }) : <div className='text-center'>No notes</div>
        :   searchresult.length ? searchresult?.map((element) =>{
            if(!element) return
            return <div className=''>
                <NotesfilesName key={element.noteid} notename={element.notename} noteid={element.noteid}/>
                <div className='border w-full break-words text-sm p-2 h-12 '>{element?.notedescription ? element?.notedescription.substring(0,maxstringLimit) : 'No Description'}</div>
            </div>
        }) : <div className='text-center'>No notes</div>}
    </div>
  )
}
export default NotesSection