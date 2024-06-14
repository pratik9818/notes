import { useSetRecoilState } from "recoil"
import { showtaskstructure } from "../store/notes"
export default function CancelBtn() {
  const setHidetaskstr = useSetRecoilState(showtaskstructure)
  function hidetaskStr(){
    setHidetaskstr(false)
  }
  return <button onClick={hidetaskStr} className="border-2 rounded-md text-sm p-1 px-2">Cancel</button>
}
