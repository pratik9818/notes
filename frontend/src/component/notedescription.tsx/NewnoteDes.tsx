// import React from 'react'
import {
  useState,
  useEffect,
  ChangeEvent,
  useRef,

} from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { alertstate, device, notes } from "../../store/notes";
import GetToken from "../../packages/GetToken";
import { sidebardisplayState } from "../../store/modal";
import { servername } from "../../servername";
// import TextEditor from "./TextEditor";
type idstate = string;
type descriptiontypo = string;
export default function NewnoteDes() {
  const setDisplay = useSetRecoilState(sidebardisplayState);
  const devicetype = useRecoilValue(device);
  useEffect(() => {
    if (devicetype === "mobile") {
      setDisplay("hidden");
    }
  }, []);
  const textarearef = useRef<HTMLTextAreaElement>(null);
  const token = GetToken();
  const navigate = useNavigate();
  const descriptioncharLimit = 5000
  const [typing, setTyping] = useState<NodeJS.Timeout | null>(null);
  const [allnotes, setNotes] = useRecoilState(notes);
  const [description, setDescription] = useState<descriptiontypo>("");
  const descriptionRef = useRef(description);
  const [isaddnoted, addIsaddnoted] = useState<boolean>(false);
  const updatetime = 1000;
  const maxchar = 4;
  const setAlertstate = useSetRecoilState(alertstate)
  const [isnavigationloaded , isNavigationloaded] = useState<boolean>(false)
  useEffect(() => {
    if (textarearef.current) textarearef.current.focus();
  }, []);

  //  useEffect(()=>{

  async function updatedescription(res_noteid: idstate) {
    //the problem is here notedes do not get update if word is less then 5 like whywhy forexample , updatename get update but updatedescription() do no call --problem solved , just add new useeffect with des and isname dependency 
    const storeDescCharLimit :  number | undefined = textarearef.current?.value.length 
    
    const formData = new URLSearchParams();
    if (textarearef.current?.value) formData.append("notedescription", textarearef.current?.value.substring(0,descriptioncharLimit));
    else formData.append("notedescription", " ");
    const result = await fetch(
      `${servername}/api/updatenote/notedescription/${res_noteid}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `${token}`,
        },
        body: formData.toString(),
      }
    );
    const res = await result.json();
    if (res.status == 200){
        if(storeDescCharLimit && storeDescCharLimit > descriptioncharLimit){
          setAlertstate({
            isalert:true,
            alertname: 'Note can not be more then 5 k char',
            alertcolor:'bg-red-500'
          })
          navigate(`/app/${res_noteid}`);
        isNavigationloaded(false)
        return
        
      }
      setAlertstate({
        isalert:true,
        alertname: res.message,
        alertcolor:'bg-green-500'
      })
      navigate(`/app/${res_noteid}`);
      isNavigationloaded(false)
    }else{
      setAlertstate({
        isalert:true,
        alertname: res.message,
        alertcolor:'bg-red-500'
      })
      isNavigationloaded(false)
    }
  }
  async function addnote() {
    
    if (!textarearef.current?.value.length) return;
    const formData = new URLSearchParams();
    const createnotename = textarearef.current?.value
      ? textarearef.current?.value.substring(0, 15)
      : "Untitle";
    formData.append("notename", createnotename);

    const result = await fetch(`${servername}/api/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `${token}`,
      },
      body: formData.toString(),
    });
    const res = await result.json();
    if(res.status === 200){
      const res_noteid = res.noteid;
    const updatednotes = [...allnotes];
    updatednotes.unshift({
      noteid: res_noteid,
      notename: createnotename,
      notedescription: textarearef.current?.value.length > descriptioncharLimit ? textarearef.current?.value.substring(0 , descriptioncharLimit) : textarearef.current?.value
    });
    setNotes(updatednotes);
    updatedescription(res_noteid);
      setAlertstate({
        isalert:true,
        alertname: res.message,
        alertcolor:'bg-green-500'
      })
      isNavigationloaded(true)
    }else{
      setAlertstate({
        isalert:true,
        alertname: res.message,
        alertcolor:'bg-red-500'
      })
    }
  }

  const textonchnage = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(value);
    descriptionRef.current = value;
    if (typing) {
      addIsaddnoted(false);
      clearTimeout(typing);
    }
    const timeoutid = setTimeout(() => {
      if (descriptionRef.current.length > maxchar && !isaddnoted) {
        addnote(); //bug here test properly
        addIsaddnoted(true);
      }else{
        setAlertstate({
          isalert:true,
          alertname: 'min 4 char need to create a note',
          alertcolor:'bg-red-500'
        })
      }
    }, updatetime);

    setTyping(timeoutid);
  };


  return (
    <div className="w-full">
     {isnavigationloaded ? <div className='h-full flex justify-center w-64 mx-auto py-64'>U P D A T I N G . . .</div>: <textarea
        // onPaste={onpaste}
        placeholder="Write here"
        onChange={textonchnage}
        ref={textarearef}
        value={description}
        className="w-full h-[99%] p-2 outline-none resize-none text-textcolor bg-dark scrollbar-thin"
        ></textarea>
      }
    </div>
  );
}
