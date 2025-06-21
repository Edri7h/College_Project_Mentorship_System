'use client'

import { useState } from 'react'
import { MoreVertical, LogOut, Bell, CreditCard, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constants'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export default function ProfileCard() {
    const navigate=useNavigate()
  const [open, setOpen] = useState(false)
  const {logStudent}= useSelector(state=>state.student)
  console.log(logStudent);
  const handleLogout=async ()=>{
            try {
                const res =await axios.get(`${USER_API_END_POINT}/logout`,{
                withCredentials:true
            })
            if(res.data.success){
                    toast(res.data.message);
                    navigate("/student/login")

            }else{
                toast(res.data.message)
            }
            } catch (error) {
                toast.error(error?.response?.data?.message)
            }
  }

  return (
    <div className="relative w-fit">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center justify-between gap-4 p-2 bg-muted rounded-md cursor-pointer w-52 shadow">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={logStudent?.profile?.photo} alt="@shadcn" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{logStudent?.profile?.name}</span>
                <span className="text-xs text-muted-foreground">{logStudent?.email}</span>
              </div>
            </div>
            <MoreVertical className="h-5 w-5 text-muted-foreground" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56 mt-2">
          <DropdownMenuLabel>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={logStudent?.profile?.photo} alt="@shadcn" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{logStudent?.profile.name}</p>
                <p className="text-xs text-muted-foreground">{logStudent?.email}</p>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" /> Account
          </DropdownMenuItem>
         
          <DropdownMenuItem>
            <Bell className="mr-2 h-4 w-4" /> Notifications
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleLogout}>
            <LogOut  className="mr-2 h-4 w-4" /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
