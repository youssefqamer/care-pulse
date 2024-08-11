'use client'
import React, { useEffect, useState } from 'react'
import {AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle} from "@/components/ui/alert-dialog"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
 
import {InputOTP,InputOTPGroup,InputOTPSlot} from "@/components/ui/input-otp"
import { decryptKey, encryptKey } from './../lib/utils';
import { usePathname } from 'next/navigation'

const PassKeyModal = () => {
    const router=useRouter()
    const [open, setOpen] = useState(false)
    const [passKey, setPassKey] = useState('')
    const [error, setError] = useState('')
    const path=usePathname()
    
    const encryptedKey=typeof window !== 'undefined'? localStorage.getItem('accessKey'):'null'
    // check if there is passkey in the storage or not 
    useEffect(()=>{
        const accessKey=encryptedKey&&decryptKey(encryptedKey)
        if (path) {
            
            if (accessKey===process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
                //when the component mount we check if the accesskey after decryption(converted into number) is equall to process.env.NEXT_PUBLIC_ADMIN_PASSKEY it means that the admin don't have to login again so we will not open the otp dialog and will open the admin page 
                setOpen(false)
                router.push('/admin')
            }else{
                setOpen(true)
            }
        }
    },[encryptedKey])
    const closeModal=()=>{
        setOpen(false)
        router.push('/')
    }
    const validatePassKey=(e:React.MouseEvent<HTMLButtonElement,MouseEvent>)=>{
        e.preventDefault();
        if (passKey===process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
            const encryptedKey=encryptKey(passKey)
            // it will transform the passkey from number to string  
            localStorage.setItem('accessKey',encryptedKey)
            setOpen(false)
        }else{
            setError('Invalid passkey , please try again.')
        }
    }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
    <AlertDialogContent className='shad-alert-dialog'>
      <AlertDialogHeader>
        <AlertDialogTitle className='flex items-start justify-between'>Admin Access Verification
            <Image
            src='/assets/icons/close.svg'
            alt='close'
            width={24}
            height={24}
            className='cursor-pointer'
            onClick={()=>closeModal()}
            />
        </AlertDialogTitle>
        <AlertDialogDescription>
        To access the admin page , please enter the passkey
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div>
      <InputOTP maxLength={6}  pattern={REGEXP_ONLY_DIGITS_AND_CHARS} value={passKey} onChange={(value)=>setPassKey(value)}  >
      <InputOTPGroup className='shad-otp'>
        <InputOTPSlot index={0} className='shad-otp-slot' />
        <InputOTPSlot index={1} className='shad-otp-slot'/>
        <InputOTPSlot index={2} className='shad-otp-slot'/>
        <InputOTPSlot index={3} className='shad-otp-slot'/>
        <InputOTPSlot index={4} className='shad-otp-slot'/>
        <InputOTPSlot index={5} className='shad-otp-slot'/>
      </InputOTPGroup>
    </InputOTP>
    {error&&<p className='shad-error text-14-regular mt-4 flex justify-center'>{error}</p>}
      </div>
      <AlertDialogFooter>
        <AlertDialogAction className='shad-primary-btn w-full' onClick={(e)=>validatePassKey(e)}>Enter Admin Passkey</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  
  )
}

export default PassKeyModal