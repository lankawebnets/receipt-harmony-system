
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionForm from '@/components/TransactionForm';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { format } from 'date-fns';

const Payments = () => {
  const { transactions, institutions, receiptTypes } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('view');
  
  // Filter payments only
  const payments = transactions.filter(
    transaction => transaction.transaction_type === 'payment'
  );
  
  // Filter by search query
  const filteredPayments = payments.filter(payment => {
    const searchString = `
      ${payment.institution_name ? payment.institution_name.toLowerCase() : ''}
      ${payment.type_name ? payment.type_name.toLowerCase() : ''}
      ${payment.date.toLowerCase()}
      ${payment.amount.toString().toLowerCase()}
    `;
    
    return searchString.includes(searchQuery.toLowerCase());
  });
  
  // Sort by date (most recent first)
  const sortedPayments = [...filteredPayments].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  
  return (
    <div className="space-y-6 animate-in">
      <h1 className="text-3xl font-bold tracking-tight">
        Payment Management
      </h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view">View Payments</TabsTrigger>
          <TabsTrigger value="add">Add Payment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="view" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Records</CardTitle>
              <CardDescription>
                View all payments recorded in the system.
              </CardDescription>
              
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search payments..."
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
                      <th className="text-left p-2 font-medium">Date</th>
                      <th className="text-left p-2 font-medium">Institution</th>
                      <th className="text-left p-2 font-medium">Payment Type</th>
                      <th className="text-right p-2 font-medium">Amount (LKR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPayments.map((payment) => (
                      <tr key={payment.id} className="border-t hover:bg-muted/50">
                        <td className="p-2">
                          {format(new Date(payment.date), 'dd/MM/yyyy')}
                        </td>
                        <td className="p-2">
                          {payment.institution_name || 'Unknown'}
                        </td>
                        <td className="p-2">
                          {payment.type_name || 'Unknown'}
                        </td>
                        <td className="p-2 text-right font-medium">
                          {parseFloat(payment.amount).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    
                    {sortedPayments.length === 0 && (
                      <tr>
                        <td colSpan="4" className="p-4 text-center text-muted-foreground">
                          {searchQuery 
                            ? "No payments found matching your search." 
                            : "No payments have been recorded yet."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Record New Payment</CardTitle>
              <CardDescription>
                Add a new payment to the system.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <TransactionForm 
                transactionType="payment"
                onSuccess={() => setActiveTab('view')}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payments;
