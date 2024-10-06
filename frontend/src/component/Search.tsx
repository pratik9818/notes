import { ChangeEvent ,useEffect,useState} from "react"
import { useRecoilState } from "recoil"
import { issearch, searchresultstate } from "../store/notes"
import { useNavigate } from "react-router-dom"
import useGetToken from "../packages/GetToken"
import { servername } from "../servername"


export default function Search() {
  const navigate = useNavigate()
  const token = useGetToken()
  // const limitchar = 1
  const updatetime = 600
const [searchvalue, setsearchvalue] = useState('')
const [searchresult , setSearchresult] = useRecoilState(searchresultstate)
const [issearchstate , setIssearchstate] = useRecoilState(issearch)
const [typing , setTyping] = useState<NodeJS.Timeout | null>(null)
async function searchreq(searchparams:string){
  if(!issearchstate) return
  const result =  await fetch(`${servername}/api/searchnotes?search=${searchparams}`,{
    headers:{
        Authorization:  `${token}`
    }
  })
  const res = await result.json()
  // console.log(res)
  // if(!issearchstate) return

  if(res.data.length)
  setSearchresult(res.data)
else {
  let s_r = [...searchresult]
  s_r = []
  // setIssearchstate(false)
  setSearchresult(s_r)   
}
}
async function searchnotes(e:ChangeEvent<HTMLInputElement>){
  const searchparams = e.target.value
  // setIssearchstate(true)
  // setsearchvalue(searchparams)
  
  setIssearchstate(true)
  if(typing){
    clearTimeout(typing)
  }
  const timeoutid = setTimeout(() => {
    setsearchvalue(searchparams)
  }, updatetime);

  setTyping(timeoutid)

}
useEffect(()=>{
  // let s_r = [...searchresult]
  //   s_r = []
  //   setSearchresult(s_r)  
  // if(searchvalue.length == 0){
  //     setIssearchstate(false)
  // }
  // else if(searchvalue.length > limitchar){
  //   searchreq(searchvalue)
  // }
  if(!searchvalue.length){
    let s_r = [...searchresult]
  s_r = []
  setIssearchstate(false)
  setSearchresult(s_r)   
    return
  }
  searchreq(searchvalue)
},[searchvalue])
function redirectfun(){
  navigate('/app/search')
}
  return <input onClick={redirectfun} onChange={(e)=>searchnotes(e)} type="search" className="border-2 border-bordercolor w-full h-9 outline-none px-2 mt-5 rounded bg-dark text-textcolor" placeholder="search notes"/>
}
