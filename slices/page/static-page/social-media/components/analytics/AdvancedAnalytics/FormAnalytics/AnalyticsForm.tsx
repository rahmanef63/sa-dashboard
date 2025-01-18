import React from "react";
import { Card } from "shared/components/ui/card";
import { Input } from "shared/components/ui/input";
import { Label } from "shared/components/ui/label";
import { SocialMediaSelect } from "./SocialMediaSelect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "shared/components/ui/tabs";

interface AnalyticsFormProps {
  platform: string;
  onPlatformChange: (value: string) => void;
}

export const AnalyticsForm = ({ platform, onPlatformChange }: AnalyticsFormProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <SocialMediaSelect value={platform} onValueChange={onPlatformChange} />
          <Input
            type="date"
            className="w-[180px]"
          />
        </div>

        <Tabs defaultValue="reach" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reach">Reach</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="interactions">Interactions</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="reach" className="space-y-4 mt-4">
            <h3 className="font-semibold">Reach</h3>
            <div className="space-y-2">
              <Label>Accounts reached</Label>
              <Input type="number" placeholder="0" />
              <Label>Followers</Label>
              <Input type="number" placeholder="0" />
              <Label>Non-followers</Label>
              <Input type="number" placeholder="0" />
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-4 mt-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Impressions</h3>
              <div className="space-y-2">
                <Label>Total impressions</Label>
                <Input type="number" placeholder="0" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Engagement</h3>
              <div className="space-y-2">
                <Label>Accounts engaged</Label>
                <Input type="number" placeholder="0" />
                <Label>Followers</Label>
                <Input type="number" placeholder="0" />
                <Label>Non-followers</Label>
                <Input type="number" placeholder="0" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="interactions" className="space-y-4 mt-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Story Interactions</h3>
              <div className="space-y-2">
                <Label>Likes</Label>
                <Input type="number" placeholder="0" />
                <Label>Shares</Label>
                <Input type="number" placeholder="0" />
                <Label>Replies</Label>
                <Input type="number" placeholder="0" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Navigation</h3>
              <div className="space-y-2">
                <Label>Forward</Label>
                <Input type="number" placeholder="0" />
                <Label>Exited</Label>
                <Input type="number" placeholder="0" />
                <Label>Next story</Label>
                <Input type="number" placeholder="0" />
                <Label>Look Back</Label>
                <Input type="number" placeholder="0" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4 mt-4">
            <h3 className="font-semibold">Profile</h3>
            <div className="space-y-2">
              <Label>Profile visits</Label>
              <Input type="number" placeholder="0" />
              <Label>External link taps</Label>
              <Input type="number" placeholder="0" />
              <Label>Business address taps</Label>
              <Input type="number" placeholder="0" />
              <Label>Follows</Label>
              <Input type="number" placeholder="0" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};