"use client"

import { Input } from "shared/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "shared/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "shared/components/ui/accordion";
import { faqItems, guides } from "../constants";
import { Search } from "lucide-react";

export function HelpContent() {

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search help articles..." className="pl-8" />
      </div>

      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
        </TabsList>
        <TabsContent value="faq" className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
        <TabsContent value="guides" className="space-y-4">
          {guides.map((guide, index) => (
            <Card key={index} className="cursor-pointer hover:bg-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <guide.icon className="h-5 w-5" />
                  {guide.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {guide.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Card className="bg-muted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Need more help?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Can't find what you're looking for? Contact our support team.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
