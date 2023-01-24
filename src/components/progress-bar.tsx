export const ProgressBar = (props: { value: number; max: number; label: string; id: string }) => {
  return (
    <div class='flex items-center'>
      <label for={props.id} class='mr-4'>
        {props.label}
      </label>
      <progress id={props.id} value={props.value} max={props.max} class='rounded-lg shadow' />
    </div>
  )
}

// export const ProgressBar = (props: { value: number; max: number; label: string; id: string }) => {
//   return (
//     <>
//       <div class='mb-1 flex justify-between'>
//         <span class='text-base font-medium text-slate-700'>{props.label}</span>
//         <span class='text-sm font-medium text-slate-700'>{props.value}%</span>
//       </div>
//       <div class='h-2.5 w-full rounded-full bg-gray-300'>
//         <div
//           class='h-2.5 rounded-full bg-blue-500'
//           style={{ width: `${props.value}%`, transition: 'all .2s ease-in' }}
//         ></div>
//       </div>
//     </>
//   )
// }
