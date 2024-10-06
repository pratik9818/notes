import AddNote from './sidebar/AddNote'
export default function DefaultPage() {
  const size = 'w-12 h-12 cursor-pointer'
  return (
    <div className='flex flex-col justify-center items-center w-full'>
      <h3 className='my-4  font-bold'>Add   Note</h3>
      <AddNote size={size}/>
    </div>
  )
}
