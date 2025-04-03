
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ReceiptTypes = () => {
  const { receiptTypes, addReceiptType, updateReceiptType, deleteReceiptType } = useData();
  const { canManageInstitutions } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [newTypeName, setNewTypeName] = useState('');
  const [editingType, setEditingType] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState(null);

  // If user doesn't have permission, redirect to dashboard
  if (!canManageInstitutions()) {
    return <Navigate to="/dashboard" />;
  }

  // Filter receipt types based on search query
  const filteredTypes = receiptTypes.filter(
    (type) => type.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle adding new receipt type
  const handleAddType = () => {
    if (newTypeName.trim()) {
      addReceiptType(newTypeName.trim());
      setNewTypeName('');
      setIsAddDialogOpen(false);
    }
  };

  // Handle updating receipt type
  const handleUpdateType = () => {
    if (editingType && editingType.name.trim()) {
      updateReceiptType(editingType.id, editingType.name.trim());
      setEditingType(null);
      setIsEditDialogOpen(false);
    }
  };

  // Handle confirming deletion
  const handleConfirmDelete = () => {
    if (typeToDelete) {
      deleteReceiptType(typeToDelete.id);
      setTypeToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Receipt Types Management
        </h1>
        
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus size={16} className="mr-2" />
          Add Receipt Type
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Receipt Types</CardTitle>
          <CardDescription>
            Manage receipt types for transactions.
          </CardDescription>
          
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search receipt types..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto border rounded-md">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-2 font-medium">Name</th>
                  <th className="text-right p-2 font-medium w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTypes.map((type) => (
                  <tr key={type.id} className="border-t hover:bg-muted/50">
                    <td className="p-2">
                      {type.name}
                    </td>
                    <td className="p-2 text-right space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setEditingType({ ...type });
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit size={16} />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setTypeToDelete(type);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 size={16} />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </td>
                  </tr>
                ))}
                
                {filteredTypes.length === 0 && (
                  <tr>
                    <td colSpan="2" className="p-4 text-center text-muted-foreground">
                      {searchQuery 
                        ? "No receipt types found matching your search." 
                        : "No receipt types have been added yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Receipt Type Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Receipt Type</DialogTitle>
            <DialogDescription>
              Enter the name of the new receipt type.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Type Name</Label>
              <Input
                id="name"
                placeholder="Enter receipt type name"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddType}>
              Add Receipt Type
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Receipt Type Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Receipt Type</DialogTitle>
            <DialogDescription>
              Update the receipt type name.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Type Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter receipt type name"
                value={editingType?.name || ''}
                onChange={(e) => setEditingType({ ...editingType, name: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateType}>
              Update Receipt Type
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the receipt type "{typeToDelete?.name}". 
              This action cannot be undone if the type has no associated transactions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReceiptTypes;
