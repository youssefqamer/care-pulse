"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {Form,} from "@/components/ui/form"
import CustomFormFields from "../CustomFormFields"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { userFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"
export enum FormFiledType{
    INPUT='input',
    TEXTAREA='textarea',
    CHECKBOX='checkbox',
    PHONE_INPUT='phoneInput',
    DATE_PICKER='datePicker',
    SELECT='select',
    SKELETON='skeleton',
  }
const PatientFrom=()=> {
  const router =useRouter()
  const [isLoading, setIsLoading] = useState(false)
  // 1. Define your form.
  const form = useForm<z.infer<typeof userFormValidation>>({
    resolver: zodResolver(userFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit({name,email,phone}: z.infer<typeof userFormValidation>) {
    setIsLoading(true)
    try{
      const userData ={name,email,phone}
      const user =await createUser(userData)
      if(user){
        router.push(`/patients/${user.$id}/register`);
      }
    }catch(err){
      console.log(err);
    }
    setIsLoading(false)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-20 space-y-4">
        <h1 className="header">Hi there 👋</h1>
        <p className="text-dark-700">Schedule your first appointment. </p>
        </section>
        <CustomFormFields control={form.control} fieldType={FormFiledType.INPUT}
        name='name'
        label='Full name'
        placeholder='John Deo'
        iconSrc='/assets/icons/user.svg'
        iconAlt='user'
        />
        <CustomFormFields control={form.control} fieldType={FormFiledType.INPUT}
        name='email'
        label='Email'
        placeholder='John Deo@gmail.com'
        iconSrc='/assets/icons/email.svg'
        iconAlt='email'
        />
        <CustomFormFields control={form.control} fieldType={FormFiledType.PHONE_INPUT}
        name='phone'
        label='Phone number'
        placeholder='(+20) 12765984686'
        iconSrc='/assets/icons/email.svg'
        />
        <SubmitButton isLoading={isLoading}>
          Get Started
        </SubmitButton>
      </form>
    </Form>
  )
}

export default PatientFrom