import { Post } from "@/slices/page/dynamic-page/social-media/data/social-manager/PostManager/dummydata";

export const sortPosts = (posts: Post[], sortField: keyof Post, sortDirection: "asc" | "desc") => {
  return [...posts].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
  });
};