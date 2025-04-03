
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Pencil, X } from 'lucide-react';
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

const Institutions = () => {
  const { institutions, addInstitution, updateInstitution, deleteInstitution } = useData();
  const { canManageInstitutions } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [newInstitutionName, setNewInstitutionName] = useState('');
  const [editingInstitution, setEditingInstitution] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [institutionToDelete, setInstitutionToDelete] = useState(null);

  // If user doesn't have permission, redirect to dashboard
  if (!canManageInstitutions()) {
    return <Navigate to="/dashboard" />;
  }

  // Filter institutions based on search query
  const filteredInstitutions = institutions.filter(
    (institution) => institution.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle adding new institution
  const handleAddInstitution = () => {
    if (newInstitutionName.trim()) {
      addInstitution(newInstitutionName.trim());
      setNewInstitutionName('');
      setIsAddDialogOpen(false);
    }
  };

  // Handle updating institution
  const handleUpdateInstitution = () => {
    if (editingInstitution && editingInstitution.name.trim()) {
      updateInstitution(editingInstitution.id, editingInstitution.name.trim());
      setEditingInstitution(null);
      setIsEditDialogOpen(false);
    }
  };

  // Handle confirming deletion
  const handleConfirmDelete = () => {
    if (institutionToDelete) {
      deleteInstitution(institutionToDelete.id);
      setInstitutionToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Institution Management
        </h1>
        
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus size={16} className="mr-2" />
          Add Institution
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Institutions</CardTitle>
          <CardDescription>
            Manage institutions for receipts and payments.
          </CardDescription>
          
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search institutions..."
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
                {filteredInstitutions.map((institution) => (
                  <tr key={institution.id} className="border-t hover:bg-muted/50">
                    <td className="p-2">
                      {institution.name}
                    </td>
                    <td className="p-2 text-right space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setEditingInstitution({ ...institution });
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
                          setInstitutionToDelete(institution);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 size={16} />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </td>
                  </tr>
                ))}
                
                {filteredInstitutions.length === 0 && (
                  <tr>
                    <td colSpan="2" className="p-4 text-center text-muted-foreground">
                      {searchQuery 
                        ? "No institutions found matching your search." 
                        : "No institutions have been added yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Institution Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Institution</DialogTitle>
            <DialogDescription>
              Enter the name of the new institution.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Institution Name</Label>
              <Input
                id="name"
                placeholder="Enter institution name"
                value={newInstitutionName}
                onChange={(e) => setNewInstitutionName(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddInstitution}>
              Add Institution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Institution Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Institution</DialogTitle>
            <DialogDescription>
              Update the institution name.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Institution Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter institution name"
                value={editingInstitution?.name || ''}
                onChange={(e) => setEditingInstitution({ ...editingInstitution, name: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateInstitution}>
              Update Institution
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
              This will permanently delete the institution "{institutionToDelete?.name}". 
              This action cannot be undone if the institution has no associated transactions.
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

export default Institutions;
