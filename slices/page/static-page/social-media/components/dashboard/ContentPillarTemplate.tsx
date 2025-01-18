import React from "react";
import { InteractionTemplate } from "./templates/InteractionTemplate";
import { EducationTemplate } from "./templates/EducationTemplate";
import { EmotionalTemplate } from "./templates/EmotionalTemplate";
import { HardSellingTemplate } from "./templates/HardSellingTemplate";
import { SoftSellingTemplate } from "./templates/SoftSellingTemplate";
import { StoryTellingTemplate } from "./templates/StoryTellingTemplate";
import { SocialProofTemplate } from "./templates/SocialProofTemplate";
import { PersonalBrandingTemplate } from "./templates/PersonalBrandingTemplate";
import { CatalogueTemplate } from "./templates/CatalogueTemplate";
import { KolBriefTemplate } from "./templates/KolBriefTemplate";
import { ProductTemplate } from "./templates/ProductTemplate";
import { TemplateField } from "./templates/shared/TemplateField";

interface TemplateProps {
  pillar: string;
  onContentUpdate: (content: string) => void;
}

// Define a common interface for all template components
interface CommonTemplateProps {
  onContentUpdate: (content: string) => void;
}

export const ContentPillarTemplate: React.FC<TemplateProps> = ({ pillar, onContentUpdate }) => {
  // Basic template for simpler content types
  const BasicTemplate = (fields: { input?: string[]; textarea?: string[] }) => {
    const handleContentUpdate = (value: string) => {
      onContentUpdate(value);
    };

    return (
      <div className="space-y-4">
        {fields.input?.map((placeholder, index) => (
          <TemplateField 
            key={`input-${index}`} 
            type="input" 
            placeholder={placeholder}
            onChange={handleContentUpdate}
          />
        ))}
        {fields.textarea?.map((placeholder, index) => (
          <TemplateField 
            key={`textarea-${index}`} 
            type="textarea" 
            placeholder={placeholder}
            onChange={handleContentUpdate}
          />
        ))}
      </div>
    );
  };

  const templates: Record<string, React.ReactNode> = {
    "Interaksi": <InteractionTemplate onContentUpdate={onContentUpdate} />,
    "Edukasi": <EducationTemplate onContentUpdate={onContentUpdate} />,
    "Emosional": <EmotionalTemplate onContentUpdate={onContentUpdate} />,
    "Hard Selling": <HardSellingTemplate onContentUpdate={onContentUpdate} />,
    "Soft Selling": <SoftSellingTemplate onContentUpdate={onContentUpdate} />,
    "Story Telling": <StoryTellingTemplate onContentUpdate={onContentUpdate} />,
    "Social Proof": <SocialProofTemplate onContentUpdate={onContentUpdate} />,
    "Personal Branding": <PersonalBrandingTemplate onContentUpdate={onContentUpdate} />,
    "Catalogue": <CatalogueTemplate onContentUpdate={onContentUpdate} />,
    "KOL Brief": <KolBriefTemplate onContentUpdate={onContentUpdate} />,
    "Produk": <ProductTemplate onContentUpdate={onContentUpdate} />,
    "Pengumuman": BasicTemplate({
      input: ["Announcement title...", "Important dates..."],
      textarea: ["Announcement details...", "Next steps or actions required..."]
    }),
    "Aset Marketing": BasicTemplate({
      input: ["Asset title...", "Asset type..."],
      textarea: ["Asset description...", "Usage guidelines..."]
    })
  };

  return templates[pillar] || (
    <div className="text-muted-foreground">No template available for this pillar</div>
  );
};