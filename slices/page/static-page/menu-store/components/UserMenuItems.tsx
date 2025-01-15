import React, { useState } from 'react'
import { Button } from "shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "shared/components/ui/card"
import { getIconComponent } from '../utils/iconUtils'
import { MenuItemForm } from '@/slices/menu/nav-main/components/forms/MenuItemForm'
import { GroupLabelForm }  from '@/slices/menu/nav-main/components/forms/GroupForm'
import { SubMenuItemForm } from '@/slices/menu/nav-main/components/forms/SubMenuItemForm'
import { Dialog, DialogContent } from "shared/components/ui/dialog"
import { ChevronRight, Edit, PlusCircle, Trash } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared/components/ui/select"
import { UserMenuItemsProps, MenuItemWithStringTarget } from '../types/userMenu.types'
import { useUserMenu } from '../hooks/useUserMenu'

export function UserMenuItems({ onRemoveItem, onEditItem, onAddLabel, onAddSubMenuItem, onChangeGroup, isSubmenuAvailable = true }: UserMenuItemsProps) {
  const [activeDialog, setActiveDialog] = useState<'label' | 'item' | 'subMenu' | 'editLabel' | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);

  const {
    navData,
    handleEditItem,
    handleDeleteItem,
    handleSaveLabel,
    handleSaveMenuItem,
    handleSaveSubMenuItem,
    handleGroupChange,
    handleSaveToNavMain,
    findMenuItem,
    deleteGroupLabel
  } = useUserMenu();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Nav Main Items</CardTitle>
        <CardDescription>Current items in your navigation menu</CardDescription>
      </CardHeader>
      <CardContent>
        {navData.groups.map((group) => (
          <div key={group.label.id} className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{group.label.title}</h3>
              {group.label.id !== 'default' && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedLabelId(group.label.id);
                      setActiveDialog('editLabel');
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteGroupLabel(group.label.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            {group.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 mb-2 border rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {React.createElement(getIconComponent(item.icon), { className: "h-4 w-4" })}
                  <span>{item.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  {isSubmenuAvailable && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedItemId(item.id);
                        setActiveDialog('subMenu');
                      }}
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Make Sub-item</span>
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      handleEditItem(item as MenuItemWithStringTarget, onEditItem);
                      setSelectedItemId(item.id);
                      setActiveDialog('item');
                    }}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteItem(item.id, group.label.id, onRemoveItem)}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                  <Select
                    defaultValue={item.groupId || group.label.id}
                    onValueChange={(value) => handleGroupChange(item.id, value)}
                    value={item.groupId || group.label.id}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent>
                      {navData.groups.map((g) => (
                        <SelectItem key={g.label.id} value={g.label.id}>
                          {g.label.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        ))}
        <Button onClick={() => setActiveDialog('label')} variant="outline" className="mt-4">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Label
        </Button>
        <Button onClick={handleSaveToNavMain} className="mt-4 ml-2" variant="default">
          Save Changes
        </Button>
      </CardContent>
      <Dialog open={activeDialog !== null} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent>
          {(activeDialog === 'label' || activeDialog === 'editLabel') && (
            <GroupLabelForm 
              label={activeDialog === 'editLabel' ? navData.groups.find(g => g.label.id === selectedLabelId)?.label : undefined}
              onSave={(label) => {
                handleSaveLabel(label, activeDialog === 'editLabel', selectedLabelId);
                setActiveDialog(null);
              }} 
            />
          )}
          {activeDialog === 'item' && selectedItemId && (
            <MenuItemForm
              item={findMenuItem(selectedItemId)}
              onSave={(item) => {
                handleSaveMenuItem(item);
                setActiveDialog(null);
              }}
            />
          )}
          {activeDialog === 'subMenu' && selectedItemId && (
            <SubMenuItemForm 
              parentId={selectedItemId} 
              onSave={(subItem) => {
                handleSaveSubMenuItem(subItem, selectedItemId, onAddSubMenuItem);
                setActiveDialog(null);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
