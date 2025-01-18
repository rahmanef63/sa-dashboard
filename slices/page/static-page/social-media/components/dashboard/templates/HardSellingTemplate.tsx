import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "shared/components/ui/button";
import { Form } from "shared/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared/components/ui/select";
import { Textarea } from "shared/components/ui/textarea";
import { Card } from "shared/components/ui/card";
import { HARD_SELLING_OPTIONS } from "../../../constants/templates/hardSelling";
import type { HardSellingTemplateData } from "../../../types/templates/hardSelling";

interface HardSellingTemplateProps {
  onContentUpdate: (content: string) => void;
}

export const HardSellingTemplate: React.FC<HardSellingTemplateProps> = ({ onContentUpdate }) => {
  const form = useForm<HardSellingTemplateData>();
  const [selectedOptions, setSelectedOptions] = React.useState<Record<string, string>>({});

  const onSubmit = (data: HardSellingTemplateData) => {
    console.log("Form submitted:", data);
    onContentUpdate(JSON.stringify(data));
  };

  const handleSelectChange = (value: string, field: keyof HardSellingTemplateData) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [field]: value
    }));
    form.setValue(field, value);
    
    const currentFormData = form.getValues();
    onContentUpdate(JSON.stringify({ ...currentFormData, [field]: value }));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-4">
          <div className="space-y-4">
            {HARD_SELLING_OPTIONS.map((option) => (
              <div key={option.value} className="space-y-2">
                <label className="text-sm font-medium">{option.label}</label>
                <Select
                  value={selectedOptions[option.value as keyof HardSellingTemplateData] || ""}
                  onValueChange={(value) => 
                    handleSelectChange(value, option.value as keyof HardSellingTemplateData)
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
                
                {selectedOptions[option.value as keyof HardSellingTemplateData] === "custom" && (
                  <Textarea
                    className="min-h-[100px] bg-accent/50 hover:bg-accent/70 transition-colors"
                    placeholder={`Enter your custom ${option.label.toLowerCase()}...`}
                    {...form.register(option.value as keyof HardSellingTemplateData)}
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
