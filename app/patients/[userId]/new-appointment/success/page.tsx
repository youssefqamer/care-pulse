import { Button } from '@/components/ui/button'
import { Doctors } from '@/constants'
import { getAppointment } from '@/lib/actions/appointment.action'
import { formatDateTime } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import * as Sentry from '@sentry/nextjs'
import { getUser } from '@/lib/actions/patient.actions'

const Success =async ({params:{userId},searchParams}:SearchParamProps) => {
    const appointmentId=(searchParams?.appointmentId as string)||''
    const appointment=await getAppointment(appointmentId)
    const user = await getUser(userId);

  // used for tracking the number of users that viewed a page.
Sentry.metrics.set("user_view_appointment_success", user.name);

    // we get the doctor to display its image
    const doctor=Doctors.find((doctor)=>doctor.name===appointment.primaryPhysician)
  return (
    <div className='flex h-screen max-h-screen px-[5%]'>
        <div className="success-img">
            <Link href='/'>
        <Image
        src='/assets/icons/logo-full.svg'
        alt='logo'
        height={1000}
        width={1000}
        className='h-10 w-fit'
        />
            </Link>
            <section className='flex flex-col items-center mb-4'>
            <Image src='/assets/gifs/success.gif' alt='success icon' width={280}
            height={300}
            />
            <h2 className='header mb-6 max-w-[600px] text-center'>
       Your <span className='text-green-500'>appointment request</span> has been successfully submitted!
            </h2>
            <p>We&lsquo;ll be in touch shortly to confirm.</p>
            </section>
            <section className='request-details'>
        <p>Requested appointment details:</p>
        <div className='flex items-center gap-3'>
        <Image
        src={doctor?.image!}
        alt='doctor'
        width={100}
        height={100}
        className='size-6'
        />
        <p className='whitespace-nowrap'>Dr, {doctor?.name}</p>
        <div className='flex gap-2'>
        <Image
        src='/assets/icons/calendar.svg'
        alt='calendar'
        width={24}
        height={24}
        />
        <p>{formatDateTime(appointment.schedule).dateTime}</p>
        </div>
        </div>  
            </section>
            <Button variant='outline' className='shad-primary-btn' asChild>
                <Link href={`/patients/${userId}/new-appointment`}>
                New Appointment
                </Link>
            </Button>
            <p className='copyright'> © 2024 CarePulse</p>
        </div>
    </div>
  )
}

export default Success