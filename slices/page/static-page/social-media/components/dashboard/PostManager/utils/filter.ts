import { Post } from "@/slices/page/dynamic-page/social-media/data/social-manager/PostManager/dummydata";

export const filterPosts = (posts: Post[], filterBy: string, searchQuery: string) => {
  if (filterBy === "none" || !searchQuery) return posts;
  
  return posts.filter(post => {
    switch (filterBy) {
      case "status":
        return post.status.toLowerCase().includes(searchQuery.toLowerCase());
      case "platform":
        return post.platform.toLowerCase().includes(searchQuery.toLowerCase());
      case "title":
        return post.title.toLowerCase().includes(searchQuery.toLowerCase());
      case "date":
        return post.scheduledDate?.includes(searchQuery) || false;
      case "responsible":
        return post.responsibleUser?.name.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      case "contentPillar":
        return post.contentPillar.toLowerCase().includes(searchQuery.toLowerCase());
      default:
        return true;
    }
  });
};