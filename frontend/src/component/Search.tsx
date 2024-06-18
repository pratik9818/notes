import { ChangeEvent ,useEffect,useState} from "react"
import { useRecoilState } from "recoil"
import { issearch, searchresultstate } from "../store/notes"
import { useNavigate } from "react-router-dom"
import useGetToken from "../packages/GetToken"

export default function Search() {
  const navigate = useNavigate()
  const token = useGetToken()
  const limitchar = 3
const [maxchar, setMaxchar] = useState('')
const [searchresult , setSearchresult] = useRecoilState(searchresultstate)
const [issearchstate , setIssearchstate] = useRecoilState(issearch)
async function searchreq(searchparams){
  if(!issearchstate) return
  const result =  await fetch(`http://localhost:3001/api/searchnotes?search=${searchparams}`,{
    headers:{
        Authorization:  `${token}`
    }
  })
  const res = await result.json()
  console.log(res)
  if(!issearchstate) return

  if(res.data.length)
  setSearchresult(res.data)
else {
  let s_r = [...searchresult]
  s_r = []
  setSearchresult(s_r)   
}
}
async function searchnotes(e:ChangeEvent<HTMLInputElement>){
  const searchparams = e.target.value
  setIssearchstate(true)
  setMaxchar(searchparams)

}
useEffect(()=>{
  let s_r = [...searchresult]
    s_r = []
    setSearchresult(s_r)  
  if(maxchar.length == 0){
      setIssearchstate(false)
  }
  else if(maxchar.length > limitchar){
    searchreq(maxchar)
  }
},[maxchar])
function redirectfun(){
  navigate('/app/search')
}
  return <input onClick={redirectfun} onChange={(e)=>searchnotes(e)} type="search" className="border-2 w-full h-9 outline-none px-2 mt-5 rounded" placeholder="search notes"/>
}
