
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionForm from '@/components/TransactionForm';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const Receipts = () => {
  const { transactions, institutions, receiptTypes } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('view');
  
  // Filter receipts only
  const receipts = transactions.filter(
    transaction => transaction.transactionType === 'receipt'
  );
  
  // Filter by search query
  const filteredReceipts = receipts.filter(receipt => {
    const institution = institutions.find(i => i.id === receipt.institutionId);
    const type = receiptTypes.find(t => t.id === receipt.typeId);
    
    const searchString = `
      ${institution ? institution.name.toLowerCase() : ''}
      ${type ? type.name.toLowerCase() : ''}
      ${receipt.date.toLowerCase()}
      ${receipt.amount.toString().toLowerCase()}
    `;
    
    return searchString.includes(searchQuery.toLowerCase());
  });
  
  // Sort by date (most recent first)
  const sortedReceipts = [...filteredReceipts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  
  return (
    <div className="space-y-6 animate-in">
      <h1 className="text-3xl font-bold tracking-tight">
        Receipt Management
      </h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view">View Receipts</TabsTrigger>
          <TabsTrigger value="add">Add Receipt</TabsTrigger>
        </TabsList>
        
        <TabsContent value="view" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Receipt Records</CardTitle>
              <CardDescription>
                View all receipts recorded in the system.
              </CardDescription>
              
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search receipts..."
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
                      <th className="text-left p-2 font-medium">Receipt Type</th>
                      <th className="text-right p-2 font-medium">Amount (LKR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedReceipts.map((receipt) => {
                      const institution = institutions.find(i => i.id === receipt.institutionId);
                      const type = receiptTypes.find(t => t.id === receipt.typeId);
                      
                      return (
                        <tr key={receipt.id} className="border-t hover:bg-muted/50">
                          <td className="p-2">
                            {format(parseISO(receipt.date), 'dd/MM/yyyy')}
                          </td>
                          <td className="p-2">
                            {institution?.name || 'Unknown'}
                          </td>
                          <td className="p-2">
                            {type?.name || 'Unknown'}
                          </td>
                          <td className="p-2 text-right font-medium">
                            {receipt.amount.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                    
                    {sortedReceipts.length === 0 && (
                      <tr>
                        <td colSpan="4" className="p-4 text-center text-muted-foreground">
                          {searchQuery 
                            ? "No receipts found matching your search." 
                            : "No receipts have been recorded yet."}
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
              <CardTitle>Record New Receipt</CardTitle>
              <CardDescription>
                Add a new receipt to the system.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <TransactionForm 
                transactionType="receipt"
                onSuccess={() => setActiveTab('view')}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Receipts;
