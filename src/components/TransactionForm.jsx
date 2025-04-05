
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';

const TransactionForm = ({ transactionType, onSuccess }) => {
  const { institutions, receiptTypes, addTransaction } = useData();
  const today = new Date();
  
  const [date, setDate] = useState(today);
  const [institutionId, setInstitutionId] = useState('');
  const [typeId, setTypeId] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({});

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = {};
    
    if (!date) validationErrors.date = 'Date is required';
    if (!institutionId) validationErrors.institutionId = 'Institution is required';
    if (!typeId) validationErrors.typeId = 'Receipt type is required';
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      validationErrors.amount = 'Please enter a valid amount';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Clear any previous errors
    setErrors({});
    
    try {
      // Create transaction
      const newTransaction = {
        date: format(date, 'yyyy-MM-dd'),
        institutionId: parseInt(institutionId),
        typeId: parseInt(typeId),
        amount: parseFloat(amount),
        transactionType
      };
      
      await addTransaction(newTransaction);
      
      // Reset form
      setDate(today);
      setInstitutionId('');
      setTypeId('');
      setAmount('');
      
      // Call success callback if provided
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting transaction:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full pl-3 text-left font-normal",
                !date && "text-muted-foreground",
                errors.date && "border-destructive"
              )}
            >
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date > today}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.date && (
          <p className="text-sm text-destructive">{errors.date}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="institution">Institution</Label>
        <Select 
          value={institutionId} 
          onValueChange={setInstitutionId}
        >
          <SelectTrigger className={cn(
            errors.institutionId && "border-destructive"
          )}>
            <SelectValue placeholder="Select institution" />
          </SelectTrigger>
          <SelectContent>
            {institutions.map((institution) => (
              <SelectItem key={institution.id} value={institution.id.toString()}>
                {institution.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.institutionId && (
          <p className="text-sm text-destructive">{errors.institutionId}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Receipt Type</Label>
        <Select 
          value={typeId} 
          onValueChange={setTypeId}
        >
          <SelectTrigger className={cn(
            errors.typeId && "border-destructive"
          )}>
            <SelectValue placeholder="Select receipt type" />
          </SelectTrigger>
          <SelectContent>
            {receiptTypes.map((type) => (
              <SelectItem key={type.id} value={type.id.toString()}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.typeId && (
          <p className="text-sm text-destructive">{errors.typeId}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="amount">Amount (LKR)</Label>
        <div className="relative">
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={cn(
              "pl-10",
              errors.amount && "border-destructive"
            )}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-muted-foreground">LKR</span>
          </div>
        </div>
        {errors.amount && (
          <p className="text-sm text-destructive">{errors.amount}</p>
        )}
      </div>
      
      <Button type="submit" className="w-full">
        Record {transactionType === 'receipt' ? 'Receipt' : 'Payment'}
      </Button>
    </form>
  );
};

export default TransactionForm;
