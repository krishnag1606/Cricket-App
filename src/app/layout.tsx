import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { MatchProvider } from '@/context/match-provider';
import { Toaster } from '@/components/ui/toaster';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/sidebar-nav';
import { Button } from '@/components/ui/button';
import { Home, LineChart, List, Settings, Trophy } from 'lucide-react';
import { Logo } from '@/components/icons';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cricket Exchange',
  description: 'A simulated cricket trading exchange application.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Code+Pro&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MatchProvider>
            <SidebarProvider>
              <Sidebar>
                <SidebarHeader>
                    <Link href="/" className="flex items-center gap-2">
                        <Logo className="w-8 h-8 text-primary" />
                        <span className="font-headline text-lg font-semibold">Cricket Exchange</span>
                    </Link>
                </SidebarHeader>
                <SidebarContent>
                  <SidebarNav />
                </SidebarContent>
              </Sidebar>
              <SidebarInset>{children}</SidebarInset>
            </SidebarProvider>
            <Toaster />
          </MatchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
