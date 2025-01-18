export interface EducationTemplateData {
  topicTitle: string;
  mainContent: string;
  examples: string;
  keyTakeaways: string;
  [key: string]: string; // This ensures all keys are strings
}

export interface TemplateOption {
  label: string;
  value: string;
  presets: string[];
}