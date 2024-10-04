import Link from 'next/link'
import { Building, Briefcase, Banknote } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function   SignUp() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="container flex-1 py-12">
        <section className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-bold">Choose Your Role to Get Started</h1>
          <p className="mb-8 text-xl text-muted-foreground">
            Sign up or sign in as a Small Business, Large Business, or Investor to access our platform.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <RoleCard
              icon={<Building className="h-12 w-12" />}
              title="Small Business"
              description="Upload and manage your invoices."
              href="/sb-signup"
            />
            <RoleCard
              icon={<Briefcase className="h-12 w-12" />}
              title="Large Business"
              description="Review and approve invoices from your partners."
              href="/lb-signup"
            />
            <RoleCard
              icon={<Banknote className="h-12 w-12" />}
              title="Investor"
              description="Invest in approved invoices for returns."
              href="/investor-signup"
            />
          </div>
        </section>
      </main>
    </div>
  )
}

function RoleCard({ icon, title, description, href }: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <Card className="flex flex-col transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="mx-auto mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter className="mt-auto px-4">
        <Button asChild className="w-full">
          <Link href={href}>Sign Up / Sign In as {title}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}