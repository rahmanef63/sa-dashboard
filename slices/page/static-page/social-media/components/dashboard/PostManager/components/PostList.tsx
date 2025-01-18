import { Post } from "@/slices/page/dynamic-page/social-media/data/social-manager/PostManager/dummydata";
import { Button } from "shared/components/ui/button";
import { Edit2, Trash2, Image } from "lucide-react";
import { Badge } from "shared/components/ui/badge";
import { EditPostDialog } from "../../post/EditPostDialog";

interface PostListProps {
  posts: Post[];
}

export const PostList = ({ posts }: PostListProps) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 sm:gap-4 p-3 sm:p-4 bg-accent rounded-lg items-start sm:items-center"
        >
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-medium text-sm sm:text-base">{post.title}</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-1">
              {post.content}
            </p>
          </div>
          
          <div className="text-xs sm:text-sm text-gray-500">{post.platform}</div>
          
          <div>
            <span
              className={`inline-block px-2 py-1 rounded-full text-[10px] sm:text-xs ${
                post.status === "published"
                  ? "bg-green-100 text-green-800"
                  : post.status === "scheduled"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {post.status}
            </span>
            {post.scheduledDate && (
              <span className="text-[10px] sm:text-xs text-gray-500 block mt-1">
                Scheduled for: {new Date(post.scheduledDate).toLocaleDateString()}
              </span>
            )}
          </div>

          <div>
            <Badge variant="secondary" className="text-[10px] sm:text-xs">
              {post.contentPillar}
            </Badge>
          </div>

          <div>
            {post.media && post.media.length > 0 && (
              <Button variant="ghost" size="icon" className="hover:bg-accent">
                <Image className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <img
              src={post.responsibleUser?.avatar}
              alt={post.responsibleUser?.name}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
            />
            <span className="text-xs sm:text-sm">{post.responsibleUser?.name}</span>
          </div>

          <div className="flex items-center justify-end space-x-2">
            <EditPostDialog post={post} />
            <Button variant="ghost" size="icon" className="text-destructive">
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};