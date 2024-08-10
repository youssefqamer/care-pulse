'use client'
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {Form,} from "@/components/ui/form"
import CustomFormFields from "../CustomFormFields"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { CreateAppointmentSchema, getAppointmentSchema } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from '@/lib/actions/patient.actions'
import { FormFiledType } from './PatientFrom'
import { SelectItem } from '../ui/select'
import { Doctors } from '@/constants'
import Image from 'next/image'
import { careateAppointment, updateAppointment } from './../../lib/actions/appointment.action';
import { Appointment } from '@/types/appwrit.types'
const AppointmentForm = ({userId,patientId,type,appointment,setOpen}:{userId:string,patientId:string,type:'create'|'cancel'|'schedule' ,appointment?:Appointment, setOpen?:(open:boolean)=>void}) => {
    const router =useRouter()
    const [isLoading, setIsLoading] = useState(false)
    // 1. Define your form.
    const AppointmentFormValidation = getAppointmentSchema(type);
    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
      resolver: zodResolver(AppointmentFormValidation),
      defaultValues: {
        primaryPhysician: appointment ? appointment?.primaryPhysician : "",
        schedule: appointment
          ? new Date(appointment?.schedule!)
          : new Date(Date.now()),
        reason: appointment ? appointment.reason : "",
        note: appointment?.note || "",
        cancellationReason: appointment?.cancellationReason || "",
      },
      
    })
   
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
      setIsLoading(true)
      let status;
      switch (type) {
        case 'schedule':
          status='scheduled'
          break;
          case 'cancel':
            status='cancelled'
            break;
        default:
          status='pending'
          break;
       
      }
      try{
      if(type==='create'&&patientId){
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          status: status as Status,
          note: values.note,
        };

        const appointment=await careateAppointment(appointmentData)
        console.log(appointment);
        
        if (appointment) {
          form.reset()
          router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
        }
      }else{
        // we will cancel the appointment
      //   const appointmentToUpdate={
      //     userId,
      //     appointmentId:appointment?.$id!,
      //     appointment:{
      //       primaryPhysician:values?.primaryPhysician,
      //       schedule:new Date(values?.schedule),
      //       status:status as Status,
      //       cancellationReason:values?.cancellationReason
      //     },
      //     type
      //    
      const appointmentToUpdate = {
        userId,
        appointmentId: appointment?.$id!,
        appointment: {
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          status: status as Status,
          cancellationReason: values.cancellationReason,
        },
        type,
      };

      const updatedAppointment = await updateAppointment(appointmentToUpdate);
      if (updatedAppointment) {
        setOpen && setOpen(false);
        form.reset();
      }
    }
      }catch(err){
        console.log(err);
      }
      setIsLoading(false)
    }
    let buttonLabel;
    switch (type) {
      case 'cancel':
        buttonLabel='Cancel appointment';
        break;
    case 'schedule':
      buttonLabel='Schedule appointment';
      break;
     
      default:
        buttonLabel='Create appointment';
        break;
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type==='create'&& <section className="mb-20 space-y-4">
       <h1 className="header">New Appointment</h1>
      <p className="text-dark-700">Request a new appointment in 10 seconds. </p>
</section>}
          {type !== "cancel"&&(
            <>
         <CustomFormFields
              fieldType={FormFiledType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
            >
              {Doctors.map((doctor, i) => (
                <SelectItem key={doctor.name + i} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt="doctor"
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                 
                </SelectItem>
              ))}
            </CustomFormFields>

        <CustomFormFields
        fieldType={FormFiledType.DATE_PICKER}
        control={form.control}
        name='schedule'
        label='Expected appointment'
        showTimeSelect
        dateFormat='dd/MM/yyyy - h:mm aa'
        />
        <div className='flex flex-col gap-6 xl:flex-row'>
        <CustomFormFields
        fieldType={FormFiledType.TEXTAREA}
        control={form.control}
        name='reason'
        label='Reason for appointment'
       placeholder='Enter reason for appointment'
        />
        <CustomFormFields
        fieldType={FormFiledType.TEXTAREA}
        control={form.control}
        name='note'
        label='Notes'
       placeholder='Enter notes'
        />
        </div>
            </>
          )}
       {type==='cancel'&&(
        <CustomFormFields
        fieldType={FormFiledType.TEXTAREA}
        control={form.control}
        name='cancellationReason'
        label='Reason for cancellation'
        placeholder='Enater  reason for cancellation'
        />
       )}
          <SubmitButton isLoading={isLoading} className={`${type==='cancel'?'shad-danger-btn':'shad-primary-btn'} w-full`}>
            {buttonLabel}
          </SubmitButton>
        </form>
        
      </Form>
    )
}

export default AppointmentForm