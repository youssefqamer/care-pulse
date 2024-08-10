'use server'
import { ID, Query } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases, messaging } from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "@/types/appwrit.types";
import { revalidatePath } from "next/cache";

export const careateAppointment=async(appointment:CreateAppointmentParams)=>{
    try{
        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
              appointment,
          );
          return parseStringify(newAppointment);
    }catch(err){
        console.log(err);
        
    }
}
export const getAppointment=async(apointmentId:string)=>{
try{
    const aapointment=await databases.getDocument(
        DATABASE_ID!,
        APPOINTMENT_COLLECTION_ID!,
        apointmentId
    )
    return parseStringify(aapointment)
}catch(err){
    console.log(err);
    
}
}
// export const getRecentAppointmentList=async()=>{
//     try{
//         const appointments=await  databases.listDocuments(
//             DATABASE_ID!,
//             APPOINTMENT_COLLECTION_ID!,
//             [Query.orderDesc("$createdAt")]
//         )
//         const initialCounts={
//             scheduledCount:0,
//             pendingCount:0,
//             cancelledCount:0
//         }
//         const counts = (appointments.documents as Appointment[]).reduce(
//             (acc, appointment) => {
//               switch (appointment.status) {
//                 case "scheduled":
//                   acc.scheduledCount++;
//                   break;
//                 case "pending":
//                   acc.pendingCount++;
//                   break;
//                 case "cancelled":
//                   acc.cancelledCount++;
//                   break;
//               }
//               return acc;
//             },
//             initialCounts
//           );
//           const data={
//             totalCount:appointments.total,
//             ...counts,
//             documents:appointments.documents
//           }
//         return  parseStringify(data)
//     }catch(err){
//         console.log(err);
        
//     }
// }
export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      // [Query.orderDesc("$createdAt")]
      [Query.orderAsc("$createdAt")]
    );
    console.log(appointments.documents.length);
    
    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        switch (appointment.status) {
          case "scheduled":
            acc.scheduledCount++;
            break;
          case "pending":
            acc.pendingCount++;
            break;
          case "cancelled":
            acc.cancelledCount++;
            break;
        }
        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the recent appointments:",
      error
    );
  }
};



// export const updateAppointment=async({appointmentId,userId,appointment,type}:UpdateAppointmentParams)=>{
//   try{
//     const updatedAppointment=await databases.updateDocument(
//       DATABASE_ID!,
//       APPOINTMENT_COLLECTION_ID!,
//       appointmentId,
//       appointment,

//     )
//     if (!updatedAppointment) {
//       throw new Error('Appointment is not found')
//     }
//     revalidatePath('/admin')
//     return parseStringify(updatedAppointment)
//   }catch(err){
//     console.log(err);
    
//   }
// }
export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    // Update appointment to scheduled -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#updateDocument
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment) throw Error;

    const smsMessage = `Greetings from CarePulse. ${type === "schedule" ? `Your appointment is confirmed for ${formatDateTime(appointment.schedule!).dateTime} with Dr. ${appointment.primaryPhysician}` : `We regret to inform that your appointment for ${formatDateTime(appointment.schedule!).dateTime} is cancelled. Reason:  ${appointment.cancellationReason}`}.`;
    await sendSmsNotification(userId, smsMessage);
    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("An error occurred while scheduling an appointment:", error);
  }
};
export const sendSmsNotification=async(userId:string,content:string)=>{
  try{
    const message=await messaging.createSms(
      userId,
      content,
      [],
      [userId],
    )
    return parseStringify(message)
  }catch(err){

  }
}