import React from "react";
import { Input } from "shared/components/ui/input";
import { Textarea } from "shared/components/ui/textarea";
import { PostPlatform } from "../PostPlatform";
import { PostSchedule } from "../PostSchedule";

interface PostEditProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  date?: Date;
  setDate: (date?: Date) => void;
}

export const PostEdit = ({
  title,
  setTitle,
  description,
  setDescription,
  date,
  setDate,
}: PostEditProps) => {
  return (
    <div className="space-y-4 px-1">
      <div className="space-y-3">
        <label htmlFor="title" className="text-sm font-medium block">
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          className="w-full"
        />
      </div>
      <div className="space-y-3">
        <label htmlFor="description" className="text-sm font-medium block">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter post description"
          className="w-full min-h-[100px]"
        />
      </div>

      <div className="space-y-4">
        <PostPlatform
          onPlatformSelect={() => {}}
          onManagerSelect={() => {}}
        />
        <PostSchedule date={date} setDate={setDate} />
      </div>
    </div>
  );
};