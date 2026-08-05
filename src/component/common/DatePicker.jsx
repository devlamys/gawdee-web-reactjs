/* Developed by Grafizen International PVT. LTD. */
"use client"

import React from "react"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/component/common/ui/button"
import { Calendar } from "@/component/common/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/component/common/ui/popover"

export default function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className = "",
  disabled = false,
}) {
  const isValidDate =
    value instanceof Date && !isNaN(value)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          data-empty={!isValidDate}
          className={` w-[100%] border border-gray-300 rounded-xl px-4 py-3 h-[55px] text-[15px] font-[400] cursor-pointer flex justify-between items-center ${className}`}
        >
          {isValidDate ? format(value, "PPP") : <span>{placeholder}</span>}
          <ChevronDownIcon className="ml-2 h-4 w-4 opacity-70" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={isValidDate ? value : undefined}
          onSelect={(date) => {
            if (date instanceof Date && !isNaN(date)) {
              onChange(date)
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}