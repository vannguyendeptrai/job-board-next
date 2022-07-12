import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession, getSession } from 'next-auth/react'
import Link from 'next/link'

import { getJob, alreadyApplied } from 'lib/data'
import prisma from 'lib/prisma'

export default function Apply({ job, applied }) {
  const [coverletter, setCoverletter] = useState('')
  const { data: session } = useSession()
  const router = useRouter()

  if (!session) return null

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()

        await fetch('/api/application', {
          body: JSON.stringify({
            coverletter,
            job: job.id,
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
        <div className='mt-10'>
          <div className='text-center p-4 m-4'>
            <Link href={`/job/${job.id}`}>
              <a href='' className='mb-10 text-sm font-bold underline'>
                back
              </a>
            </Link>
          </div>
          <div className='text-center p-4 m-4'>
            <h2 className='mb-10 text-4xl font-bold'>
              Apply to the job {job.title}
            </h2>
          </div>

          <div className='mb-4 mt-20'>
            <div className='pl-16 pr-16 -mt-6'>
              <p className='text-base font-normal mt-3'>{job.description}</p>
              <div className='mt-4'>
                <h4 className='inline'>Posted by</h4>
                <div className='inline'>
                  <div className='ml-3 -mt-6 inline'>
                    <span>
                      <Link href={`/company/${job.author.id}`}>
                        <a>
                          <span className='text-base font-medium color-primary underline'>
                            {job.author.name}
                          </span>
                        </a>
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=' pt-2 mt-2 mr-1 '>
          <textarea
            className='border p-4 w-full text-lg font-medium bg-transparent outline-none color-primary '
            rows={6}
            cols={50}
            placeholder='Cover letter'
            required
            onChange={(e) => setCoverletter(e.target.value)}
          />
        </div>
        <div>
          {applied ? (
            <div className='mt-20 flex justify-center '>
              <Link href={`/dashboard`}>
                <button className=' border  px-8 py-2 mt-0  font-bold rounded-full bg-black text-white '>
                  You already applied!
                </button>
              </Link>
            </div>
          ) : (
            <div className='mt-20 flex justify-center '>
              <Link href={`/job/${job.id}/apply`}>
                <button className=' border  px-8 py-2 mt-0  font-bold rounded-full bg-black text-white '>
                  Apply to this job
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </form>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  let job = await getJob(context.params.id, prisma)
  job = JSON.parse(JSON.stringify(job))

  const applied = await alreadyApplied(
    session.user.id,
    context.params.id,
    prisma
  )

  return {
    props: {
      job,
      applied,
    },
  }
}