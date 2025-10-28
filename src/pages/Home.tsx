import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Welcome</CardTitle>
          <CardDescription>
            Get started by signing in or creating an account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link to="/login" className="block">
            <Button className="w-full" size="lg">
              Login
            </Button>
          </Link>
          <Link to="/signup" className="block">
            <Button variant="outline" className="w-full" size="lg">
              Sign Up
            </Button>
          </Link>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-sm text-muted-foreground text-center">
            Navigate to login or sign up to get started
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

