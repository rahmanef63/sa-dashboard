export interface InteractionTemplateData {
  engagementQuestion: string;
  discussionPoints: string;
  callToAction: string;
  [key: string]: string;
}

export interface TemplateOption {
  label: string;
  value: string;
  presets: string[];
}