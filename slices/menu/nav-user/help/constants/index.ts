import {  Book, MessageCircle, FileText } from "lucide-react";


export const HELP_CATEGORIES = [
  'Getting Started',
  'Account & Security',
  'Privacy',
  'Billing',
  'Technical Support'
] as const

export const FAQ_ITEMS = [
  {
    question: 'How do I reset my password?',
    answer: 'You can reset your password by clicking the "Forgot Password" link on the login page.'
  },
  {
    question: 'How do I change my email?',
    answer: 'You can change your email in the Account Settings section.'
  }
] as const


export const faqItems = [
  {
    question: "How do I change my password?",
    answer: "Go to Settings > Security to change your password."
  },
  {
    question: "Where can I find my team settings?",
    answer: "Team settings are available in the Team Switcher dropdown at the top of the sidebar."
  },
  {
    question: "How do I invite team members?",
    answer: "You can invite team members from the Team Management section in your dashboard."
  }
];

export const guides = [
  {
    title: "Getting Started",
    description: "Learn the basics of using the platform",
    icon: Book
  },
  {
    title: "Team Collaboration",
    description: "Best practices for working with your team",
    icon: MessageCircle
  },
  {
    title: "Documentation",
    description: "Detailed technical documentation",
    icon: FileText
  }
];