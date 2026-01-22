'use client';

  import { motion } from 'framer-motion';
  import { Card, CardContent } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import { Badge } from '@/components/ui/badge';
  import { Check } from 'lucide-react';
  import Link from 'next/link';

  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      description: 'For small teams getting started',
      features: ['Up to 10 employees', 'Basic attendance', 'Leave management', 'Email support'],
      cta: 'Get Started',
      href: '/register',
      highlight: false,
    },
    {
      name: 'Pro',
      price: '₹999',
      period: '/month',
      description: 'For growing businesses',
      features: ['Up to 50 employees', 'Advanced reports', 'Custom leave types', 'Priority support', 'API access'],
      cta: 'Start Free Trial',
      href: '/register',
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations',
      features: ['Unlimited employees', 'Dedicated support', 'Custom integrations', 'SLA guarantee', 'On-premise option'],
      cta: 'Contact Sales',
      href: '/contact',
      highlight: false,
    },
  ];

  export default function Pricing() {
    return (
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <Badge className="mb-4 bg-amber-50 text-amber-600 border-0 px-4 py-1.5">
              Pricing
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Plans that grow with you
            </h2>
            <p className="text-lg text-gray-600">
              Start free, upgrade when you're ready. No hidden fees.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`h-full ${
                    plan.highlight
                      ? 'border-2 border-rose-500 shadow-xl'
                      : 'border-0 shadow-lg'
                  }`}
                >
                  <CardContent className="p-6">
                    {plan.highlight && (
                      <Badge className="mb-4 bg-rose-500 text-white hover:bg-rose-600">        
                        Most Popular
                      </Badge>
                    )}
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>   
                      <span className="text-gray-500">{plan.period}</span>
                    </div>
                    <p className="text-gray-600 mb-6">{plan.description}</p>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-teal-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href={plan.href}>
                      <Button
                        className={`w-full rounded-full ${
                          plan.highlight
                            ? 'bg-gray-900 hover:bg-gray-800 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                        }`}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }
