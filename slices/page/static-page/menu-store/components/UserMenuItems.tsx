import React, { useState } from 'react'
import { Button } from "shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "shared/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "shared/components/ui/alert"
import { Dialog, DialogContent } from "shared/components/ui/dialog"
import { MenuItem, SubMenuItem, GroupLabel, NavGroup } from 'shared/types/navigation-types'
import { UserMenuItemsProps } from '../types/userMenu.types'
import { type LucideIcon, Edit, Trash, PlusCircle, File, AlertCircle } from 'lucide-react'
import { useUserMenu } from '../hooks/useUserMenu'
import { getIconByName } from 'shared/components/icon-picker/utils'
import { useIconManagement } from '../hooks/useIconManagement'
import { useMenuOperations } from '../hooks/useMenuOperations'
import { createEmptySubMenuItem } from '../utils/menuItemOperations'
import { MenuItemForm } from '@/slices/menu/nav-main/components/forms/MenuItemForm'
import { GroupLabelForm } from '@/slices/menu/nav-main/components/forms/GroupForm'
import { SubMenuItemForm } from '@/slices/menu/nav-main/components/forms/SubMenuItemForm'

// Helper function to render icon component
const renderIcon = (icon: string | LucideIcon | undefined): JSX.Element => {
  if (!icon) {
    return <File className="h-4 w-4" />;
  }

  if (typeof icon === 'string') {
    const IconComponent = getIconByName(icon);
    if (!IconComponent) {
      return <File className="h-4 w-4" />;
    }
    return <IconComponent className="h-4 w-4" />;
  }

  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null)) {
    const IconComponent = icon;
    return <IconComponent className="h-4 w-4" />;
  }

  return <File className="h-4 w-4" />;
};

export function UserMenuItems({ 
  onRemoveItem, 
  onEditItem, 
  onAddLabel, 
  onAddSubMenuItem,
  onChangeGroup,
  isSubmenuAvailable = true 
}: UserMenuItemsProps) {
  const [activeDialog, setActiveDialog] = useState<'label' | 'editLabel' | 'item' | 'subMenu' | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedSubItemId, setSelectedSubItemId] = useState<string | null>(null);
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);

  const {
    iconErrors,
    clearIconError,
  } = useIconManagement();

  const {
    handleEditWithValidation,
    handleDeleteSubItem,
    handleSaveSubMenuItemWrapper,
  } = useMenuOperations(onEditItem, onRemoveItem, onAddSubMenuItem);

  const { 
    navData, 
    handleDeleteItem, 
    handleSaveLabel,
    handleGroupChange,
    updateItemCollapsible,
    deleteGroupLabel,
    findMenuItem
  } = useUserMenu();

  const handleToggleCollapsible = (itemId: string, isCollapsible: boolean) => {
    updateItemCollapsible(itemId, isCollapsible);
  };

  // Create wrapper functions to match expected types
  const handleSaveLabelWrapper = (label: GroupLabel) => {
    handleSaveLabel(label, selectedLabelId !== null, selectedLabelId);
    setActiveDialog(null);
    setSelectedLabelId(null);
  };

  const handleDeleteGroupWrapper = (groupId: string) => {
    deleteGroupLabel(groupId);
  };

  const handleEditLabelClick = (label: GroupLabel) => {
    setSelectedLabelId(label.id);
    setActiveDialog('editLabel');
  };

  const handleAddNewLabel = () => {
    setSelectedLabelId(null);
    setActiveDialog('label');
  };

  const handleEditItemClick = (item: MenuItem) => {
    setSelectedItemId(item.id);
    setActiveDialog('item');
  };

  const handleAddSubItemClick = (parentId: string) => {
    setSelectedItemId(parentId);
    setSelectedSubItemId(null);
    setActiveDialog('subMenu');
  };

  const handleEditSubItemClick = (parentId: string, subItemId: string) => {
    setSelectedItemId(parentId);
    setSelectedSubItemId(subItemId);
    setActiveDialog('subMenu');
  };

  // Function to find a sub-item by its ID
  const findSubMenuItem = (parentId: string, subItemId: string): SubMenuItem | null => {
    const parentItem = findMenuItem(parentId);
    if (!parentItem?.items) return null;
    return parentItem.items.find(item => item.id === subItemId) || null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Nav Main Items</CardTitle>
        <CardDescription>Current items in your navigation menu</CardDescription>
      </CardHeader>
      <CardContent>
        {navData.groups.map((group: NavGroup) => (
          <div key={group.label.id} className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{group.label.title}</h3>
              {group.label.id !== 'default' && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditLabelClick(group.label)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteGroupWrapper(group.label.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="space-y-2">
              {group.items.map((item: MenuItem) => (
                <div key={item.id} className="flex flex-col space-y-2 p-4 border rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {renderIcon(item.icon)}
                      <span>{item.title}</span>
                    </div>
                    {iconErrors[item.id] && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Icon Error</AlertTitle>
                        <AlertDescription>
                          {iconErrors[item.id]}
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => clearIconError(item.id)}
                          >
                            Dismiss
                          </Button>
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="flex items-center gap-2">
                      {item.items && item.items.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Select
                            value={item.isCollapsible ? "collapse" : "secondary"}
                            onValueChange={(value) => handleToggleCollapsible(item.id, value === "collapse")}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="collapse">Collapsible</SelectItem>
                              <SelectItem value="secondary">Secondary Panel</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddSubItemClick(item.id)}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditItemClick(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteItem(item.id, group.label.id, onRemoveItem)}
                        >
                          <Trash className="h-4 w-4" />
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
                            {navData.groups.map((g: NavGroup) => (
                              <SelectItem key={g.label.id} value={g.label.id}>
                                {g.label.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Sub-items section */}
                  <div className="ml-6 space-y-2">
                    {item.items?.map((subItem: SubMenuItem) => (
                      <div key={subItem.id} className="flex items-center justify-between p-2 border rounded-lg bg-gray-50">
                        <span>{subItem.title}</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditSubItemClick(item.id, subItem.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSubItem(item.id, subItem.id, item)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <Button onClick={handleAddNewLabel} variant="outline" className="mt-4">
          Add New Group
        </Button>
      </CardContent>

      {/* Dialogs */}
      <Dialog open={activeDialog === 'label'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent>
          <GroupLabelForm 
            label={null}
            onSave={handleSaveLabelWrapper}
            onCancel={() => setActiveDialog(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === 'editLabel'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent>
          <GroupLabelForm 
            label={navData.groups.find(g => g.label.id === selectedLabelId)?.label || null}
            onSave={handleSaveLabelWrapper}
            onCancel={() => setActiveDialog(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === 'item'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent>
          <MenuItemForm 
            item={findMenuItem(selectedItemId || '') || null}
            onSave={handleEditWithValidation}
            onCancel={() => setActiveDialog(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === 'subMenu'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent>
          <SubMenuItemForm 
            item={selectedSubItemId ? findSubMenuItem(selectedItemId || '', selectedSubItemId) : null}
            parentId={selectedItemId || ''}
            onSave={(subItem) => {
              handleSaveSubMenuItemWrapper(selectedItemId || '', subItem);
              setActiveDialog(null);
            }}
            onCancel={() => setActiveDialog(null)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
