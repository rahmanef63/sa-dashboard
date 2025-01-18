import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "shared/components/ui/button";
import { Form } from "shared/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared/components/ui/select";
import { Textarea } from "shared/components/ui/textarea";
import { Card } from "shared/components/ui/card";
import { CATALOGUE_OPTIONS } from "../../../constants/templates/catalogue";
import type { CatalogueTemplateData } from "../../../types/templates/catalogue";

interface CatalogueTemplateProps {
  onContentUpdate: (content: string) => void;
}

export const CatalogueTemplate: React.FC<CatalogueTemplateProps> = ({ onContentUpdate }) => {
  const form = useForm<CatalogueTemplateData>();
  const [selectedOptions, setSelectedOptions] = React.useState<Partial<Record<keyof CatalogueTemplateData, string>>>({});

  const onSubmit = (data: CatalogueTemplateData) => {
    console.log("Form submitted:", data);
    // Convert the form data to a string and pass it to the parent
    const contentString = JSON.stringify(data);
    onContentUpdate(contentString);
  };

  const handleSelectChange = (value: string, optionValue: keyof CatalogueTemplateData) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionValue]: value
    }));
    form.setValue(optionValue, value);
    
    // Update parent component whenever selection changes
    const currentFormData = form.getValues();
    onContentUpdate(JSON.stringify({ ...currentFormData, [optionValue]: value }));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-4">
          <div className="space-y-4">
            {CATALOGUE_OPTIONS.map((option) => (
              <div key={option.value} className="space-y-2">
                <label className="text-sm font-medium">{option.label}</label>
                <Select
                  value={selectedOptions[option.value as keyof CatalogueTemplateData] || ""}
                  onValueChange={(value) => handleSelectChange(value, option.value as keyof CatalogueTemplateData)}
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
                
                {selectedOptions[option.value as keyof CatalogueTemplateData] === "custom" && (
                  <Textarea
                    className="min-h-[100px] bg-accent/50 hover:bg-accent/70 transition-colors"
                    placeholder={`Enter your custom ${option.label.toLowerCase()}...`}
                    {...form.register(option.value as keyof CatalogueTemplateData)}
                    onChange={(e) => {
                      form.register(option.value as keyof CatalogueTemplateData).onChange(e);
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