import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { servername } from "../../servername";
import { useSetRecoilState } from "recoil";
import { alertstate } from "../../store/notes";

function ShowContent() {
  const setAlertstate = useSetRecoilState(alertstate);
  const [description, setDescription] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(true);
  const { id } = useParams();
  useEffect(() => {
    getnotecontent();
  }, [id]);

  async function getnotecontent() {
    try {
      const res = await fetch(`${servername}/api/sharelink/getnote/${id}`);
      const endres = await res.json();
      console.log(endres.data);

      if (endres.data && endres.statuscode === 200) {
       
        setDescription(endres.data);
      } else if (endres.message === "access deneid") {
        setAlertstate({
          isalert: true,
          alertname: "this note is not shareable !",
          alertcolor: "bg-red-500",
        });
      } else if (endres.error) {
        setAlertstate({
          isalert: true,
          alertname: "something went wrong please try again",
          alertcolor: "bg-red-500",
        });
      }
      setLoader(false);
    } catch (error) {
      setAlertstate({
        isalert: true,
        alertname: "something went wrong please try again",
        alertcolor: "bg-red-500",
      });
    }
  }
  function changedescription(e:React.ChangeEvent<HTMLTextAreaElement>){
    setDescription(e.target.value)
  }
  async function savedescription() {
    try {
      if(!description) {
        setAlertstate({
          isalert:true,
          alertname: 'Please write something before save',
          alertcolor:'bg-red-500'
        })
        return
      }
      
      const formdata = new URLSearchParams()
      formdata.append('notedescription',description)
        const res = await fetch(`${servername}/api/sharelink/edit/notedescription/${id}`,{
          method:'PATCH',
            body:formdata
        });
        const endres = await res.json();
        setAlertstate({
          isalert:true,
          alertname: endres.message,
          alertcolor:'bg-green-500'
        })
        
    } catch (error) {
      setAlertstate({
        isalert:true,
        alertname: 'something went wrong please try again',
        alertcolor:'bg-red-500'
      })
      
    }
  }
  return (
    <div className="w-[90%] h-[500px] mx-auto my-4 border-white border-2 ">
      {loader ? (
        <div className="h-full flex justify-center w-64 mx-auto py-64">
          L O A D I N G . . . .
        </div>
      ) : (
       <div className="border h-full">
        <button className="w-16 bg-green-400 text-black m-1" onClick={savedescription}>save</button>
        <textarea
          placeholder="Write here"
          id="txtar"
          value={description}
          onChange={(e)=>changedescription(e)}
          className="w-full h-[88%] p-2 outline-none resize-none bg-dark scrollbar-thin"
        ></textarea>
       </div>
      )}
    </div>
  );
}

export default ShowContent;
