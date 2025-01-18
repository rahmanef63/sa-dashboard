import { Button } from "shared/components/ui/button";
import { PlusCircle } from "lucide-react";

export const PostHeader = () => {
  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between mb-6">
      <h2 className="text-xl font-bold">Post Manager</h2>
      <Button className="bg-primary hover:bg-primary/90">
        <PlusCircle className="mr-2 h-4 w-4" />
        New Post
      </Button>
    </div>
  );
};