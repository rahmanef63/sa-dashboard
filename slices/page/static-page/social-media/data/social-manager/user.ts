export interface User {
  id: string;
  name: string;
  avatar: string;
  role: "admin" | "manager" | "creator";
  email: string;
}

export const users: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    role: "admin",
    email: "sarah@example.com"
  },
  {
    id: "2",
    name: "Mike Chen",
    avatar: "https://i.pravatar.cc/150?u=mike",
    role: "manager",
    email: "mike@example.com"
  },
  {
    id: "3",
    name: "Emma Wilson",
    avatar: "https://i.pravatar.cc/150?u=emma",
    role: "creator",
    email: "emma@example.com"
  },
  {
    id: "4",
    name: "Alex Thompson",
    avatar: "https://i.pravatar.cc/150?u=alex",
    role: "manager",
    email: "alex@example.com"
  },
  {
    id: "5",
    name: "Lisa Park",
    avatar: "https://i.pravatar.cc/150?u=lisa",
    role: "creator",
    email: "lisa@example.com"
  }
];