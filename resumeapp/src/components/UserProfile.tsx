import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Example component showing how to use the authentication system
 * Shows user profile and logout functionality
 */
export function UserProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Please log in to view your profile</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Your Profile
        </CardTitle>
        <CardDescription>Logged in as {user.email}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Name</p>
          <p className="text-lg font-semibold">{user.name}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Email</p>
          <p className="text-lg font-semibold">{user.email}</p>
        </div>

        {user.phone && (
          <div>
            <p className="text-sm font-medium text-gray-500">Phone</p>
            <p className="text-lg font-semibold">{user.phone}</p>
          </div>
        )}

        <div>
          <p className="text-sm font-medium text-gray-500">Member Since</p>
          <p className="text-lg font-semibold">
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        <Button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * Example of protected page usage
 */
export function ExampleProtectedPage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div className="p-4">
      <h1>Welcome, {user?.name}!</h1>
      <p>This is a protected page only visible to logged-in users</p>
    </div>
  );
}
