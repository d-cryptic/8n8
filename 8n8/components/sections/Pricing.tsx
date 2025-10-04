'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import NumberFlow from '@number-flow/react';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import { useState } from 'react';

const plans = [
  {
    id: 'hobby',
    name: 'Hobby',
    price: {
      monthly: 'Free forever',
      yearly: 'Free forever',
    },
    description:
      'The perfect starting place for your web app or personal project.',
    features: [
      '50 API calls / month',
      '60 second checks',
      'Single-user account',
      '5 triggers',
      'Basic email support',
    ],
    cta: 'Coming soon',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: {
      monthly: 90,
      yearly: 75,
    },
    description: 'Everything you need to build and scale your business.',
    features: [
      'Unlimited API calls',
      '30 second checks',
      'Multi-user account',
      '10 triggers',
      'Priority email support',
    ],
    cta: 'Coming soon',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: {
      monthly: 'Get in touch for pricing',
      yearly: 'Get in touch for pricing',
    },
    description: 'Critical security, performance, observability and support.',
    features: [
      'You can DDOS our API.',
      'Nano-second checks.',
      'Invite your extended family.',
      'Unlimited monitors.',
      "We'll sit on your desk.",
    ],
    cta: 'Coming soon',
  },
];

const Pricing = () => {
  const [frequency, setFrequency] = useState<string>('monthly');

  return (
    <div className="not-prose flex flex-col gap-16 px-8 py-24 text-center" id="pricing">
      <div className="flex flex-col items-center justify-center gap-8">
        <h1 className="mb-0 text-balance font-medium text-5xl tracking-tighter!">
          Simple, transparent pricing
        </h1>
        <p className="mx-auto mt-0 mb-0 max-w-2xl text-balance text-lg text-muted-foreground">
					We're still in beta, so we're offering a free forever plan.
        </p>
        <Tabs defaultValue={frequency} onValueChange={setFrequency}>
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">
              Yearly
              <Badge variant="secondary">20% off</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="mt-8 grid w-full max-w-4xl gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              className={cn(
                'relative w-full text-left',
                plan.popular && 'ring-2 ring-primary'
              )}
              key={plan.id}
            >
              {plan.popular && (
                <Badge className="-translate-x-1/2 -translate-y-1/2 absolute top-0 left-1/2 rounded-full">
                  Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="font-medium text-xl">
                  {plan.name}
                </CardTitle>
                <CardDescription>
                  <p>{plan.description}</p>
                  {typeof plan.price[frequency as keyof typeof plan.price] ===
                  'number' ? (
                    <NumberFlow
                      className="font-medium text-foreground"
                      format={{
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                      }}
                      suffix={`/month, billed ${frequency}.`}
                      value={
                        plan.price[
                          frequency as keyof typeof plan.price
                        ] as number
                      }
                    />
                  ) : (
                    <span className="font-medium text-foreground">
                      {plan.price[frequency as keyof typeof plan.price]}.
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                {plan.features.map((feature, index) => (
                  <div
                    className="flex items-center gap-2 text-muted-foreground text-sm"
                    key={index}
                  >
                    <BadgeCheck className="h-4 w-4" />
                    {feature}
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'secondary'}
                >
                  {plan.cta}
                  {/* <ArrowRight className="ml-2 h-4 w-4" /> */}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;

