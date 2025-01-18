import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "shared/components/ui/button";
import { Form } from "shared/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared/components/ui/select";
import { Textarea } from "shared/components/ui/textarea";
import { Card } from "shared/components/ui/card";
import { INTERACTION_OPTIONS } from "../../../constants/templates";
import type { InteractionTemplateData } from "../../../types/templates";

interface InteractionTemplateProps {
  onContentUpdate: (content: string) => void;
}

export const InteractionTemplate: React.FC<InteractionTemplateProps> = ({ onContentUpdate }) => {
  const form = useForm<InteractionTemplateData>();
  const [selectedOptions, setSelectedOptions] = React.useState<Record<string, string>>({});

  const onSubmit = (data: InteractionTemplateData) => {
    console.log("Form submitted:", data);
    onContentUpdate(JSON.stringify(data));
  };

  const handleSelectChange = (value: string, optionValue: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionValue]: value
    }));
    form.setValue(optionValue as keyof InteractionTemplateData, value);
    
    // Update parent component whenever selection changes
    const currentFormData = form.getValues();
    onContentUpdate(JSON.stringify({ ...currentFormData, [optionValue]: value }));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-4">
          <div className="space-y-4">
            {INTERACTION_OPTIONS.map((option) => (
              <div key={option.value} className="space-y-2">
                <label className="text-sm font-medium">{option.label}</label>
                <Select
                  value={selectedOptions[option.value] || ""}
                  onValueChange={(value) => handleSelectChange(value, option.value)}
                >
                  <SelectTrigger className="w-full bg-accent/50 hover:bg-accent/70 transition-colors">
                    <SelectValue placeholder={`Choose ${option.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {option.presets.map((preset: string, index: number) => (
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
                
                {selectedOptions[option.value] === "custom" && (
                  <Textarea
                    className="min-h-[100px] bg-accent/50 hover:bg-accent/70 transition-colors"
                    placeholder={`Enter your custom ${option.label.toLowerCase()}...`}
                    {...form.register(option.value as keyof InteractionTemplateData)}
                    onChange={(e) => {
                      form.register(option.value as keyof InteractionTemplateData).onChange(e);
                      const currentFormData = form.getValues();
                      onContentUpdate(JSON.stringify({ ...currentFormData, [option.value]: e.target.value }));
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          <Button type="submit" className="w-full mt-4">Save Template</Button>
        </Card>
      </form>
    </Form>
  );
};