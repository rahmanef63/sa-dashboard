import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "shared/components/ui/button";
import { Form } from "shared/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared/components/ui/select";
import { Textarea } from "shared/components/ui/textarea";
import { Card } from "shared/components/ui/card";
import { EDUCATION_OPTIONS } from "../../../constants/templates/education";
import type { EducationTemplateData } from "../../../types/templates/education";
import { Wand2, Save } from "lucide-react";

interface EducationTemplateProps {
  onContentUpdate: (content: string) => void;
}

export const EducationTemplate: React.FC<EducationTemplateProps> = ({ onContentUpdate }) => {
  const form = useForm<EducationTemplateData>();
  const [selectedOptions, setSelectedOptions] = React.useState<Partial<Record<keyof EducationTemplateData, string>>>({});
  const [generatedScript, setGeneratedScript] = React.useState("");

  const onSubmit = (data: EducationTemplateData) => {
    console.log("Form submitted:", data);
    onContentUpdate(JSON.stringify(data));
  };

  const handleSelectChange = (value: string, field: keyof EducationTemplateData & string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [field]: value
    }));
    form.setValue(field, value);
    
    // Update parent component whenever selection changes
    const currentFormData = form.getValues();
    const newData = { ...currentFormData, [field]: value };
    onContentUpdate(JSON.stringify(newData));
    
    // Update preview text
    const preview = Object.entries(newData)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    setGeneratedScript(preview);
  };

  const handleGenerateScript = () => {
    // Here you would integrate with an AI service
    // For now, we'll just format the current selections
    const formattedScript = Object.entries(selectedOptions)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    setGeneratedScript(formattedScript);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-4">
          <div className="space-y-4">
            {EDUCATION_OPTIONS.map((option) => (
              <div key={option.value} className="space-y-2">
                <label className="text-sm font-medium">{option.label}</label>
                <Select
                  value={selectedOptions[option.value as keyof EducationTemplateData & string] || ""}
                  onValueChange={(value) => 
                    handleSelectChange(value, option.value as keyof EducationTemplateData & string)
                  }
                >
                  <SelectTrigger className="w-full bg-accent/50 hover:bg-accent/70 transition-colors">
                    <SelectValue placeholder={`Choose ${option.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {option.presets.map((preset, index) => (
                      <SelectItem 
                        key={index} 
                        value={preset}
                        className="hover:bg-accent/50 cursor-pointer"
                      >
                        {preset}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom" className="hover:bg-accent/50 cursor-pointer">
                      Custom Entry
                    </SelectItem>
                  </SelectContent>
                </Select>
                
                {selectedOptions[option.value as keyof EducationTemplateData & string] === "custom" && (
                  <Textarea
                    className="min-h-[100px] bg-accent/50 hover:bg-accent/70 transition-colors"
                    placeholder={`Enter your custom ${option.label.toLowerCase()}...`}
                    {...form.register(option.value as keyof EducationTemplateData & string)}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Generated Script</label>
              <Textarea
                value={generatedScript}
                onChange={(e) => setGeneratedScript(e.target.value)}
                className="min-h-[200px] bg-accent/50 hover:bg-accent/70 transition-colors"
                placeholder="Your generated script will appear here..."
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                onClick={handleGenerateScript}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Script
              </Button>
              <Button type="submit" className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save Script
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </Form>
  );
};