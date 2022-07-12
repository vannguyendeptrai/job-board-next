import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function New() {
  const [description, setDescription] = useState('')
  const [title, setTitle] = useState('')
  const [salary, setSalary] = useState('')
  const [location, setLocation] = useState('')
  const { data: session } = useSession()
  const router = useRouter()

  if (!session || !session.user) return null

  return (
    <form onSubmit={async (e) => {
        e.preventDefault()

        await fetch('/api/job', {
          body: JSON.stringify({
            title,
            description,
            location,
            salary,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        })

        router.push('/dashboard')
      }}
    >
      <div className='flex flex-col w-1/2 mx-auto'>
        <h2 className='mt-10 mb-10 text-4xl font-bold'>Post a new job!</h2>
        <div className=' pt-2 mt-2 mr-1'>
          <input
            className='border p-4 w-full text-lg font-medium bg-transparent outline-none color-primary '
            placeholder='Job title'
						required
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className=' pt-2 mt-2 mr-1 '>
          <textarea
            className='border p-4 w-full text-lg font-medium bg-transparent outline-none color-primary '
            rows={2}
            cols={50}
            placeholder='Job description'
						required
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className=' pt-2 mt-2 mr-1'>
          <input
            className='border p-4 w-full text-lg font-medium bg-transparent outline-none color-primary '
            placeholder='Salary'
						required
            onChange={(e) => setSalary(e.target.value)}
          />
        </div>
        <div className=' pt-2 mt-2 mr-1'>
          <input
            className='border p-4 w-full text-lg font-medium bg-transparent outline-none color-primary '
            placeholder='Location'
						required
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className='mt-5'>
          <button className='border float-right px-8 py-2 mt-0  font-bold rounded-full'>
            Post job
          </button>
        </div>
      </div>
    </form>
  )
}