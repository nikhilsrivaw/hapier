'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/dashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { organizationService } from '@/services/organization.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/common';
import {
    Settings,
    User,
    Building2,
    Shield,
    Mail,
    BadgeCheck,
    Save,
} from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/services';

export default function SettingsPage() {
    const { user, organization } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    // Organization form state
    const [orgName, setOrgName] = useState(organization?.name || '');
    const [orgLogo, setOrgLogo] = useState(organization?.logo || '');
    const [isOrgSaving, setIsOrgSaving] = useState(false);
    const [orgSuccess, setOrgSuccess] = useState('');
    const [orgError, setOrgError] = useState('');

    // Password form state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordSaving, setIsPasswordSaving] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleSaveOrganization = async () => {
        if (!orgName.trim()) {
            setOrgError('Organization name is required');
            return;
        }

        setIsOrgSaving(true);
        setOrgError('');
        setOrgSuccess('');

        try {
            await organizationService.update({ name: orgName, logo: orgLogo || undefined });
            setOrgSuccess('Organization updated successfully');
        } catch (err: any) {
            setOrgError(err.message || 'Failed to update organization');
        } finally {
            setIsOrgSaving(false);
        }
    };

    const handleChangePassword = async () => {
        setPasswordError('');
        setPasswordSuccess('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError('All fields are required');
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        setIsPasswordSaving(true);

        try {
            await authService.changePassword(currentPassword, newPassword);
            setPasswordSuccess('Password changed successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setPasswordError(err.response?.data?.error || 'Failed to change password');
        } finally {
            setIsPasswordSaving(false);
        }
    };

   

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Settings
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage your account and organization settings
                    </p>
                </motion.div>

                {/* Settings Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Tabs defaultValue="profile" className="space-y-6">
                        <TabsList>
                            <TabsTrigger value="profile" className="gap-2">
                                <User className="w-4 h-4" />
                                Profile
                            </TabsTrigger>
                            {isAdmin && (
                                <TabsTrigger value="organization" className="gap-2">
                                    <Building2 className="w-4 h-4" />
                                    Organization
                                </TabsTrigger>
                            )}
                            <TabsTrigger value="security" className="gap-2">
                                <Shield className="w-4 h-4" />
                                Security
                            </TabsTrigger>
                        </TabsList>

                        {/* Profile Tab */}
                        <TabsContent value="profile">
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle>Profile Information</CardTitle>
                                    <CardDescription>
                                        Your account details and role information
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">Email</Label>
                                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <span className="font-medium">{user?.email}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">Role</Label>
                                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                                <BadgeCheck className="w-4 h-4 text-gray-400" />
                                                <span className="font-medium">{user?.role?.replace('_', ' ')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <Label className="text-gray-500">Organization</Label>
                                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                            <Building2 className="w-4 h-4 text-gray-400" />
                                            <span className="font-medium">{organization?.name}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-gray-500">Employee ID</Label>
                                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                            <User className="w-4 h-4 text-gray-400" />
                                            <span className="font-medium">{user?.employeeId || 'N/A'}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Organization Tab (Admin Only) */}
                        {isAdmin && (
                            <TabsContent value="organization">
                                <Card className="border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle>Organization Settings</CardTitle>
                                        <CardDescription>
                                            Update your organization details
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {orgSuccess && (
                                            <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                                                {orgSuccess}
                                            </p>
                                        )}
                                        {orgError && (
                                            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                                                {orgError}
                                            </p>
                                        )}

                                        <div className="space-y-2">
                                            <Label htmlFor="orgName">Organization Name *</Label>
                                            <Input
                                                id="orgName"
                                                value={orgName}
                                                onChange={(e) => setOrgName(e.target.value)}
                                                placeholder="Enter organization name"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="orgLogo">Logo URL</Label>
                                            <Input
                                                id="orgLogo"
                                                value={orgLogo}
                                                onChange={(e) => setOrgLogo(e.target.value)}
                                                placeholder="https://example.com/logo.png"
                                            />
                                            <p className="text-sm text-gray-500">
                                                Enter a URL for your organization logo
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-gray-500">Organization Slug</Label>
                                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                                <span className="font-medium">{organization?.slug}</span>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                Slug cannot be changed
                                            </p>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <Button
                                                onClick={handleSaveOrganization}
                                                disabled={isOrgSaving}
                                                className="bg-rose-600 hover:bg-rose-700"
                                            >
                                                {isOrgSaving ? (
                                                    <LoadingSpinner size="sm" />
                                                ) : (
                                                    <>
                                                        <Save className="w-4 h-4 mr-2" />
                                                        Save Changes
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        )}

                        {/* Security Tab */}
                        <TabsContent value="security">
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle>Change Password</CardTitle>
                                    <CardDescription>
                                        Update your password to keep your account secure
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {passwordSuccess && (
                                        <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                                            {passwordSuccess}
                                        </p>
                                    )}
                                    {passwordError && (
                                        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                                            {passwordError}
                                        </p>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">Current Password *</Label>
                                        <Input
                                            id="currentPassword"
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Enter current password"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password *</Label>
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new password"
                                        />
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button
                                            onClick={handleChangePassword}
                                            disabled={isPasswordSaving}
                                            className="bg-rose-600 hover:bg-rose-700"
                                        >
                                            {isPasswordSaving ? (
                                                <LoadingSpinner size="sm" />
                                            ) : (
                                                <>
                                                    <Shield className="w-4 h-4 mr-2" />
                                                    Change Password
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
