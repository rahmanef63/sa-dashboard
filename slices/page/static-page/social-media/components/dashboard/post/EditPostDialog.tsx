import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "shared/components/ui/dialog";
import { Button } from "shared/components/ui/button";
import { Edit2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "shared/components/ui/tabs";
import { Badge } from "shared/components/ui/badge";
import type { Post } from "slices/page/dynamic-page/social-media/data/social-manager/PostManager/dummydata";
import { PostDetails } from "./tabs/PostDetails";
import { PostEdit } from "./tabs/PostEdit";

interface EditPostDialogProps {
  post?: Post;
  mode?: 'edit' | 'create';
}

export const EditPostDialog = ({ post, mode = 'edit' }: EditPostDialogProps) => {
  const [date, setDate] = React.useState<Date>();
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(post?.title || "");
  const [description, setDescription] = useState(post?.description || "");

  const isCreateMode = mode === 'create';

  useEffect(() => {
    if (!open) {
      setIsEditing(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh] md:h-[80vh] p-4 md:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{isCreateMode ? 'Create Post' : 'Edit Post'}</span>
            {post?.status && (
              <Badge variant="secondary" className="text-xs">
                {post.status}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6 h-full overflow-hidden">
          <div className="col-span-1 lg:col-span-3 bg-accent rounded-lg overflow-hidden">
            <div className="aspect-square relative bg-muted">
              {post?.media && post.media.length > 0 && (
                <img
                  src={post.media[0].url}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          <div className="col-span-1 lg:col-span-2 overflow-y-auto">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-0">
                <PostDetails post={post} />
              </TabsContent>

              <TabsContent value="edit" className="mt-0">
                <PostEdit
                  title={title}
                  setTitle={setTitle}
                  description={description}
                  setDescription={setDescription}
                  date={date}
                  setDate={setDate}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};