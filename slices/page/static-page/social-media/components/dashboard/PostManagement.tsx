import { PostCreator } from "./PostCreator";
import { PostManager } from "./PostManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "shared/components/ui/tabs";

const PostManagement = () => {
  return (
    <div className="w-full space-y-6">
      <Tabs defaultValue="manage" className="w-full">
        <TabsList>
          <TabsTrigger value="manage">Manage Posts</TabsTrigger>
          <TabsTrigger value="create">Create Post</TabsTrigger>
        </TabsList>
        <TabsContent value="manage">
          <PostManager />
        </TabsContent>
        <TabsContent value="create">
          <PostCreator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PostManagement;