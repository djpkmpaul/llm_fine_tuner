import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardFooter } from "@/components/ui/card";
import Header from "@/app/components/header";

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const { username } = await params;

  return (
    <>
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-md shadow-lg rounded-lg bg-white">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-center text-gray-600">{username.toUpperCase()}'s About Page</h2>
        </CardHeader>
        
        <CardContent className="space-y-4 p-4">
          <CardDescription>
            <p className="text-gray-700">
              Welcome to the profile page of <span className="font-bold text-blue-600">{username}</span>.
              Here you can find information about this user, their interests, and more.
            </p>
          </CardDescription>
          <div className="text-sm text-gray-600">
            <p>Feel free to explore the content related to this profile.</p>
          </div>
        </CardContent>
        
        <CardFooter className="text-center text-sm text-gray-500">
          <p>Last updated: January 2025</p>
        </CardFooter>
      </Card>
    </div>
    </>
  );
}
