"use client"

import { ColumnDef } from "@tanstack/react-table"
import StatusBadge from "../StatusBadge"
import { formatDateTime } from "@/lib/utils"
import { Doctors } from "@/constants"
import Image from 'next/image';
import AppointmentModal from "../AppointmentModal"
import { Appointment } from "@/types/appwrit.types"
export const columns: ColumnDef<Appointment>[] = [
    {
    header:'ID',
    cell:({row})=><p className="text-14-medium">{row.index+1}</p>
    },
    {
      // the accessor key is coming form the ColumnDef<Appointment>
      accessorKey:"patient",
      header:"Patient",
      cell: ({ row }) => {
        const appointment = row.original;
        
        return <p className="text-14-medium text-white">{appointment?.patient?.name}</p>;
      },
    },

   
  {
    accessorKey: "status",
    header: "Status",
    cell:({row})=>(
        <div className="min-w-[115px]">
          
            <StatusBadge status={row.original.status}/>
        </div>
    )
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <p className="text-14-regular min-w-[100px]">
          {formatDateTime(appointment.schedule).dateTime}
        </p>
      );
    },
  },
  {
    accessorKey: "primaryPhysician",
    header:"Doctors",
    cell: ({ row }) => {
        const doctor=Doctors.find((doc)=>doc.name===row.original.primaryPhysician)
        return(
            <div className="flex items-center gap-3">
                <Image
                src={doctor?.image!}
                alt={doctor?.name!}
                width={100}
                height={100}
                className="size-8"
                />
                
                <p className="whitespace-nowrap ">Dr. {doctor?.name}</p>
            </div>
        )
    },
  },
  {
    id: "actions",
    header:()=><div className="pl-4">Actions</div>,
    cell: ({ row }) => {
        const appointment = row.original;
  
        return (
          <div className="flex gap-1">
            <AppointmentModal
              patientId={appointment?.patient?.$id}
              userId={appointment?.userId}
              appointmentId={appointment}
              type="schedule"
              title="Schedule Appointment"
              description="Please confirm the following details to schedule."
            />
            <AppointmentModal
                  patientId={appointment?.patient?.$id}
                  userId={appointment?.userId}
                  appointmentId={appointment}
              type="cancel"
              title="Cancel Appointment"
              description="Are you sure you want to cancel your appointment?"
            />
          </div>
        );
      },
  },
]
