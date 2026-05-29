"use client"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SideBarOption } from "@/services/Constants"
import { Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AppSidebar() {
  const path = usePathname()
  console.log(path)

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/mock-interview/dashboard/create-interview">
        <Button className="bg-blue-500 text-white relative items-center top-25">
          <Plus />
          Create New Interview
        </Button>
        </Link>
      </SidebarHeader>

      <SidebarContent className="relative top-30 items-center">
        <SidebarGroup>
          <SidebarContent>
            <SidebarMenu>
              {SideBarOption.map((option, index) => (
                <SidebarMenuItem key={index} className="p-1">
                  <SidebarMenuButton
                    asChild
                    className={`p-5 ${path == option.path && "bg-blue-100"}`}
                  >
                    <Link href={option.path}>
                      <option.icon
                        className={`${path == option.path && "text-blue-700"}`}
                      />
                      <span
                        className={`text-[16px]font-medium ${
                          path == option.path && "text-blue-700"
                        }`}
                      >
                        {option.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  )
}
