import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UpdateUserDocument, UpdateUserMutationVariables, UpdateUserMutation } from '@/gql/graphql';
import { toast } from 'react-hot-toast';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { useMyContext } from '@/context/ContextProvider';
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const EditProfile = ({ onCancel }) => {
    const { user, setUser } = useMyContext();
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
    const [gender, setGender] = useState(user?.gender || '');

    const [updateUser] = useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, {
        onCompleted: (data) => {
            toast.success('Profile updated successfully!');
            setUser(data.updateUser);
            onCancel();
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred while updating your profile.');
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            await updateUser({
                variables: {
                    input: {
                        userId: user._id,
                        firstName,
                        lastName,
                        email,
                        gender,
                    },
                },
            });
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="profilePicture">Profile Picture URL</Label>
                <Input
                    id="profilePicture"
                    value={profilePicture}
                    onChange={(e) => setProfilePicture(e.target.value)}
                    placeholder="Enter your profile picture URL"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger id="gender">
                        <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Update Profile</Button>
            </div>
        </form>
    );
}

export default EditProfile;