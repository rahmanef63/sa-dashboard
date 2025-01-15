"use client"

import { Avatar, AvatarFallback, AvatarImage } from "shared/components/ui/avatar"
import { Button } from "shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "shared/components/ui/card"
import { Input } from "shared/components/ui/input"
import { Label } from "shared/components/ui/label"
import { Separator } from "shared/components/ui/separator"
import { Textarea } from "shared/components/ui/textarea"
import { Camera, Link as LinkIcon, Mail, MapPin, Phone, User } from "lucide-react"
import { useState } from "react"
import { user } from '../../../config'

export function ProfileContent() {
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    bio: user.bio || "",
    location: user.location || "",
    phone: user.phone || "",
    website: user.website || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Update your profile picture and personal details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.avatar ?? ""} alt={user?.name ?? "User"} />
              <AvatarFallback>
                {user?.name?.split(" ").map((n) => n[0]).join("") ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm">
                <Camera className="mr-2 h-4 w-4" />
                Change Picture
              </Button>
              <p className="text-xs text-muted-foreground">
                JPG, GIF or PNG. Max size of 800K
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal information and contact details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                <User className="mr-2 h-4 w-4 inline" />
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">
                <Mail className="mr-2 h-4 w-4 inline" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                type="email"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Write a short bio about yourself"
              />
            </div>

            <Separator />

            <div className="grid gap-2">
              <Label htmlFor="location">
                <MapPin className="mr-2 h-4 w-4 inline" />
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your location"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">
                <Phone className="mr-2 h-4 w-4 inline" />
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                type="tel"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="website">
                <LinkIcon className="mr-2 h-4 w-4 inline" />
                Website
              </Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="Enter your website URL"
                type="url"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
