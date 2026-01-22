'use client';

  import { useState } from 'react';
  import { useRouter } from 'next/navigation';
  import Link from 'next/link';
  import { useForm } from 'react-hook-form';
  import { zodResolver } from '@hookform/resolvers/zod';
  import { motion } from 'framer-motion';
  import { useAuthStore } from '@/store/auth';
  import { registerSchema, RegisterFormData } from '@/lib/validations';
  import { ROUTES } from '@/config/constants';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from
  '@/components/ui/card';
  import { Logo, LoadingSpinner } from '@/components/common';
  import { AlertCircle, ArrowLeft, Check } from 'lucide-react';

  const benefits = [
    'Free 14-day trial',
    'No credit card required',
    'Cancel anytime',
  ];

  export default function RegisterPage() {
    const router = useRouter();
    const { register: registerUser } = useAuthStore();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<RegisterFormData>({
      resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
      setError('');
      setIsLoading(true);

      try {
        await registerUser({
          email: data.email,
          password: data.password,
          organizationName: data.organizationName,
          firstName: data.firstName,
          lastName: data.lastName,
        });
        router.push(ROUTES.DASHBOARD);
      } catch (err: any) {
        setError(err.message || 'Registration failed. Please try again.');
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
              Start managing your team today
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-white/80 mb-8"
            >
              Join hundreds of companies using Hapier to streamline HR operations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/90">{benefit}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="text-white/60 text-sm">
            © 2026 Hapier. All rights reserved.
          </div>
        </div>

        {/* Right - Form */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
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
                <CardTitle className="text-2xl font-bold">Create account</CardTitle>
                <CardDescription>
                  Get started with your free trial
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        className="h-12"
                        {...register('firstName')}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-500">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        className="h-12"
                        {...register('lastName')}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizationName">Company name</Label>
                    <Input
                      id="organizationName"
                      placeholder="Acme Inc."
                      className="h-12"
                      {...register('organizationName')}
                    />
                    {errors.organizationName && (
                      <p className="text-sm text-red-500">{errors.organizationName.message}</p>      
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Work email</Label>
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
                    <Label htmlFor="password">Password</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="h-12"
                      {...register('confirmPassword')}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>       
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
                        Creating account...
                      </>
                    ) : (
                      'Create account'
                    )}
                  </Button>

                  <p className="text-sm text-gray-600 text-center">
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      className="text-rose-600 hover:text-rose-700 font-medium"
                    >
                      Sign in
                    </Link>
                  </p>

                  <p className="text-xs text-gray-500 text-center">
                    By creating an account, you agree to our{' '}
                    <Link href="/terms" className="underline">Terms</Link> and{' '}
                    <Link href="/privacy" className="underline">Privacy Policy</Link>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }
