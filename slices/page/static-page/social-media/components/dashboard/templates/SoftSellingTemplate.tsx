import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "shared/components/ui/button";
import { Form } from "shared/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared/components/ui/select";
import { Textarea } from "shared/components/ui/textarea";
import { Card } from "shared/components/ui/card";
import { SOFT_SELLING_OPTIONS } from "../../../constants/templates/softSelling";
import type { SoftSellingTemplateData } from "../../../types/templates/softSelling";

interface SoftSellingTemplateProps {
  onContentUpdate: (content: string) => void;
}

export const SoftSellingTemplate: React.FC<SoftSellingTemplateProps> = ({ onContentUpdate }) => {
  const form = useForm<SoftSellingTemplateData>();
  const [selectedOptions, setSelectedOptions] = React.useState<Record<string, string>>({});

  const onSubmit = (data: SoftSellingTemplateData) => {
    console.log("Form submitted:", data);
    onContentUpdate(JSON.stringify(data));
  };

  const handleSelectChange = (value: string, optionValue: keyof SoftSellingTemplateData) => {
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
            {SOFT_SELLING_OPTIONS.map((option) => (
              <div key={option.value} className="space-y-2">
                <label className="text-sm font-medium">{option.label}</label>
                <Select
                  value={selectedOptions[option.value] || ""}
                  onValueChange={(value) => handleSelectChange(value, option.value as keyof SoftSellingTemplateData)}
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
                
                {selectedOptions[option.value] === "custom" && (
                  <Textarea
                    className="min-h-[100px] bg-accent/50 hover:bg-accent/70 transition-colors"
                    placeholder={`Enter your custom ${option.label.toLowerCase()}...`}
                    {...form.register(option.value as keyof SoftSellingTemplateData)}
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
