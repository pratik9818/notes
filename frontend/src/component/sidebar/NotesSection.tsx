import React, { useEffect, useRef, useState } from "react";
import {
  islogin,
  issearch,
  notes,
  searchresultstate,
  totalnotesnumber,
} from "../../store/notes";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import NotesfilesName from "./NotesfilesName";
import GetToken from "../../packages/GetToken";
import { useNavigate } from "react-router-dom";
import { servername } from "../../servername";

// import WaitingIcon from '../../packages/WaitingIcon'
const NotesSection = React.memo(() => {
  const navigate = useNavigate();
  const [allnotes, setNotes] = useRecoilState(notes);
  const searchresult = useRecoilValue(searchresultstate);
  const token = GetToken();
  const issearchstate = useRecoilValue(issearch);
  const setTokeninfo = useSetRecoilState(islogin);
  const maxstringLimit = 20;
  const [totalnoteslength, setTotalnoteslength] = useRecoilState(totalnotesnumber);
  const [page, setPage] = useState<number>(1); // Track the current page for loading more data
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const containerRef = useRef<HTMLDivElement | null>(null); // Reference to the scrollable div
  const [isscrolldown , isScrolldown] = useState<boolean>(false)
  useEffect(() => {
    const queryParams = new URLSearchParams();
    
        queryParams.append("notesnumber", totalnoteslength);
    async function getallnotename() {
        // setLoading(false);
        // console.log('in getallnames');
        try {
            const result = await fetch(
                `${servername}/api/getnote/allnotenames?${queryParams}`,
                {
                  headers: {
                    Authorization: `${token}`,
                  },
                }
              );
              
              const server_res = await result
              if(server_res.status === 204) {
                setLoading(false);
                // isScrolldown(false)
                return
              }
             const res = await server_res.json()
              
              if (res.error) {
                if (res.error == "token expiry") {
                  setTokeninfo({
                    islogin: false,
                    reason: "Your session has expiry please login",
                    message: "token expiry",
                  });
                  navigate("/app/token");
                }
              }
              if (res.data) {
                setNotes((allnotes)=> [...allnotes,...res.data]);
                setTotalnoteslength((prevLength) => (parseInt(prevLength) + res.data.length).toString());
                // isScrolldown(false)
              } else {
                  setNotes([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally{
                setLoading(false);
                // isScrolldown(false)
                // console.log(allnotes);
                // console.log(isscrolldown);
        }
    }
    getallnotename();
  }, [token,page]);
  

  
  const handleScroll = () => {
    //   console.log(isscrolldown);
      if (!containerRef.current || loading) return;
       
        
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    // isScrolldown(false)
    // Check if the user scrolled to the bottom
    // console.log(Math.ceil(scrollTop + clientHeight),'scrollTop + clientHeight');
    // console.log(scrollHeight,'scrollHeight');
    
    if (Math.ceil(scrollTop + clientHeight) >= scrollHeight && !isscrolldown)  {
        isScrolldown(true) // it is not updating dierecly therefor condintion matching twice
      setPage((prevPage) => prevPage + 1);
    }
  };
  useEffect(() => {
    const current = containerRef.current;
    
    if (current) {
      current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (current) {
        current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loading]);
  return (
    <div ref={containerRef} className="my-6 h-3/4 scrollbar w-full scrollbar-thin">
      {!issearchstate ? (
        allnotes.length ? (
          allnotes?.map((element) => {
            if (!element) return;
            return (
              <NotesfilesName
                key={element.noteid}
                notename={element.notename}
                noteid={element.noteid}
                isshare={element.isshare}
                access_type={element.access_type} 
              />
            );
          })
        ) : (
          <div className="text-center">No notes</div>
        )
      ) : searchresult.length ? (
        searchresult?.map((element) => {
          if (!element) return;
          return (
            <div className="">
              <NotesfilesName
                key={element.noteid}
                notename={element.notename}
                noteid={element.noteid}
                isshare={element.isshare}
                access_type={element.access_type}
              />
              <div className="border w-full break-words text-sm p-2 h-12 bg-bgnotename">
                {element?.notedescription
                  ? element?.notedescription.substring(0, maxstringLimit)
                  : "No Description"}
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center">No notes</div>
      )}
       {/* {loading && <p>Loading more items...</p>} */}
    </div>
  );
});
export default NotesSection;
