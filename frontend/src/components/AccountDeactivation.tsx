import { useMyContext } from '@/context/ContextProvider'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { DeleteUserDocument, DeleteUserMutation, DeleteUserMutationVariables, LogoutDocument, LogoutMutation, LogoutMutationVariables } from '@/gql/graphql'
import { useMutation } from '@apollo/client'
import toast from 'react-hot-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

const AccountDeactivation = () => {
    const { user, setUser } = useMyContext()
    const [password, setPassword] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    const [logout] = useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
    
    const [deleteUser, { loading }] = useMutation<DeleteUserMutation, DeleteUserMutationVariables>(
        DeleteUserDocument,
        {
            onCompleted: (data) => {
                toast.success(data.deleteUser.message)
                setIsOpen(false)
                
            },
            onError: (error) => {
                toast.error(error.message)
            }
        }
    );

    const handleAccountDelete = async () => {
        if (!password.trim()) {
            toast.error("Please enter your password");
            return;
        }
    
        try {
            await deleteUser({
                variables: {
                    password: password,
                },
            });
    
            const response = await logout();
            if (response.data?.logout) {
                Cookies.remove('token');
                localStorage.clear();
                setUser(null); 
                router.replace('/Auth/login');
                toast.success('Logout successful!');
                window.location.reload(); 
            }
        } catch (error) {
            console.error("Error deleting account", error);
            toast.error(error.message || "Error occurred during deletion");
        }
    };
    

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Account</h2>
            <p className="text-gray-400 mb-6">Manage your account settings here.</p>
            <div className="space-y-6">
                <div className="bg-gray-400 dark:bg-gray-800 rounded-lg p-4 shadow-md">
                    <div className="flex items-center space-x-4 mb-4">
                        <img
                            src={user?.profilePicture}
                            alt="User Profile"
                            className="w-16 h-16 rounded-full border border-gray-600"
                        />
                        <div>
                            <h3 className="text-lg font-semibold">
                                {user?.firstName} {user?.lastName}
                            </h3>
                            <p className="text-gray-800 dark:text-gray-400">{user?.email}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-400 dark:bg-gray-800 rounded-lg p-4 shadow-md">
                    <div className="flex flex-col space-y-2">
                        <label className="text-lg font-semibold text-red-800 dark:text-red-500">
                            Deactivate Account
                        </label>
                        <p className="text-gray-800 dark:text-gray-400">
                            If you wish to deactivate your account, please click the button below. 
                            Note that this action is irreversible.
                        </p>
                        
                        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-fit">
                                    Deactivate Account
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your
                                        account and remove all your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                
                                <div className="py-4">
                                    <Label htmlFor="password" className="text-right">
                                        Confirm your password
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="mt-2"
                                    />
                                </div>

                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setPassword("")}>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleAccountDelete}
                                        className="bg-red-500 hover:bg-red-600"
                                        disabled={loading}
                                    >
                                        {loading ? "Deactivating..." : "Continue"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountDeactivation