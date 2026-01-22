 'use client';                                                                                         
  import { useState } from 'react';                                                                  
  import { useRouter } from 'next/navigation';
  import Link from 'next/link';
  import { useForm } from 'react-hook-form';
  import { zodResolver } from '@hookform/resolvers/zod';
  import { motion } from 'framer-motion';
  import { useAuthStore } from '@/store/auth';
  import { loginSchema, LoginFormData } from '@/lib/validations';
  import { ROUTES } from '@/config/constants';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  import { Logo, LoadingSpinner } from '@/components/common';
  import { AlertCircle, ArrowLeft } from 'lucide-react';

  export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<LoginFormData>({
      resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
      setError('');
      setIsLoading(true);

      try {
        await login(data.email, data.password);
        router.push(ROUTES.DASHBOARD);
      } catch (err: any) {
        setError(err.message || 'Login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="min-h-screen flex bg-gray-50">
        {/* Left - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-rose-500 via-orange-500       
  to-amber-500 p-12 flex-col justify-between">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center       
  justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-2xl font-bold text-white">Hapier</span>
            </Link>
          </div>

          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white mb-4"
            >
              Welcome back!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-white/80"
            >
              Sign in to manage your workforce and keep your team running smoothly.
            </motion.p>
          </div>

          <div className="text-white/60 text-sm">
            © 2026 Hapier. All rights reserved.
          </div>
        </div>

        {/* Right - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8       
  lg:hidden"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>

            <div className="lg:hidden mb-8">
              <Logo size="lg" />
            </div>

            <Card className="border-0 shadow-xl">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50
  rounded-lg"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      className="h-12"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-rose-600 hover:text-rose-700"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="h-12"
                      {...register('password')}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-base font-semibold"    
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Signing in...
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </Button>

                  <p className="text-sm text-gray-600 text-center">
                    Don't have an account?{' '}
                    <Link
                      href="/register"
                      className="text-rose-600 hover:text-rose-700 font-medium"
                    >
                      Create one
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }