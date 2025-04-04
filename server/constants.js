
// Database seeding constants
const ROLES = {
  SUPER_ADMIN: 'super_admin',
  MANAGER: 'manager',
  DATA_ENTRY: 'data_entry',
};

// Sample users for seeding
const USERS = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    username: 'admin',
    password: 'admin123',
    role: ROLES.SUPER_ADMIN,
  },
  {
    id: 2,
    name: 'Manager User',
    email: 'manager@example.com',
    username: 'manager',
    password: 'manager123',
    role: ROLES.MANAGER,
  },
  {
    id: 3,
    name: 'Data Entry User',
    email: 'data@example.com',
    username: 'data',
    password: 'data123',
    role: ROLES.DATA_ENTRY,
  },
];

// Sample institutions for seeding
const INSTITUTIONS = [
  { id: 1, name: 'Ministry of Education' },
  { id: 2, name: 'Health Department' },
  { id: 3, name: 'Agriculture Office' },
  { id: 4, name: 'Local Council' },
  { id: 5, name: 'Public Works' },
];

// Sample receipt types for seeding
const RECEIPT_TYPES = [
  { id: 1, name: 'School Fees' },
  { id: 2, name: 'Medical Fees' },
  { id: 3, name: 'Land Rates' },
  { id: 4, name: 'Business Permit' },
  { id: 5, name: 'Market Fee' },
];

// Sample transactions for seeding
const TRANSACTIONS = [
  {
    id: 1,
    transactionType: 'receipt',
    amount: 5000,
    institutionId: 1,
    typeId: 1,
    date: '2023-01-15',
    receiptNumber: 'REC001',
    description: 'School fees collection',
    createdBy: 1,
  },
  {
    id: 2,
    transactionType: 'receipt',
    amount: 3000,
    institutionId: 2,
    typeId: 2,
    date: '2023-01-20',
    receiptNumber: 'REC002',
    description: 'Hospital fees',
    createdBy: 2,
  },
  {
    id: 3,
    transactionType: 'payment',
    amount: 2000,
    institutionId: 1,
    typeId: 1,
    date: '2023-01-25',
    receiptNumber: 'PAY001',
    description: 'Teacher salary',
    createdBy: 1,
  },
  {
    id: 4,
    transactionType: 'receipt',
    amount: 4000,
    institutionId: 3,
    typeId: 3,
    date: '2023-02-10',
    receiptNumber: 'REC003',
    description: 'Land rates payment',
    createdBy: 3,
  },
  {
    id: 5,
    transactionType: 'payment',
    amount: 1500,
    institutionId: 4,
    typeId: 4,
    date: '2023-02-15',
    receiptNumber: 'PAY002',
    description: 'Office supplies',
    createdBy: 2,
  },
];

module.exports = {
  ROLES,
  USERS,
  INSTITUTIONS,
  RECEIPT_TYPES,
  TRANSACTIONS,
};
