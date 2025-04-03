
import React, { createContext, useState, useContext, useEffect } from 'react';
import { INSTITUTIONS, RECEIPT_TYPES, TRANSACTIONS, USERS } from '../lib/constants';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

const DataContext = createContext(null);

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  
  // State for institutions
  const [institutions, setInstitutions] = useState(INSTITUTIONS);
  
  // State for receipt types
  const [receiptTypes, setReceiptTypes] = useState(RECEIPT_TYPES);
  
  // State for users
  const [users, setUsers] = useState(USERS);
  
  // State for transactions
  const [transactions, setTransactions] = useState(TRANSACTIONS);

  // State for tracking opening balance (in a real app, this would come from the database)
  const [openingBalance, setOpeningBalance] = useState(10000);

  // Get visible transactions for the current user
  const getVisibleTransactions = () => {
    if (!user) return [];
    
    // Super admin and manager can see all transactions
    if (user.role === 'super_admin' || user.role === 'manager') {
      return transactions;
    }
    
    // Data entry operator can only see their own transactions
    return transactions.filter(transaction => transaction.createdBy === user.id);
  };

  // Add institution
  const addInstitution = (name) => {
    const newId = institutions.length ? Math.max(...institutions.map(i => i.id)) + 1 : 1;
    const newInstitution = { id: newId, name };
    setInstitutions([...institutions, newInstitution]);
    toast({
      title: 'Institution added',
      description: `${name} has been added successfully.`,
    });
    return newInstitution;
  };

  // Update institution
  const updateInstitution = (id, name) => {
    setInstitutions(institutions.map(inst => 
      inst.id === id ? { ...inst, name } : inst
    ));
    toast({
      title: 'Institution updated',
      description: `Institution has been updated to ${name}.`,
    });
  };

  // Delete institution
  const deleteInstitution = (id) => {
    // Check if institution is used in any transaction
    const isUsed = transactions.some(t => t.institutionId === id);
    
    if (isUsed) {
      toast({
        title: 'Cannot delete',
        description: 'This institution is used in transactions and cannot be deleted.',
        variant: 'destructive',
      });
      return false;
    }
    
    setInstitutions(institutions.filter(inst => inst.id !== id));
    toast({
      title: 'Institution deleted',
      description: 'Institution has been deleted successfully.',
    });
    return true;
  };

  // Add receipt type
  const addReceiptType = (name) => {
    const newId = receiptTypes.length ? Math.max(...receiptTypes.map(t => t.id)) + 1 : 1;
    const newType = { id: newId, name };
    setReceiptTypes([...receiptTypes, newType]);
    toast({
      title: 'Receipt type added',
      description: `${name} has been added successfully.`,
    });
    return newType;
  };

  // Update receipt type
  const updateReceiptType = (id, name) => {
    setReceiptTypes(receiptTypes.map(type => 
      type.id === id ? { ...type, name } : type
    ));
    toast({
      title: 'Receipt type updated',
      description: `Receipt type has been updated to ${name}.`,
    });
  };

  // Delete receipt type
  const deleteReceiptType = (id) => {
    // Check if receipt type is used in any transaction
    const isUsed = transactions.some(t => t.typeId === id);
    
    if (isUsed) {
      toast({
        title: 'Cannot delete',
        description: 'This receipt type is used in transactions and cannot be deleted.',
        variant: 'destructive',
      });
      return false;
    }
    
    setReceiptTypes(receiptTypes.filter(type => type.id !== id));
    toast({
      title: 'Receipt type deleted',
      description: 'Receipt type has been deleted successfully.',
    });
    return true;
  };

  // Add user
  const addUser = (userData) => {
    const newId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = { id: newId, ...userData };
    setUsers([...users, newUser]);
    toast({
      title: 'User added',
      description: `${newUser.name} has been added successfully.`,
    });
    return newUser;
  };

  // Update user
  const updateUser = (id, userData) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, ...userData } : user
    ));
    toast({
      title: 'User updated',
      description: `User information has been updated.`,
    });
  };

  // Delete user
  const deleteUser = (id) => {
    // Check if user has created any transactions
    const isUsed = transactions.some(t => t.createdBy === id);
    
    if (isUsed) {
      toast({
        title: 'Cannot delete',
        description: 'This user has created transactions and cannot be deleted.',
        variant: 'destructive',
      });
      return false;
    }
    
    setUsers(users.filter(user => user.id !== id));
    toast({
      title: 'User deleted',
      description: 'User has been deleted successfully.',
    });
    return true;
  };

  // Add transaction
  const addTransaction = (transactionData) => {
    const newId = transactions.length ? Math.max(...transactions.map(t => t.id)) + 1 : 1;
    const newTransaction = { 
      id: newId, 
      ...transactionData,
      createdBy: user.id 
    };
    setTransactions([...transactions, newTransaction]);
    toast({
      title: 'Transaction added',
      description: `${transactionData.transactionType === 'receipt' ? 'Receipt' : 'Payment'} has been recorded successfully.`,
    });
    return newTransaction;
  };

  // Generate report for a given date range
  const generateReport = (startDate, endDate, institutionId = null, typeId = null) => {
    // Filter transactions by date range
    let filteredTransactions = getVisibleTransactions().filter(t => 
      t.date >= startDate && t.date <= endDate
    );
    
    // Further filter by institution if specified
    if (institutionId) {
      filteredTransactions = filteredTransactions.filter(t => t.institutionId === institutionId);
    }
    
    // Further filter by type if specified
    if (typeId) {
      filteredTransactions = filteredTransactions.filter(t => t.typeId === typeId);
    }
    
    // Calculate totals
    const totalReceipts = filteredTransactions
      .filter(t => t.transactionType === 'receipt')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalPayments = filteredTransactions
      .filter(t => t.transactionType === 'payment')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const closingBalance = openingBalance + totalReceipts - totalPayments;
    
    // Format transactions with institution and type names
    const formattedTransactions = filteredTransactions.map(t => ({
      ...t,
      institutionName: institutions.find(i => i.id === t.institutionId)?.name || 'Unknown',
      typeName: receiptTypes.find(ty => ty.id === t.typeId)?.name || 'Unknown'
    }));
    
    return {
      transactions: formattedTransactions,
      openingBalance,
      totalReceipts,
      totalPayments,
      closingBalance,
      startDate,
      endDate,
      institutionName: institutionId 
        ? institutions.find(i => i.id === institutionId)?.name 
        : 'All Institutions',
      typeName: typeId 
        ? receiptTypes.find(t => t.id === typeId)?.name 
        : 'All Types'
    };
  };

  // Function to get institution by ID
  const getInstitutionById = (id) => {
    return institutions.find(inst => inst.id === id) || null;
  };

  // Function to get receipt type by ID
  const getReceiptTypeById = (id) => {
    return receiptTypes.find(type => type.id === id) || null;
  };

  // Backup database (in a real app, this would connect to backend API)
  const backupDatabase = () => {
    const backupData = {
      institutions,
      receiptTypes,
      users,
      transactions,
      openingBalance,
      timestamp: new Date().toISOString()
    };
    
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
  };

  // Restore database from backup (in a real app, this would connect to backend API)
  const restoreDatabase = (backupData) => {
    try {
      setInstitutions(backupData.institutions || []);
      setReceiptTypes(backupData.receiptTypes || []);
      setUsers(backupData.users || []);
      setTransactions(backupData.transactions || []);
      if (backupData.openingBalance !== undefined) {
        setOpeningBalance(backupData.openingBalance);
      }
      
      toast({
        title: 'Restore successful',
        description: 'Database has been restored from backup.',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Restore failed',
        description: 'Failed to restore database from backup.',
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
