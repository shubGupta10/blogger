'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMyContext } from '@/context/ContextProvider';
import { fetchMostViewedPosts } from '@/Firebase/FirebaseViews';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import AccountDeactivation from '@/components/AccountDeactivation';
import EditProfile from '@/components/EditProfile';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const Settings = () => {
  const [userId, setUserId] = useState<string | undefined>();
  const { user } = useMyContext();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSection, setSelectedSection] = useState('profile');
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (user && user._id) {
      setUserId(user._id);
    }
  }, [user]);

  const handleProfile = (userId: string | undefined) => {
    if (userId) {
      router.push(`/pages/userProfile/${userId}`);
    }
  };

  const handleContact = () => {
    router.push("/pages/Contact");
  };

  fetchMostViewedPosts(10)
    .then(mostViewedPosts => console.log(mostViewedPosts))
    .catch(error => console.error("Error:", error));

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-10">
      <h1 className="text-4xl font-bold mb-2">Settings</h1>
      <p className="text-xl text-muted-foreground mb-10">Manage your account settings</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="col-span-1 border-none">
          <CardContent className="p-4">
            <nav className="flex flex-col space-y-1">
              {['profile', 'account', 'appearance', 'contact'].map((section) => (
                <Button
                  key={section}
                  variant={selectedSection === section ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => setSelectedSection(section)}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </Button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <Card className="col-span-1 md:col-span-3 border-l border-t border-r-0 border-b-0">
          <CardHeader>
            <CardTitle>{selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSection === 'profile' && (
              isEditing ? (
                <EditProfile onCancel={() => setIsEditing(false)} />
              ) : (
                <div className="space-y-4">
                  {['firstName', 'lastName', 'email', 'gender'].map((field) => (
                    <div key={field} className="space-y-2">
                      <label className="text-sm font-medium" htmlFor={field}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        type="text"
                        id={field}
                        className="w-full p-2 rounded-md border border-input bg-background"
                        defaultValue={user?.[field]}
                        readOnly
                      />
                    </div>
                  ))}
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="bio">Bio</label>
                    <textarea
                      id="bio"
                      className="w-full p-2 rounded-md border border-input bg-background"
                      defaultValue="I own a computer."
                      rows={3}
                      readOnly
                    />
                  </div>
                  <Button onClick={() => setIsEditing(true)}>Edit profile</Button>
                </div>
              )
            )}

            {selectedSection === 'account' && <AccountDeactivation />}

            {selectedSection === 'appearance' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Theme Selection</h2>
                <div className="flex space-x-4">
                  {['system', 'dark', 'light'].map((mode) => (
                    <Button
                      key={mode}
                      variant={theme === mode ? "default" : "outline"}
                      onClick={() => setTheme(mode)}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Current theme: {theme}</p>
              </div>
            )}

            {selectedSection === 'contact' && (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  If you have any questions or need assistance, we'd love to hear from you.
                  Please fill out the contact form to share your queries.
                </p>
                <Button onClick={handleContact}>Start the Conversation</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;