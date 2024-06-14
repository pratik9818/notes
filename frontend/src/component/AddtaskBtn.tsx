import { useRecoilState } from "recoil"
import { taskdetails } from "../store/notes"
import { taskdetailtypo } from "../typo/taskdetailtype";
import { useEffect } from "react";
export default function AddtaskBtn({detailstates}:{detailstates:taskdetailtypo}) {
  const [taskdetailsarray,setTaskdetailsarray] = useRecoilState(taskdetails)
  // useEffect(() => {
  //   console.log(taskdetailsarray);
  // }, [taskdetailsarray]);
  function test(){
    setTaskdetailsarray([...taskdetailsarray,detailstates]) 
  }
  return <button onClick={test} className="border-2 rounded-md text-sm p-1 px-2">Add Task</button>
}
