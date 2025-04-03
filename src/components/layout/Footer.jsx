
import { useTheme } from '@/context/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border py-3 px-4 text-center text-sm text-muted-foreground">
      <div className="container mx-auto">
        <p>© {year} Revenue Management System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
