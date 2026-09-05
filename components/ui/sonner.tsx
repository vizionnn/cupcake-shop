"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import { Check, Info, AlertTriangle, AlertCircle } from "lucide-react"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E85D75] text-white shadow-sm flex-shrink-0">
            <Check className="h-3.5 w-3.5 stroke-[3]" />
          </div>
        ),
        info: (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3B2318] text-white shadow-sm flex-shrink-0">
            <Info className="h-3.5 w-3.5 stroke-[2.5]" />
          </div>
        ),
        warning: (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F2C14E] text-[#3B2318] shadow-sm flex-shrink-0">
            <AlertTriangle className="h-3.5 w-3.5 stroke-[2.5]" />
          </div>
        ),
        error: (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C7415A] text-white shadow-sm flex-shrink-0">
            <AlertCircle className="h-3.5 w-3.5 stroke-[2.5]" />
          </div>
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-[#FFF8F9] dark:!bg-[#24140E] border-2 border-[#E85D75]/35 dark:!border-[#E85D75]/50 shadow-[0_12px_36px_-4px_rgba(232,93,117,0.22),0_4px_12px_rgba(59,35,24,0.06)] dark:!shadow-[0_12px_36px_-4px_rgba(0,0,0,0.6)] rounded-2xl p-4 gap-3 text-foreground",
          title: "!text-[#C7415A] dark:!text-[#FF8FA3] font-bold text-sm tracking-tight",
          description: "!text-[#5C2430] dark:!text-[#DFCDC5] font-semibold text-xs",
          actionButton:
            "!bg-[#E85D75] hover:!bg-[#C7415A] text-white rounded-full font-bold text-xs px-4 py-2 shadow-sm transition-all active:scale-95",
          cancelButton:
            "bg-[#FFF0F3] dark:!bg-[#382017] !text-[#C7415A] dark:!text-[#FF8FA3] rounded-full font-semibold text-xs px-3 py-1.5",
          closeButton:
            "bg-[#FFF0F3] dark:!bg-[#382017] !text-[#C7415A] dark:!text-[#FF8FA3] border-[#E85D75]/30 hover:bg-[#E85D75]/20",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

