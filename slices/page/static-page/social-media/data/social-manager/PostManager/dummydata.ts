import { Platform, PlatformConfig } from "../platform-list";

export interface Post {
  id: string;
  title: string;
  description: string;
  content: string;
  platform: (PlatformConfig | Platform)[];
  scheduledDate?: string;
  status: "published" | "draft" | "scheduled";
  contentPillar: string;
  media: {
    url: string;
    type: "image" | "video";
  }[];
  responsibleUser: {
    name: string;
    avatar: string;
  };
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
  };
  tags?: string[];
}

export const dummyPosts: Post[] = [
  {
    id: "1",
    title: "New Product Launch",
    description: "Launching our latest product line",
    content: "Excited to announce our latest product line that will revolutionize the industry! #innovation #newproduct",
    platform: ["linkedin"], 
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
    content: "Hear what our customers have to say about their amazing results! #customersuccess",
    platform: ["x", "linkedin"],
    status: "scheduled",
    scheduledDate: "2024-02-25",
    contentPillar: "Social Proof",
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
    content: "Meet the amazing people behind our success! #teamspotlight #culture",
    platform: ["instagram"],
    status: "published",
    scheduledDate: "2024-02-20",
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
    content: "Latest trends and analysis in our industry that you need to know about! #insights #trends",
    platform: ["linkedin"],
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
    content: "Take a peek at our company culture and daily operations! #companyculture",
    platform: ["instagram"],
    status: "scheduled",
    scheduledDate: "2024-03-01",
    contentPillar: "Story Telling",
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
  },
  {
    id: "6",
    title: "Product Feature Spotlight",
    description: "Highlighting key product features",
    content: "Discover the amazing features that make our product stand out! #productfeatures",
    platform: ["linkedin"],
    status: "scheduled",
    scheduledDate: "2024-03-05",
    contentPillar: "Product",
    media: [{ url: "https://picsum.photos/200/200?random=6", type: "image" }],
    responsibleUser: {
      name: "David Kim",
      avatar: "https://i.pravatar.cc/150?u=david",
    },
    engagement: {
      likes: 289,
      comments: 42,
      shares: 16
    },
    tags: ["product", "features", "spotlight"]
  },
  {
    id: "7",
    title: "Industry Event Coverage",
    description: "Live from the annual conference",
    content: "Join us live at the biggest industry event of the year! #conference #live",
    platform: ["x"],
    status: "scheduled",
    scheduledDate: "2024-03-10",
    contentPillar: "Event",
    media: [
      { url: "https://picsum.photos/200/200?random=7", type: "image" },
      { url: "https://picsum.photos/200/200?random=8", type: "video" }
    ],
    responsibleUser: {
      name: "Rachel Green",
      avatar: "https://i.pravatar.cc/150?u=rachel",
    },
    engagement: {
      likes: 156,
      comments: 18,
      shares: 25
    },
    tags: ["event", "conference", "live"]
  }
];