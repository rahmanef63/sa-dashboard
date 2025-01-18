import { TemplateOption } from "@/types/templates";

export const HARD_SELLING_OPTIONS = {
  productName: [
    "Premium Package",
    "Essential Kit",
    "Pro Bundle",
    "Custom Product"
  ],
  uniqueSellingProposition: [
    "Time-saving solution",
    "Cost-effective choice",
    "All-in-one package",
    "Custom proposition"
  ],
  callToAction: [
    "Limited time offer",
    "Exclusive deal",
    "Early bird special",
    "Custom CTA"
  ],
  keyFeatures: [
    "Core features package",
    "Premium features set",
    "Complete solution bundle",
    "Custom features"
  ],
  objectionHandling: [
    "Price justification",
    "Value demonstration",
    "ROI explanation",
    "Custom handling"
  ]
};

export const EDUCATION_OPTIONS: TemplateOption[] = [
  {
    label: "Topic Introduction",
    value: "topicTitle",
    presets: [
      "Beginner's Guide to...",
      "Understanding the Basics of...",
      "Introduction to...",
    ]
  },
  {
    label: "Main Content",
    value: "mainContent",
    presets: [
      "Step-by-step tutorial",
      "Comprehensive overview",
      "Detailed explanation",
    ]
  },
  {
    label: "Examples",
    value: "examples",
    presets: [
      "Real-world application",
      "Case study",
      "Practical demonstration",
    ]
  },
  {
    label: "Key Takeaways",
    value: "keyTakeaways",
    presets: [
      "Summary of main points",
      "Action items",
      "Learning outcomes",
    ]
  }
];

export const EMOTIONAL_OPTIONS: TemplateOption[] = [
  {
    label: "Emotional Hook",
    value: "emotionalHook",
    presets: [
      "Personal challenge overcome",
      "Inspiring moment",
      "Life-changing experience",
    ]
  },
  {
    label: "Personal Story",
    value: "personalStory",
    presets: [
      "Journey narrative",
      "Transformation story",
      "Success story",
    ]
  },
  {
    label: "Emotional Journey",
    value: "emotionalJourney",
    presets: [
      "Growth process",
      "Challenge and triumph",
      "Learning experience",
    ]
  },
  {
    label: "Inspirational Message",
    value: "inspirationalMessage",
    presets: [
      "Motivational conclusion",
      "Call to action",
      "Empowering message",
    ]
  }
];

export const INTERACTION_OPTIONS: TemplateOption[] = [
  {
    label: "Engagement Question",
    value: "engagementQuestion",
    presets: [
      "What's your experience with...?",
      "How do you handle...?",
      "Share your thoughts on...",
    ]
  },
  {
    label: "Discussion Points",
    value: "discussionPoints",
    presets: [
      "Key discussion topics",
      "Debate points",
      "Conversation starters",
    ]
  },
  {
    label: "Call to Action",
    value: "callToAction",
    presets: [
      "Join the conversation",
      "Share your story",
      "Get involved",
    ]
  }
];