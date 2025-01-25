import React from "react";
import { Badge } from "shared/components/ui/badge";
import type { Post } from "slices/page/dynamic-page/social-media/data/social-manager/PostManager/dummydata";

interface PostDetailsProps {
  post?: Post;
}

export const PostDetails = ({ post }: PostDetailsProps) => {
  if (!post) return null;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium">Title</h3>
        <p className="text-sm text-muted-foreground">{post.title}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium">Description</h3>
        <p className="text-sm text-muted-foreground">{post.description}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium">Content</h3>
        <p className="text-sm text-muted-foreground">{post.content}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium">Platform</h3>
        <p className="text-sm text-muted-foreground">{post.platform}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium">Status</h3>
        <p className="text-sm text-muted-foreground">{post.status}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium">Content Pillar</h3>
        <p className="text-sm text-muted-foreground">{post.contentPillar}</p>
      </div>
      {post.engagement && (
        <div>
          <h3 className="text-sm font-medium">Engagement</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
            <div>
              <p className="text-sm text-muted-foreground">
                Likes: {post.engagement.likes}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Comments: {post.engagement.comments}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Shares: {post.engagement.shares}
              </p>
            </div>
          </div>
        </div>
      )}
      {post.tags && (
        <div>
          <h3 className="text-sm font-medium">Tags</h3>
          <div className="flex flex-wrap gap-2 mt-1">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};