// Base template option type
export interface TemplateOption {
  label: string;
  value: string;
  presets: string[];
}

// Hard Selling Template
export interface HardSellingTemplateData {
  productName: string;
  uniqueSellingProposition: string;
  callToAction: string;
  keyFeatures: string;
  objectionHandling: string;
}

// Education Template
export interface EducationTemplateData {
  topicTitle: string;
  mainContent: string;
  examples: string;
  keyTakeaways: string;
}

// Emotional Template
export interface EmotionalTemplateData {
  emotionalHook: string;
  personalStory: string;
  emotionalJourney: string;
  inspirationalMessage: string;
}

// Interaction Template
export interface InteractionTemplateData {
  engagementQuestion: string;
  discussionPoints: string;
  callToAction: string;
}