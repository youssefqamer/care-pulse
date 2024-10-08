import React from 'react'
import { E164Number } from "libphonenumber-js/core";
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control, useForm } from "react-hook-form"
import { FormFiledType } from './forms/PatientFrom'
import Image from 'next/image'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Select, SelectContent, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
interface ICustomProps{
    control: Control<any>,
    fieldType:FormFiledType,
    name:string,
    label?:string,
    placeholder?:string,
    iconSrc?:string,
    iconAlt?:string,
    disabled?:boolean,
    dateFormat?:string,
    showTimeSelect?:boolean,
    children?:React.ReactNode,
    renderSkeleton?:(filed:any)=>React.ReactNode,
}
const RenderField=({field,props}:{field:any,props:ICustomProps})=>{
const {fieldType,iconAlt,iconSrc,placeholder,showTimeSelect,dateFormat,renderSkeleton}=props
    switch (fieldType) {
        case FormFiledType.INPUT:
            return <div className='flex rounded-md border border-dark-500 bg-dark-400 '>
                {iconSrc&&(
                    <Image src={iconSrc} alt={iconAlt||'icon'} height={24} width={24}  className='ml-2'/>
                )}
                <FormControl>
                    <Input placeholder={placeholder} {...field} className='shad-input border-0'/>
                </FormControl>
            </div>
    case FormFiledType.PHONE_INPUT:
        return (
            <FormControl>
                <PhoneInput 
                       defaultCountry="EG"
                 placeholder={placeholder}
                 international
                 withCountryCallingCode
                 value={field.value as E164Number | undefined} className='input-phone'
                 onChange={field.onChange}
                 />
            </FormControl>
        )

        case FormFiledType.SELECT:
  
  return (
    <FormControl>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger className="shad-select-trigger">
            <SelectValue placeholder={props.placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent className="shad-select-content">
          {props.children}
        </SelectContent>
      </Select>
    </FormControl>
  );
     case FormFiledType.TEXTAREA:
        return(
            <FormControl>
                <Textarea placeholder={placeholder} {...field} className='shad-textArea' disabled={props.disabled}>

                </Textarea>
            </FormControl>
        )
        case FormFiledType.DATE_PICKER:
            return(
                <div className='flex rounded-md border border-dark-500 bg-dark-400'>
                    <Image src='/assets/icons/calendar.svg' alt='calender'
                    height={24} width={24} className='ml-2' 
                    />
               <FormControl>
               <DatePicker 
               selected={field.value}
                onChange={(date) => field.onChange(date)}
                 dateFormat={dateFormat??'dd/MM/yyyy'}
                  showTimeSelect={showTimeSelect??false} 
                  timeInputLabel='Time'
                  wrapperClassName='date-picker'
                  placeholderText='Select your date of birth'
                  />
               </FormControl>
                </div>
            )
        case FormFiledType.CHECKBOX:
            return(
                <FormControl >
               <div className='flex items-center gap-4'>
               <Checkbox 
  id={props.name} 
  checked={field.value} 
  onCheckedChange={field.onChange} 
  className={field.value ? 'checked-checkbox' : ''}
/>
                <label htmlFor={props.name} className='checkbox-label'>{props.label}</label>
               </div>
                </FormControl>
            )
            case FormFiledType.SKELETON:
                return renderSkeleton?renderSkeleton(field):null
        default:
            break;
    }
}
const CustomFormFields = (props:ICustomProps) => {
    const {control,fieldType,name,label}=props
  return (
    <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className='flex-1'>
        {fieldType!==FormFiledType.CHECKBOX&&label&&(
            <FormLabel>
                {label}
            </FormLabel>
        )}
        <RenderField field={field} props={props}/>
        <FormMessage className='shad-error'/>
      </FormItem>
    )}
  />
  )
}

export default CustomFormFields