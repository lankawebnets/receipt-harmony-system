
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CalendarIcon, FileDown, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Reports = () => {
  const { generateReport, institutions, receiptTypes } = useData();
  
  // State for form inputs
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [endDate, setEndDate] = useState(new Date());
  const [institutionId, setInstitutionId] = useState("");
  const [typeId, setTypeId] = useState("");
  
  // State for report data
  const [report, setReport] = useState(null);
  
  // Handle generating report
  const handleGenerateReport = () => {
    const reportData = generateReport(
      format(startDate, 'yyyy-MM-dd'),
      format(endDate, 'yyyy-MM-dd'),
      institutionId ? parseInt(institutionId) : null,
      typeId ? parseInt(typeId) : null
    );
    
    setReport(reportData);
  };
  
  // Handle exporting to PDF
  const handleExportPDF = () => {
    if (!report) return;
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Revenue Management System', 105, 15, { align: 'center' });
    
    // Add report details
    doc.setFontSize(14);
    doc.text('Reconciliation Statement', 105, 25, { align: 'center' });
    
    doc.setFontSize(10);
    const periodText = `Period: ${format(new Date(report.startDate), 'dd/MM/yyyy')} - ${format(new Date(report.endDate), 'dd/MM/yyyy')}`;
    doc.text(periodText, 105, 35, { align: 'center' });
    
    doc.text(`Institution: ${report.institutionName}`, 20, 45);
    doc.text(`Receipt Type: ${report.typeName}`, 20, 52);
    
    // Add financial summary
    doc.setFontSize(12);
    doc.text('Financial Summary', 20, 65);
    
    doc.setFontSize(10);
    doc.text('Opening Balance', 30, 75);
    doc.text(`LKR ${report.openingBalance.toLocaleString()}`, 150, 75, { align: 'right' });
    
    doc.text('Add: Total Receipts', 30, 82);
    doc.text(`LKR ${report.totalReceipts.toLocaleString()}`, 150, 82, { align: 'right' });
    
    doc.text('Less: Total Payments', 30, 89);
    doc.text(`LKR ${report.totalPayments.toLocaleString()}`, 150, 89, { align: 'right' });
    
    // Line
    doc.line(30, 94, 170, 94);
    
    // Closing balance
    doc.setFont(undefined, 'bold');
    doc.text('Closing Balance', 30, 101);
    doc.text(`LKR ${report.closingBalance.toLocaleString()}`, 150, 101, { align: 'right' });
    doc.setFont(undefined, 'normal');
    
    // Add transactions table
    if (report.transactions.length > 0) {
      doc.text('Transaction Details', 20, 115);
      
      const tableColumn = ["Date", "Type", "Institution", "Category", "Amount (LKR)"];
      
      const tableRows = report.transactions.map(transaction => [
        format(new Date(transaction.date), 'dd/MM/yyyy'),
        transaction.transactionType === 'receipt' ? 'Receipt' : 'Payment',
        transaction.institutionName,
        transaction.typeName,
        transaction.amount.toLocaleString()
      ]);
      
      doc.autoTable({
        startY: 120,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
      });
    } else {
      doc.text('No transactions found for the selected criteria.', 20, 115);
    }
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Generated on ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 20, doc.internal.pageSize.height - 10);
      doc.text(`Page ${i} of ${pageCount}`, 170, doc.internal.pageSize.height - 10);
    }
    
    doc.save(`revenue-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };
  
  // Handle printing report
  const handlePrint = () => {
    if (!report) return;
    
    // Create a new window with the report content
    const printWindow = window.open('', '_blank');
    
    // Add the content to the window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Revenue Management Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 30px;
            color: #000;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .subtitle {
            font-size: 18px;
            margin-bottom: 15px;
          }
          .details {
            margin-bottom: 20px;
          }
          .details p {
            margin: 5px 0;
          }
          .summary {
            border: 1px solid #ddd;
            padding: 15px;
            margin-bottom: 20px;
            width: 400px;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
          }
          .summary hr {
            border: none;
            border-top: 1px solid #ddd;
            margin: 10px 0;
          }
          .bold {
            font-weight: bold;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          .text-right {
            text-align: right;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            text-align: center;
            color: #666;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Revenue Management System</div>
          <div class="subtitle">Reconciliation Statement</div>
          <div>Period: ${format(new Date(report.startDate), 'dd/MM/yyyy')} to ${format(new Date(report.endDate), 'dd/MM/yyyy')}</div>
        </div>
        
        <div class="details">
          <p><strong>Institution:</strong> ${report.institutionName}</p>
          <p><strong>Receipt Type:</strong> ${report.typeName}</p>
        </div>
        
        <div class="summary">
          <div class="summary-row">
            <span>Opening Balance</span>
            <span>LKR ${report.openingBalance.toLocaleString()}</span>
          </div>
          <div class="summary-row">
            <span>Add: Total Receipts</span>
            <span>LKR ${report.totalReceipts.toLocaleString()}</span>
          </div>
          <div class="summary-row">
            <span>Less: Total Payments</span>
            <span>LKR ${report.totalPayments.toLocaleString()}</span>
          </div>
          <hr />
          <div class="summary-row bold">
            <span>Closing Balance</span>
            <span>LKR ${report.closingBalance.toLocaleString()}</span>
          </div>
        </div>
        
        <h3>Transaction Details</h3>
        ${report.transactions.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Institution</th>
                <th>Category</th>
                <th class="text-right">Amount (LKR)</th>
              </tr>
            </thead>
            <tbody>
              ${report.transactions.map(transaction => `
                <tr>
                  <td>${format(new Date(transaction.date), 'dd/MM/yyyy')}</td>
                  <td>${transaction.transactionType === 'receipt' ? 'Receipt' : 'Payment'}</td>
                  <td>${transaction.institutionName}</td>
                  <td>${transaction.typeName}</td>
                  <td class="text-right">${transaction.amount.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<p>No transactions found for the selected criteria.</p>'}
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Revenue Management System. All rights reserved.</p>
          <p>Generated on ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
        </div>
      </body>
      </html>
    `);
    
    // Wait for content to load, then print
    printWindow.document.close();
    printWindow.addEventListener('load', () => {
      printWindow.focus();
      printWindow.print();
    });
  };

  return (
    <div className="space-y-6 animate-in">
      <h1 className="text-3xl font-bold tracking-tight">
        Reports & Analysis
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Criteria */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Report Criteria</CardTitle>
            <CardDescription>
              Select parameters to generate report.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Institution (Optional)</Label>
              <Select 
                value={institutionId} 
                onValueChange={setInstitutionId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Institutions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Institutions</SelectItem>
                  {institutions.map((institution) => (
                    <SelectItem key={institution.id} value={institution.id.toString()}>
                      {institution.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Receipt Type (Optional)</Label>
              <Select 
                value={typeId} 
                onValueChange={setTypeId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {receiptTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              className="w-full mt-4" 
              onClick={handleGenerateReport}
            >
              Generate Report
            </Button>
          </CardContent>
        </Card>
        
        {/* Report Results */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Report Results</CardTitle>
              <CardDescription>
                Financial summary and transaction details.
              </CardDescription>
            </div>
            
            {report && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleExportPDF}
                >
                  <FileDown size={16} className="mr-2" />
                  Export PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handlePrint}
                >
                  <Printer size={16} className="mr-2" />
                  Print
                </Button>
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            {report ? (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Period
                    </p>
                    <p>
                      {format(new Date(report.startDate), 'dd/MM/yyyy')} - {format(new Date(report.endDate), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Institution
                    </p>
                    <p>{report.institutionName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Receipt Type
                    </p>
                    <p>{report.typeName}</p>
                  </div>
                </div>
                
                {/* Financial Summary */}
                <div className="border rounded-md p-4 bg-muted/20">
                  <h3 className="font-semibold mb-4">Financial Summary</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Opening Balance</span>
                      <span className="font-medium">LKR {report.openingBalance.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Add: Total Receipts</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        LKR {report.totalReceipts.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Less: Total Payments</span>
                      <span className="font-medium text-red-600 dark:text-red-400">
                        LKR {report.totalPayments.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Closing Balance</span>
                        <span className={
                          report.closingBalance >= 0
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-red-600 dark:text-red-400"
                        }>
                          LKR {report.closingBalance.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Transaction Details */}
                <div>
                  <h3 className="font-semibold mb-4">Transaction Details</h3>
                  
                  <div className="overflow-x-auto border rounded-md">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-2 font-medium">Date</th>
                          <th className="text-left p-2 font-medium">Type</th>
                          <th className="text-left p-2 font-medium">Institution</th>
                          <th className="text-left p-2 font-medium">Category</th>
                          <th className="text-right p-2 font-medium">Amount (LKR)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.transactions.map((transaction) => (
                          <tr key={transaction.id} className="border-t hover:bg-muted/50">
                            <td className="p-2">
                              {format(new Date(transaction.date), 'dd/MM/yyyy')}
                            </td>
                            <td className="p-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                transaction.transactionType === 'receipt' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                              }`}>
                                {transaction.transactionType === 'receipt' ? 'Receipt' : 'Payment'}
                              </span>
                            </td>
                            <td className="p-2">
                              {transaction.institutionName}
                            </td>
                            <td className="p-2">
                              {transaction.typeName}
                            </td>
                            <td className="p-2 text-right font-medium">
                              {transaction.amount.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                        
                        {report.transactions.length === 0 && (
                          <tr>
                            <td colSpan="5" className="p-4 text-center text-muted-foreground">
                              No transactions found for the selected criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Select criteria and generate report to view results.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
