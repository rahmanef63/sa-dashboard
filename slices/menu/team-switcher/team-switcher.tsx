"use client"

import * as React from "react"
import { renderIcon } from "@/shared/icon-picker/utils"
import { Dialog, DialogContent, DialogTrigger } from "shared/components/ui/dialog"
import { Button } from "shared/components/ui/button"
import { Command, CommandGroup, CommandItem, CommandList } from "shared/components/ui/command"
import { Team } from 'shared/types/navigation-types'

type TeamSwitcherProps = {
  teams: Team[]
}

export function TeamSwitcher({ teams }: TeamSwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedTeam, setSelectedTeam] = React.useState<Team>(teams[0])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          {renderIcon(selectedTeam.logo)}
          <span className="truncate">{selectedTeam.name}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {teams.map((team) => (
                <CommandItem
                  key={team.name}
                  onSelect={() => {
                    setSelectedTeam(team)
                    setOpen(false)
                  }}
                  className="gap-2"
                >
                  {renderIcon(team.logo)}
                  <span>{team.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {team.plan}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
