import RegisterForm from '@/components/forms/RegisterForm'
import { getUser } from '@/lib/actions/patient.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import * as Sentry from '@sentry/nextjs'
const Register = async({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId);
  // used for tracking the number of users that viewed a page.
Sentry.metrics.set("user_view_register", user.name);
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container flex-1 flex-col py-10 ">
    <div className="sub-container max-w-[860px]">
    <Image src='/assets/icons/logo-full.svg' height={1000} width={1000} alt="patient" className="mb-12 h-10 w-fit"/>
    <RegisterForm user={user}/>
    <div className="text-14-regular my-10 pb-10 flex justify-between">
    <p className="justify-items-end text-dark-600 xl:text-left">
    © 2024 CarePulse
    </p>
    </div>
    </div>
      </section>
      <Image src='/assets/images/register-img.png'  height={1000} width={1000} alt="patient" className="side-img max-w-[390px]"/>
    </div>
  )
}

export default Register