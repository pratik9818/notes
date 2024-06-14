import { useRecoilState ,useSetRecoilState} from "recoil"
import { ChangeEvent,KeyboardEvent, useState } from 'react';
import {newcategory,categorys } from "../../store/folder"
export default function FolderInput() {
  const setNewcategory = useSetRecoilState(newcategory)
  const [newcategorysArray,setNewcategorysArray] = useRecoilState(categorys)
  const [state, setstate] = useState('')
  function storecategoryName(e:ChangeEvent<HTMLInputElement>){
    setstate(e.target.value)
  }
  function saveCategory(e:KeyboardEvent<HTMLInputElement>){
      if(e.key === 'Enter'){
        setNewcategory(false)
        setNewcategorysArray([...newcategorysArray,state])
      }
  }
  return <input value={state} onChange={(e)=>storecategoryName(e)} onKeyDown={e=>saveCategory(e)} className="w-3/4" type="text" placeholder="write and enter"/>
}
