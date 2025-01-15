import React, { useState } from 'react'
import { IconPickerProps } from '../types'
import { iconOptions, getIconByName } from '../utils'
import { Button } from "shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "shared/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/components/ui/select"
import { ScrollArea } from "shared/components/ui/scroll-area"

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const IconComponent = getIconByName(value)

  const handleSelectChange = (newValue: string) => {
    onChange(newValue)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className={`w-full justify-between ${className}`}
        >
          {React.createElement(IconComponent, { className: "mr-2 h-4 w-4" })}
          {value || "Select icon..."}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[360px] sm:w-[425px]">
        <DialogHeader>
          <DialogTitle>Select an icon</DialogTitle>
          <DialogDescription>
            Choose an icon for your menu item
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="rounded-md border p-4 grid grid-cols-6 gap-2">
          {iconOptions.map((option) => (
              <Button
                key={option.name}
                variant="outline"
                className="aspect-square p-0 hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleSelectChange(option.name)}
              >
                {React.createElement(option.icon, { className: "h-4 w-4" })}
                <span className="sr-only">{option.name}</span>
              </Button>
            ))}
        </ScrollArea>
        <Select onValueChange={handleSelectChange} defaultValue={value}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an icon" />
          </SelectTrigger>
          <SelectContent>
            {iconOptions.map((option) => (
              <SelectItem key={option.name} value={option.name}>
                <div className="flex items-center">
                  {React.createElement(option.icon, { className: "mr-2 h-4 w-4" })}
                  {option.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </DialogContent>
    </Dialog>
  )
}
