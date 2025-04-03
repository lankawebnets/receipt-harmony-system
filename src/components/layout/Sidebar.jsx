
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext'; 
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Building, 
  Receipt, 
  FileText,
  Users,
  Database,
  Tag
} from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const { 
    isSuperAdmin, 
    isManager, 
    isDataEntry,
    canManageInstitutions,
    canManageUsers
  } = useAuth();
  
  // Base styles for the sidebar - adjusted to be fixed position
  const sidebarClasses = cn(
    "fixed top-0 left-0 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 z-20 overflow-y-auto",
    isOpen ? "w-64" : "w-16"
  );
  
  // Base styles for navigation items
  const navItemClasses = "flex items-center gap-3 px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md my-1 transition-colors";
  const activeNavItemClasses = "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground";
  
  return (
    <div className={sidebarClasses}>
      <div className="px-4 py-4">
        <div className="flex items-center justify-center md:justify-start">
          <span className={cn(
            "font-bold text-lg text-sidebar-foreground transition-opacity",
            isOpen ? "opacity-100" : "opacity-0 hidden md:inline"
          )}>
            Revenue Management
          </span>
        </div>
      </div>
      
      <nav className="px-2 py-2">
        {/* Dashboard - visible to all users */}
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => 
            cn(navItemClasses, isActive && activeNavItemClasses)
          }
        >
          <LayoutDashboard size={20} />
          <span className={cn(
            "transition-opacity", 
            isOpen ? "opacity-100" : "opacity-0 hidden md:inline"
          )}>
            Dashboard
          </span>
        </NavLink>
        
        {/* Institutions Management - visible to super admin and manager */}
        {canManageInstitutions() && (
          <NavLink 
            to="/institutions" 
            className={({ isActive }) => 
              cn(navItemClasses, isActive && activeNavItemClasses)
            }
          >
            <Building size={20} />
            <span className={cn(
              "transition-opacity", 
              isOpen ? "opacity-100" : "opacity-0 hidden md:inline"
            )}>
              Institutions
            </span>
          </NavLink>
        )}
        
        {/* Receipt Types - visible to super admin and manager */}
        {canManageInstitutions() && (
          <NavLink 
            to="/receipt-types" 
            className={({ isActive }) => 
              cn(navItemClasses, isActive && activeNavItemClasses)
            }
          >
            <Tag size={20} />
            <span className={cn(
              "transition-opacity", 
              isOpen ? "opacity-100" : "opacity-0 hidden md:inline"
            )}>
              Receipt Types
            </span>
          </NavLink>
        )}
        
        {/* Receipts - visible to all users */}
        <NavLink 
          to="/receipts" 
          className={({ isActive }) => 
            cn(navItemClasses, isActive && activeNavItemClasses)
          }
        >
          <Receipt size={20} />
          <span className={cn(
            "transition-opacity", 
            isOpen ? "opacity-100" : "opacity-0 hidden md:inline"
          )}>
            Receipts
          </span>
        </NavLink>
        
        {/* Payments - visible to all users */}
        <NavLink 
          to="/payments" 
          className={({ isActive }) => 
            cn(navItemClasses, isActive && activeNavItemClasses)
          }
        >
          <Receipt size={20} />
          <span className={cn(
            "transition-opacity", 
            isOpen ? "opacity-100" : "opacity-0 hidden md:inline"
          )}>
            Payments
          </span>
        </NavLink>
        
        {/* Reports - visible to all users */}
        <NavLink 
          to="/reports" 
          className={({ isActive }) => 
            cn(navItemClasses, isActive && activeNavItemClasses)
          }
        >
          <FileText size={20} />
          <span className={cn(
            "transition-opacity", 
            isOpen ? "opacity-100" : "opacity-0 hidden md:inline"
          )}>
            Reports
          </span>
        </NavLink>
        
        {/* User Management - visible to super admin only */}
        {canManageUsers() && (
          <NavLink 
            to="/users" 
            className={({ isActive }) => 
              cn(navItemClasses, isActive && activeNavItemClasses)
            }
          >
            <Users size={20} />
            <span className={cn(
              "transition-opacity", 
              isOpen ? "opacity-100" : "opacity-0 hidden md:inline"
            )}>
              Users
            </span>
          </NavLink>
        )}
        
        {/* Database Backup - visible to all users */}
        <NavLink 
          to="/backup" 
          className={({ isActive }) => 
            cn(navItemClasses, isActive && activeNavItemClasses)
          }
        >
          <Database size={20} />
          <span className={cn(
            "transition-opacity", 
            isOpen ? "opacity-100" : "opacity-0 hidden md:inline"
          )}>
            Backup
          </span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
