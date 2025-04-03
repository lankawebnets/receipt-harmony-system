
import { useState, useRef } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Database, Download, Upload } from 'lucide-react';
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Backup = () => {
  const { backupDatabase, restoreDatabase } = useData();
  const { isSuperAdmin } = useAuth();
  
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [restoreError, setRestoreError] = useState(null);
  const fileInputRef = useRef(null);
  
  // Handle backup creation
  const handleBackup = () => {
    backupDatabase();
  };
  
  // Handle file selection for restore
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Read the file
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        // Parse the file content
        const backupData = JSON.parse(event.target.result);
        setRestoreError(null);
        setIsRestoreDialogOpen(true);
        
        // Store the data for later use
        reader.backupData = backupData;
      } catch (error) {
        setRestoreError('Invalid backup file format. Please select a valid JSON backup file.');
      }
    };
    
    reader.onerror = () => {
      setRestoreError('Error reading the backup file. Please try again.');
    };
    
    reader.readAsText(file);
  };
  
  // Handle restore confirmation
  const handleRestoreConfirm = () => {
    const reader = fileInputRef.current.files[0]?.reader;
    if (!reader || !reader.backupData) {
      setRestoreError('Backup data not found. Please select a file again.');
      return;
    }
    
    const success = restoreDatabase(reader.backupData);
    if (success) {
      setIsRestoreDialogOpen(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // Trigger the file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  return (
    <div className="space-y-6 animate-in">
      <h1 className="text-3xl font-bold tracking-tight">
        Database Backup & Restore
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Backup</CardTitle>
            <CardDescription>
              Download a backup of the current database.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Creating a backup will download a JSON file containing all system data including institutions, 
              receipt types, users, and transactions. Store this file securely.
            </p>
            
            <Button 
              onClick={handleBackup}
              className="w-full"
            >
              <Download size={16} className="mr-2" />
              Download Backup
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Restore Backup</CardTitle>
            <CardDescription>
              Restore the database from a previous backup.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Restoring from a backup will replace all current data with the data from the backup file. 
              This action cannot be undone.
            </p>
            
            {restoreError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {restoreError}
                </AlertDescription>
              </Alert>
            )}
            
            <input 
              type="file" 
              accept=".json" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            
            <Button 
              onClick={triggerFileInput}
              className="w-full"
              variant={isSuperAdmin() ? "default" : "secondary"}
              disabled={!isSuperAdmin()}
            >
              <Upload size={16} className="mr-2" />
              {isSuperAdmin() ? "Upload Backup File" : "Only Super Admin Can Restore"}
            </Button>
            
            {!isSuperAdmin() && (
              <p className="mt-2 text-xs text-muted-foreground text-center">
                Only Super Admin users can restore database backups.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Backup & Restore Guidelines</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">When to create backups</h3>
              <p className="text-muted-foreground">
                It's recommended to create regular backups, especially before making major changes to the system or 
                at the end of each working day.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">Storing backups</h3>
              <p className="text-muted-foreground">
                Store backup files in a secure location. Consider using encrypted storage and keeping multiple copies 
                in different locations for added security.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">Restoration process</h3>
              <p className="text-muted-foreground">
                Before restoring, ensure all users are logged out of the system. The restore process will replace all 
                current data with the data from the backup file.
              </p>
            </div>
            
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> In a production environment, backup and restore operations should be implemented 
                with proper server-side logic and authentication to ensure data security.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Restore Confirmation Dialog */}
      <AlertDialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Database Restore</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace all current data with the data from the backup file. This action cannot be undone. 
              Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestoreConfirm} className="bg-destructive text-destructive-foreground">
              Restore Database
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Backup;
