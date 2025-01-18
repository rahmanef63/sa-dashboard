import React from "react";
import { Card, CardContent } from "shared/components/ui/card";
import { Button } from "shared/components/ui/button";
import { Calendar } from "shared/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "shared/lib/utils";
import { Calendar as CalendarIcon, Send, Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "shared/components/ui/popover";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "shared/components/ui/hover-card";
import { Separator } from "shared/components/ui/separator";
import { CalendarView } from "../../../components/calendar/CalendarView";

interface PostScheduleProps {
  date?: Date;
  setDate: (date?: Date) => void;
}

export const PostSchedule: React.FC<PostScheduleProps> = ({ date, setDate }) => {
  return (
    <Card className="border border-border/50">
      <CardContent className="pt-6 px-2 sm:px-4 md:px-6">
        <div className="space-y-4">
          <HoverCard>
            <HoverCardTrigger asChild>
              <label className="text-sm font-medium mb-2 block cursor-help">
                Schedule Post
              </label>
            </HoverCardTrigger>
            <HoverCardContent className="text-sm">
              Pick a date to schedule your post
            </HoverCardContent>
          </HoverCard>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-6">
          <Button variant="outline" className="gap-2 w-full sm:w-auto">
            <Clock className="w-4 h-4" />
            Save as Draft
          </Button>
          <Button className="gap-2 w-full sm:w-auto">
            <Send className="w-4 h-4" />
            Schedule Post
          </Button>
        </div>
        
        <Separator className="my-6" />
        
        <div className="mt-6">
          <CalendarView />
        </div>
      </CardContent>
    </Card>
  );
};