import DeleteBtn from "../DeleteBtn"
import EditBtn from "../EditBtn"

export default function FolderactionModal() {
  return (
    <div className="border-2 h-auto width-auto absolute left-36 flex flex-col px-4 py-2 ">
     <EditBtn/>
     <DeleteBtn/>
    </div>
  )
}
