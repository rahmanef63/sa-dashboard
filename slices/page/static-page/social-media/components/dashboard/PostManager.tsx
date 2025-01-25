import { Card } from "shared/components/ui/card";
import { useState } from "react";
import { PostHeader } from "./PostManager/components/PostHeader";
import { PostFilter } from "./PostManager/components/PostFilter";
import { PostList } from "./PostManager/components/PostList";
import { sortPosts } from "./PostManager/utils/sort";
import { filterPosts } from "./PostManager/utils/filter";
import { Post } from "slices/page/dynamic-page/social-media/data/social-manager/PostManager/dummydata";

export const PostManager = () => {
  const [sortField, setSortField] = useState<keyof Post>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterBy, setFilterBy] = useState<string>("none");
  const [searchQuery, setSearchQuery] = useState("");

  const posts: Post[] = [
    {
      id: "1",
      title: "New Product Launch",
      description: "Launching our latest product line",
      content: "Excited to announce our latest product...",
      platform: "linkedin",
      status: "draft",
      contentPillar: "Product",
      media: [{ url: "https://picsum.photos/200/200?random=1", type: "image" }],
      responsibleUser: {
        name: "Sarah Johnson",
        avatar: "https://i.pravatar.cc/150?u=sarah",
      },
      engagement: {
        likes: 245,
        comments: 32,
        shares: 15
      },
      tags: ["product", "launch", "innovation"]
    },
    {
      id: "2",
      title: "Customer Success Story",
      description: "Featuring our top client success",
      content: "Hear what our customers have to say...",
      platform: "x",
      status: "scheduled",
      contentPillar: "Social Proof",
      scheduledDate: "2024-02-25",
      media: [{ url: "https://picsum.photos/200/200?random=2", type: "image" }],
      responsibleUser: {
        name: "Mike Chen",
        avatar: "https://i.pravatar.cc/150?u=mike",
      },
      engagement: {
        likes: 189,
        comments: 24,
        shares: 12
      },
      tags: ["success", "testimonial"]
    },
    {
      id: "3",
      title: "Team Spotlight",
      description: "Highlighting our amazing team",
      content: "Meet the amazing people behind our success...",
      platform: "instagram",
      status: "published",
      contentPillar: "Personal Branding",
      media: [{ url: "https://picsum.photos/200/200?random=3", type: "image" }],
      responsibleUser: {
        name: "Emma Wilson",
        avatar: "https://i.pravatar.cc/150?u=emma",
      },
      engagement: {
        likes: 567,
        comments: 45,
        shares: 23
      },
      tags: ["team", "culture", "behindthescenes"]
    },
    {
      id: "4",
      title: "Industry Insights",
      description: "Latest trends in our industry",
      content: "Latest trends and analysis in our industry...",
      platform: "linkedin",
      status: "draft",
      contentPillar: "Education",
      media: [{ url: "https://picsum.photos/200/200?random=4", type: "image" }],
      responsibleUser: {
        name: "Alex Thompson",
        avatar: "https://i.pravatar.cc/150?u=alex",
      },
      engagement: {
        likes: 312,
        comments: 28,
        shares: 19
      },
      tags: ["industry", "trends", "education"]
    },
    {
      id: "5",
      title: "Behind the Scenes",
      description: "A day in our office",
      content: "Take a peek at our company culture...",
      platform: "instagram",
      status: "scheduled",
      contentPillar: "Story Telling",
      scheduledDate: "2024-03-01",
      media: [{ url: "https://picsum.photos/200/200?random=5", type: "image" }],
      responsibleUser: {
        name: "Lisa Park",
        avatar: "https://i.pravatar.cc/150?u=lisa",
      },
      engagement: {
        likes: 423,
        comments: 37,
        shares: 8
      },
      tags: ["culture", "office", "behindthescenes"]
    }
  ];

  const filteredAndSortedPosts = filterPosts(
    sortPosts(posts, sortField, sortDirection),
    filterBy,
    searchQuery
  );

  return (
    <Card className="p-6">
      <PostHeader />
      <PostFilter
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <PostList posts={filteredAndSortedPosts} />
    </Card>
  );
};