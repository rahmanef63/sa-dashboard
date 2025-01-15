import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui/tabs';
import { SAMPLE_QUERIES } from '../constants/';

interface QueryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectQuery: (query: string) => void;
}

type TabValue = 'create' | 'read' | 'update' | 'delete' | 'join';

export function QueryDialog({ open, onOpenChange, onSelectQuery }: QueryDialogProps) {
  const [activeTab, setActiveTab] = useState<TabValue>('read');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Sample Queries</DialogTitle>
        </DialogHeader>
        <Tabs 
          defaultValue="read" 
          value={activeTab} 
          onValueChange={(value: string) => setActiveTab(value as TabValue)} 
          className="flex-1 flex flex-col min-h-0"
        >
          <TabsList className="flex justify-start mb-4">
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
            <TabsTrigger value="update">Update</TabsTrigger>
            <TabsTrigger value="delete">Delete</TabsTrigger>
            <TabsTrigger value="join">Join</TabsTrigger>
          </TabsList>
          <div className="flex-1 overflow-y-auto min-h-0 pr-4">
            {Object.entries(SAMPLE_QUERIES).map(([key, queries]) => (
              <TabsContent key={key} value={key} className="mt-0 h-full">
                <div className="space-y-6">
                  {queries.map((sample, index) => (
                    <div key={index} className="space-y-3 pb-6 border-b last:border-0">
                      <h3 className="font-medium text-lg">{sample.name}</h3>
                      <div className="relative">
                        <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                          {sample.query}
                        </pre>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            onSelectQuery(sample.query);
                            onOpenChange(false);
                          }}
                        >
                          Use Query
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        {sample.description}
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
