
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Building, Tag, Users, Receipt } from 'lucide-react';

const Dashboard = () => {
  const { user, isSuperAdmin, isManager, isDataEntry } = useAuth();
  const { transactions, institutions, receiptTypes, users, openingBalance } = useData();

  // Calculate total receipts and payments
  const totalReceipts = transactions
    .filter(t => t.transactionType === 'receipt')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalPayments = transactions
    .filter(t => t.transactionType === 'payment')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate current balance
  const currentBalance = openingBalance + totalReceipts - totalPayments;

  // Get recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, {user?.name}
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Receipts
              </CardTitle>
              <CardTitle className="text-2xl font-bold">
                LKR {totalReceipts.toLocaleString()}
              </CardTitle>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
              <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-300" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              All time collected receipts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Payments
              </CardTitle>
              <CardTitle className="text-2xl font-bold">
                LKR {totalPayments.toLocaleString()}
              </CardTitle>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
              <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-300" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              All time payments made
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Balance
              </CardTitle>
              <CardTitle className="text-2xl font-bold">
                LKR {currentBalance.toLocaleString()}
              </CardTitle>
            </div>
            <div className={`p-2 rounded-full ${
              currentBalance >= 0 
                ? "bg-blue-100 dark:bg-blue-900" 
                : "bg-red-100 dark:bg-red-900"
            }`}>
              <Receipt className={`h-4 w-4 ${
                currentBalance >= 0 
                  ? "text-blue-600 dark:text-blue-300" 
                  : "text-red-600 dark:text-red-300"
              }`} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Current available balance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats for Super Admin and Manager */}
      {(isSuperAdmin() || isManager()) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Institutions
                </CardTitle>
                <CardTitle className="text-2xl font-bold">
                  {institutions.length}
                </CardTitle>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Building className="h-4 w-4 text-blue-600 dark:text-blue-300" />
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Receipt Types
                </CardTitle>
                <CardTitle className="text-2xl font-bold">
                  {receiptTypes.length}
                </CardTitle>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                <Tag className="h-4 w-4 text-purple-600 dark:text-purple-300" />
              </div>
            </CardHeader>
          </Card>

          {isSuperAdmin() && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Users
                  </CardTitle>
                  <CardTitle className="text-2xl font-bold">
                    {users.length}
                  </CardTitle>
                </div>
                <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-full">
                  <Users className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                </div>
              </CardHeader>
            </Card>
          )}
        </div>
      )}

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Latest activity in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Institution</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-right p-2">Amount (LKR)</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => {
                  const institution = institutions.find(i => i.id === transaction.institutionId);
                  const type = receiptTypes.find(t => t.id === transaction.typeId);
                  
                  return (
                    <tr key={transaction.id} className="border-b hover:bg-muted/50">
                      <td className="p-2">{new Date(transaction.date).toLocaleDateString()}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          transaction.transactionType === 'receipt' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {transaction.transactionType.charAt(0).toUpperCase() + transaction.transactionType.slice(1)}
                        </span>
                      </td>
                      <td className="p-2">{institution?.name || 'Unknown'}</td>
                      <td className="p-2">{type?.name || 'Unknown'}</td>
                      <td className="p-2 text-right font-medium">
                        {transaction.amount.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
                
                {recentTransactions.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-muted-foreground">
                      No recent transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
