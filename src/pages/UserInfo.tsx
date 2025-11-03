import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import axiosInstance from "@/lib/axios";
import axios from "axios"; // Keep for axios.isAxiosError

interface UserInfo {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export default function UserInfo() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true);
      
      try {
        const result = await axiosInstance.get('/user/info');
        
        if (result.data?.data) {
          setUserInfo(result.data.data);
          toast.success(result.data?.message || 'User information retrieved successfully');
        }
      } catch (error) {
        const errorMessage = axios.isAxiosError(error) && error.response?.data?.message 
          ? error.response.data.message 
          : 'Failed to fetch user information. Please try again.';
        
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/user/logout');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    }
    catch (error) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.message 
        ? error.response.data.message 
        : 'Failed to logout. Please try again.';
      toast.error(errorMessage);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">User Information</CardTitle>
          <CardDescription>
            Your account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading user information...</p>
            </div>
          ) : userInfo ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm font-medium text-muted-foreground">ID:</span>
                  <span className="text-sm font-mono">{userInfo.id}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm font-medium text-muted-foreground">First Name:</span>
                  <span className="text-sm">{userInfo.first_name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm font-medium text-muted-foreground">Last Name:</span>
                  <span className="text-sm">{userInfo.last_name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm font-medium text-muted-foreground">Email:</span>
                  <span className="text-sm">{userInfo.email}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No user information available</p>
            </div>
          )}
          <div className="pt-4">
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                Logout
              </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

