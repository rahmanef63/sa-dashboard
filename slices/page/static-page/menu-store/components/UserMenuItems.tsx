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
import { UserMenuItemsProps } from '../types/userMenu.types'
import { MenuItem, SubMenuItem, NavUrl } from 'shared/types/navigation-types'
import { useUserMenu } from '../hooks/useUserMenu'

export function UserMenuItems({ onRemoveItem, onEditItem, onAddLabel, onAddSubMenuItem, onChangeGroup, isSubmenuAvailable = true }: UserMenuItemsProps) {
  const [activeDialog, setActiveDialog] = useState<'label' | 'item' | 'subMenu' | 'editLabel' | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedSubItemId, setSelectedSubItemId] = useState<string | null>(null);

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
    deleteGroupLabel,
    updateItemCollapsible
  } = useUserMenu();

  const handleToggleCollapsible = (itemId: string, isCollapsible: boolean) => {
    updateItemCollapsible(itemId, isCollapsible);
  };

  // Function to find a sub-item by its ID
  const findSubMenuItem = (parentId: string, subItemId: string): SubMenuItem | null => {
    const parentItem = findMenuItem(parentId);
    if (!parentItem?.items) return null;
    return parentItem.items.find(item => item.id === subItemId) || null;
  };

  // Handle sub-item deletion
  const handleDeleteSubItem = (parentId: string, subItemId: string, groupId: string) => {
    const parentItem = findMenuItem(parentId);
    if (!parentItem?.items) return;
    
    const updatedItems = parentItem.items.filter(item => item.id !== subItemId);
    const updatedParentItem = {
      ...parentItem,
      items: updatedItems
    };
    
    onEditItem(updatedParentItem);
    // toast.success("Sub-item deleted successfully");
  };

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
            <div className="space-y-2">
              {group.items.map((item) => (
                <div key={item.id} className="flex flex-col space-y-2 p-4 border rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {typeof item.icon === 'string' 
                        ? React.createElement(getIconComponent(item.icon), { className: "h-4 w-4" })
                        : React.createElement(item.icon, { className: "h-4 w-4" })}
                      <span>{item.title}</span>
                    </div>
                    <div className="flex  items-center gap-2">
                      {item.items && item.items.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 whitespace-nowrap">Collapse:</span>
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
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedItemId(item.id);
                            setActiveDialog('item');
                          }}
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
                            {navData.groups.map((g) => (
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
                    {/* Sub-items list */}
                    {item.items?.map((subItem) => (
                      <div key={subItem.id} className="flex items-center justify-between p-2 border rounded-lg bg-gray-50">
                        <span>{subItem.title}</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedItemId(item.id);
                              setSelectedSubItemId(subItem.id);
                              setActiveDialog('subMenu');
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSubItem(item.id, subItem.id, group.label.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Add sub-item button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center justify-center gap-2 hover:bg-gray-100"
                      onClick={() => {
                        setSelectedItemId(item.id);
                        setSelectedGroupId(group.label.id);
                        setActiveDialog('subMenu');
                      }}
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Add Sub-item</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <Button onClick={() => setActiveDialog('label')} variant="outline" className="mt-4">
          Add New Group
        </Button>
      </CardContent>

      {/* Dialogs */}
      <Dialog open={activeDialog === 'label' || activeDialog === 'editLabel'} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent>
          <GroupLabelForm
            label={activeDialog === 'editLabel' && selectedLabelId ? 
              navData.groups.find(g => g.label.id === selectedLabelId)?.label || null : 
              null}
            onSave={(label) => {
              handleSaveLabel(label, activeDialog === 'editLabel', selectedLabelId);
              setActiveDialog(null);
            }}
            onCancel={() => setActiveDialog(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === 'item'} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent>
          <MenuItemForm
            item={selectedItemId ? findMenuItem(selectedItemId) ?? null : null}
            onSave={handleSaveMenuItem}
            onCancel={() => setActiveDialog(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === 'subMenu'} onOpenChange={() => {
        setActiveDialog(null);
        setSelectedSubItemId(null);
      }}>
        <DialogContent>
          <SubMenuItemForm
            parentId={selectedItemId || ''}
            item={selectedItemId && selectedSubItemId ? findSubMenuItem(selectedItemId, selectedSubItemId) : null}
            onSave={(subItem: SubMenuItem) => {
              if (selectedItemId) {
                handleSaveSubMenuItem(subItem, selectedItemId, onAddSubMenuItem);
                setActiveDialog(null);
                setSelectedSubItemId(null);
              }
            }}
            onCancel={() => {
              setActiveDialog(null);
              setSelectedSubItemId(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
