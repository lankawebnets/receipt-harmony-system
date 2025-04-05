
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  institutionService, 
  receiptTypeService, 
  transactionService, 
  userService,
  reportService,
  backupService
} from '../services/api';
import { toast } from '@/components/ui/use-toast';

const DataContext = createContext(null);

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  
  // State for institutions
  const [institutions, setInstitutions] = useState([]);
  
  // State for receipt types
  const [receiptTypes, setReceiptTypes] = useState([]);
  
  // State for users
  const [users, setUsers] = useState([]);
  
  // State for transactions
  const [transactions, setTransactions] = useState([]);

  // State for tracking opening balance
  const [openingBalance, setOpeningBalance] = useState(10000);

  // Loading state
  const [loading, setLoading] = useState({
    institutions: true,
    receiptTypes: true,
    users: true,
    transactions: true
  });

  // Load institutions from API
  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        setLoading(prev => ({ ...prev, institutions: true }));
        const data = await institutionService.getAll();
        setInstitutions(data);
      } catch (error) {
        console.error('Error fetching institutions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load institutions',
          variant: 'destructive',
        });
      } finally {
        setLoading(prev => ({ ...prev, institutions: false }));
      }
    };

    if (user) {
      fetchInstitutions();
    }
  }, [user]);

  // Load receipt types from API
  useEffect(() => {
    const fetchReceiptTypes = async () => {
      try {
        setLoading(prev => ({ ...prev, receiptTypes: true }));
        const data = await receiptTypeService.getAll();
        setReceiptTypes(data);
      } catch (error) {
        console.error('Error fetching receipt types:', error);
        toast({
          title: 'Error',
          description: 'Failed to load receipt types',
          variant: 'destructive',
        });
      } finally {
        setLoading(prev => ({ ...prev, receiptTypes: false }));
      }
    };

    if (user) {
      fetchReceiptTypes();
    }
  }, [user]);

  // Load users from API (only for super admin)
  useEffect(() => {
    const fetchUsers = async () => {
      if (user?.role !== 'super_admin') return;
      
      try {
        setLoading(prev => ({ ...prev, users: true }));
        const data = await userService.getAll();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: 'Error',
          description: 'Failed to load users',
          variant: 'destructive',
        });
      } finally {
        setLoading(prev => ({ ...prev, users: false }));
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user]);

  // Load transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(prev => ({ ...prev, transactions: true }));
        const data = await transactionService.getAll();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load transactions',
          variant: 'destructive',
        });
      } finally {
        setLoading(prev => ({ ...prev, transactions: false }));
      }
    };

    if (user) {
      fetchTransactions();
    }
  }, [user]);

  // Get visible transactions for the current user
  const getVisibleTransactions = () => {
    if (!user) return [];
    return transactions;
  };

  // Add institution
  const addInstitution = async (name) => {
    try {
      const newInstitution = await institutionService.add(name);
      setInstitutions([...institutions, newInstitution]);
      toast({
        title: 'Institution added',
        description: `${name} has been added successfully.`,
      });
      return newInstitution;
    } catch (error) {
      console.error('Error adding institution:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add institution',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Update institution
  const updateInstitution = async (id, name) => {
    try {
      const updatedInstitution = await institutionService.update(id, name);
      setInstitutions(institutions.map(inst => 
        inst.id === id ? updatedInstitution : inst
      ));
      toast({
        title: 'Institution updated',
        description: `Institution has been updated to ${name}.`,
      });
      return updatedInstitution;
    } catch (error) {
      console.error('Error updating institution:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update institution',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Delete institution
  const deleteInstitution = async (id) => {
    try {
      await institutionService.delete(id);
      setInstitutions(institutions.filter(inst => inst.id !== id));
      toast({
        title: 'Institution deleted',
        description: 'Institution has been deleted successfully.',
      });
      return true;
    } catch (error) {
      console.error('Error deleting institution:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete institution',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Add receipt type
  const addReceiptType = async (name) => {
    try {
      const newType = await receiptTypeService.add(name);
      setReceiptTypes([...receiptTypes, newType]);
      toast({
        title: 'Receipt type added',
        description: `${name} has been added successfully.`,
      });
      return newType;
    } catch (error) {
      console.error('Error adding receipt type:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add receipt type',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Update receipt type
  const updateReceiptType = async (id, name) => {
    try {
      const updatedType = await receiptTypeService.update(id, name);
      setReceiptTypes(receiptTypes.map(type => 
        type.id === id ? updatedType : type
      ));
      toast({
        title: 'Receipt type updated',
        description: `Receipt type has been updated to ${name}.`,
      });
      return updatedType;
    } catch (error) {
      console.error('Error updating receipt type:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update receipt type',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Delete receipt type
  const deleteReceiptType = async (id) => {
    try {
      await receiptTypeService.delete(id);
      setReceiptTypes(receiptTypes.filter(type => type.id !== id));
      toast({
        title: 'Receipt type deleted',
        description: 'Receipt type has been deleted successfully.',
      });
      return true;
    } catch (error) {
      console.error('Error deleting receipt type:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete receipt type',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Add user
  const addUser = async (userData) => {
    try {
      const newUser = await userService.add(userData);
      setUsers([...users, newUser]);
      toast({
        title: 'User added',
        description: `${newUser.name} has been added successfully.`,
      });
      return newUser;
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add user',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Update user
  const updateUser = async (id, userData) => {
    try {
      const updatedUser = await userService.update(id, userData);
      setUsers(users.map(user => 
        user.id === id ? updatedUser : user
      ));
      toast({
        title: 'User updated',
        description: `User information has been updated.`,
      });
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update user',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    try {
      await userService.delete(id);
      setUsers(users.filter(user => user.id !== id));
      toast({
        title: 'User deleted',
        description: 'User has been deleted successfully.',
      });
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete user',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Add transaction
  const addTransaction = async (transactionData) => {
    try {
      const newTransaction = await transactionService.add(transactionData);
      setTransactions([...transactions, newTransaction]);
      toast({
        title: 'Transaction added',
        description: `${transactionData.transactionType === 'receipt' ? 'Receipt' : 'Payment'} has been recorded successfully.`,
      });
      return newTransaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add transaction',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Generate report for a given date range
  const generateReport = async (startDate, endDate, institutionId = null, typeId = null) => {
    try {
      const reportData = await reportService.generate(startDate, endDate, institutionId, typeId);
      return reportData;
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to generate report',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Function to get institution by ID
  const getInstitutionById = (id) => {
    return institutions.find(inst => inst.id === id) || null;
  };

  // Function to get receipt type by ID
  const getReceiptTypeById = (id) => {
    return receiptTypes.find(type => type.id === id) || null;
  };

  // Backup database
  const backupDatabase = async () => {
    try {
      const backupData = await backupService.export();
      
      // Create a blob and download it
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `revenue-management-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Backup created',
        description: 'Database backup has been downloaded successfully.',
      });
      
      return true;
    } catch (error) {
      console.error('Error creating backup:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create backup',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Restore database from backup
  const restoreDatabase = async (backupData) => {
    try {
      await backupService.import(backupData);
      
      // Refresh all data
      const institutions = await institutionService.getAll();
      const receiptTypes = await receiptTypeService.getAll();
      const transactions = await transactionService.getAll();
      const users = user?.role === 'super_admin' ? await userService.getAll() : [];
      
      setInstitutions(institutions);
      setReceiptTypes(receiptTypes);
      setTransactions(transactions);
      if (user?.role === 'super_admin') {
        setUsers(users);
      }
      
      toast({
        title: 'Restore successful',
        description: 'Database has been restored from backup.',
      });
      return true;
    } catch (error) {
      console.error('Error restoring database:', error);
      toast({
        title: 'Restore failed',
        description: error.response?.data?.message || 'Failed to restore database from backup.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return (
    <DataContext.Provider
      value={{
        institutions,
        receiptTypes,
        users,
        transactions: getVisibleTransactions(),
        loading,
        addInstitution,
        updateInstitution,
        deleteInstitution,
        addReceiptType,
        updateReceiptType,
        deleteReceiptType,
        addUser,
        updateUser,
        deleteUser,
        addTransaction,
        generateReport,
        getInstitutionById,
        getReceiptTypeById,
        backupDatabase,
        restoreDatabase,
        openingBalance,
        setOpeningBalance,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
