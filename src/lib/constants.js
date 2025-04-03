
// User roles
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  MANAGER: 'manager',
  DATA_ENTRY: 'data_entry'
};

// Mock data for institutions (would come from database in real app)
export const INSTITUTIONS = [
  { id: 1, name: "Ministry of Finance" },
  { id: 2, name: "Department of Labor" },
  { id: 3, name: "Municipal Council" },
  { id: 4, name: "Education Board" },
  { id: 5, name: "Health Department" },
];

// Mock data for receipt types (would come from database in real app)
export const RECEIPT_TYPES = [
  { id: 1, name: "Fines" },
  { id: 2, name: "Stamps" },
  { id: 3, name: "Permits" },
  { id: 4, name: "Taxes" },
  { id: 5, name: "Fees" },
];

// Mock data for users (would come from database in real app)
export const USERS = [
  { 
    id: 1, 
    username: "admin", 
    password: "admin123", // In real app, this would be hashed
    name: "Admin User",
    role: ROLES.SUPER_ADMIN,
    email: "admin@revenue.gov"
  },
  { 
    id: 2, 
    username: "manager", 
    password: "manager123", 
    name: "Manager User",
    role: ROLES.MANAGER,
    email: "manager@revenue.gov"
  },
  { 
    id: 3, 
    username: "dataentry", 
    password: "data123", 
    name: "Data Entry Operator",
    role: ROLES.DATA_ENTRY,
    email: "dataentry@revenue.gov"
  },
];

// Mock transactions data (would come from database in real app)
export const TRANSACTIONS = [
  { 
    id: 1, 
    date: "2024-04-01", 
    institutionId: 1, 
    typeId: 1, 
    amount: 5000, 
    transactionType: "receipt",
    createdBy: 3
  },
  { 
    id: 2, 
    date: "2024-04-01", 
    institutionId: 2, 
    typeId: 2, 
    amount: 3000, 
    transactionType: "receipt",
    createdBy: 3
  },
  { 
    id: 3, 
    date: "2024-04-02", 
    institutionId: 1, 
    typeId: 1, 
    amount: 1000, 
    transactionType: "payment",
    createdBy: 2
  },
  { 
    id: 4, 
    date: "2024-04-03", 
    institutionId: 3, 
    typeId: 3, 
    amount: 7500, 
    transactionType: "receipt",
    createdBy: 2
  },
  { 
    id: 5, 
    date: "2024-04-03", 
    institutionId: 4, 
    typeId: 4, 
    amount: 2500, 
    transactionType: "payment",
    createdBy: 3
  },
];
