'use client'
import React, { useState } from 'react'
import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle,DialogTrigger} from "@/components/ui/dialog"
import  AppointmentForm  from '@/components/forms/AppointmentForm';
import { Appointment } from '@/types/appwrit.types';
import { Button } from './ui/button';
interface IProps{
    type: "schedule" | "cancel";
    patientId : string,
    appointmentId? : Appointment,
    userId : string,
    title : string,
    description : string,
}
const AppointmentModal = ({type,patientId,appointmentId,userId,title,description}:IProps) => {
    const [open,setOpen]=useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button variant={'ghost'} className={`capitalize text-red-500 ${type==='schedule' &&'text-green-700'}`}>
         {type}
    </Button>
    
  </DialogTrigger>
  <DialogContent className='shad-dialog sm:max-w-md'>
    <DialogHeader className='mb-4 space-y-3'>
      <DialogTitle className='capitalize'>{type} Appointment </DialogTitle>
      <DialogDescription>
        Please fill in the following details to {type} this appointment
      </DialogDescription>
    </DialogHeader>
    <AppointmentForm
    userId={userId}
    type={type}
    patientId={patientId}
    appointment={appointmentId}
    setOpen={setOpen}
    />
  </DialogContent>
</Dialog>

  )
}

export default AppointmentModal