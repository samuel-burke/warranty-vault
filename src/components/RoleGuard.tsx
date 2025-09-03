import { ReactNode } from "react";
import { useAuth, Permission, UserRole } from "./AuthContext";
import { Alert, AlertDescription } from "./ui/alert";
import { Shield, Lock } from "lucide-react";

interface RoleGuardProps {
  children: ReactNode;
  permission?: Permission;
  role?: UserRole;
  fallback?: ReactNode;
  showAlert?: boolean;
}

export function RoleGuard({ 
  children, 
  permission, 
  role, 
  fallback,
  showAlert = true 
}: RoleGuardProps) {
  const { user, hasPermission, isRole } = useAuth();

  if (!user) {
    return null;
  }

  // Check permission if provided
  if (permission && !hasPermission(permission)) {
    if (fallback) return <>{fallback}</>;
    
    if (showAlert) {
      return (
        <Alert className="border-yellow-200 bg-yellow-50">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access this feature.
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  }

  // Check role if provided
  if (role && !isRole(role)) {
    if (fallback) return <>{fallback}</>;
    
    if (showAlert) {
      return (
        <Alert className="border-yellow-200 bg-yellow-50">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            This feature is restricted to {role} users only.
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  }

  return <>{children}</>;
}

// Convenience components for common use cases
export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard role="admin" fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function ManagerOrAdmin({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const { user } = useAuth();
  const canAccess = user?.role === "admin" || user?.role === "manager";
  
  if (!canAccess) {
    return fallback ? <>{fallback}</> : null;
  }
  
  return <>{children}</>;
}

export function CanEdit({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard permission="edit_assets" fallback={fallback} showAlert={false}>
      {children}
    </RoleGuard>
  );
}

export function CanDelete({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard permission="delete_assets" fallback={fallback} showAlert={false}>
      {children}
    </RoleGuard>
  );
}

export function CanCreate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard permission="create_assets" fallback={fallback} showAlert={false}>
      {children}
    </RoleGuard>
  );
}