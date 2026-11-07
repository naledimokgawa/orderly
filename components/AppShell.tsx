'use client';

import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Button,
  CloseButton,
  Container,
  Drawer,
  Flex,
  HStack,
  IconButton,
  Menu,
  Portal,
  Stack,
  Text,
} from '@chakra-ui/react';
import { ColorModeButton } from './ui/color-mode';

type UserSession = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'user';
};

type NavItem = { href: string; label: string };

const ORDERS_CHANGED_EVENT = 'orderly:orders-changed';

/** Call after creating, updating or deleting an order so the header count refreshes. */
export function notifyOrdersChanged() {
  window.dispatchEvent(new Event(ORDERS_CHANGED_EVENT));
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function NavLink({
  item,
  active,
  count,
  onNavigate,
  block,
}: {
  item: NavItem;
  active: boolean;
  count?: number;
  onNavigate?: () => void;
  block?: boolean;
}) {
  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      justifyContent={block ? 'flex-start' : 'center'}
      width={block ? 'full' : 'auto'}
      bg={active ? 'brand.subtle' : undefined}
      color={active ? 'brand.fg' : 'fg.muted'}
      _hover={{ color: 'brand.fg', bg: 'brand.subtle' }}
    >
      <NextLink href={item.href} onClick={onNavigate} aria-current={active ? 'page' : undefined}>
        {item.label}
        {count !== undefined && count > 0 && (
          <Badge colorPalette="accent" variant="solid" size="sm" rounded="full" ms="1.5" title={`${count} orders preparing`}>
            {count}
          </Badge>
        )}
      </NextLink>
    </Button>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [preparingCount, setPreparingCount] = useState<number | undefined>(undefined);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('orderly-user');
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const loadPreparingCount = () => {
      fetch('/api/orders')
        .then((response) => (response.ok ? response.json() : null))
        .then((data: { orders?: { status: string }[] } | null) => {
          if (cancelled || !data) return;
          const orders = data.orders || [];
          setPreparingCount(orders.filter((order) => order.status === 'preparing').length);
        })
        .catch(() => {
          // Leave the count as it was if the request fails.
        });
    };

    loadPreparingCount();
    window.addEventListener(ORDERS_CHANGED_EVENT, loadPreparingCount);
    return () => {
      cancelled = true;
      window.removeEventListener(ORDERS_CHANGED_EVENT, loadPreparingCount);
    };
  }, [user, pathname]);

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    localStorage.removeItem('orderly-user');
    setUser(null);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // no-op
    }
    router.push('/login');
  };

  const handleDeleteAccount = async () => {
    if (!user || !window.confirm(`Permanently delete the account for ${user.email}? This cannot be undone.`)) {
      return;
    }

    setDeletingAccount(true);
    try {
      const response = await fetch('/api/auth/account', { method: 'DELETE' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to delete your account.');
      }

      localStorage.removeItem('orderly-user');
      setUser(null);
      router.push('/signup');
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Unable to delete your account.');
    } finally {
      setDeletingAccount(false);
    }
  };

  const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/signup';
  const visibleNav: NavItem[] = !user || isPublicPage
    ? []
    : user.role === 'admin'
      ? [
          { href: '/orders', label: 'Orders' },
          { href: '/dashboard', label: 'Dashboard' },
          { href: '/admin', label: 'Staff Members' },
          { href: '/admin/users', label: 'Users' },
        ]
      : user?.role === 'staff'
        ? [
            { href: '/orders', label: 'Orders' },
            { href: '/dashboard', label: 'Dashboard' },
          ]
        : [
            { href: '/orders', label: 'Orders' },
            { href: '/dashboard', label: 'Dashboard' },
          ];

  const guestNav: NavItem[] = user
    ? []
    : [
        { href: '/login', label: 'Login' },
        { href: '/signup', label: 'Signup' },
      ];

  const renderNav = (block: boolean) => (
    <>
      {[...guestNav, ...visibleNav].map((item) => (
        <NavLink
          key={item.href}
          item={item}
          active={isActive(item.href)}
          count={item.href === '/orders' ? preparingCount : undefined}
          onNavigate={block ? () => setDrawerOpen(false) : undefined}
          block={block}
        />
      ))}
    </>
  );

  return (
    <Box minH="100vh" bg="bg.canvas" color="fg">
      <Box
        as="header"
        position="sticky"
        top="0"
        zIndex="sticky"
        borderBottomWidth="1px"
        borderColor="border"
        bg="bg.panel/90"
        backdropFilter="blur(8px)"
      >
        <Container maxW="7xl" px={{ base: '4', md: '6' }} py="3">
          <Flex align="center" justify="space-between" gap="4">
            <NextLink href="/">
              <Text fontSize="2xl" fontWeight="extrabold" letterSpacing="tight" color="brand.fg">
                Orderly
              </Text>
            </NextLink>

            <HStack as="nav" gap="1" hideBelow="md" aria-label="Main navigation">
              {renderNav(false)}
            </HStack>

            <HStack gap="2">
              {user && user.role !== 'user' && !isPublicPage && (
                <>
                  <Button asChild colorPalette="brand" size="sm" hideBelow="md">
                    <NextLink href="/orders/new">
                      <PlusIcon /> New order
                    </NextLink>
                  </Button>
                  <IconButton asChild colorPalette="brand" size="sm" hideFrom="md" aria-label="New order">
                    <NextLink href="/orders/new">
                      <PlusIcon />
                    </NextLink>
                  </IconButton>
                </>
              )}

              <ColorModeButton />

              {user && (
                <Menu.Root positioning={{ placement: 'bottom-end' }}>
                  <Menu.Trigger asChild>
                    <Button variant="ghost" size="sm" px="1" rounded="full" aria-label="Account menu">
                      <Avatar.Root size="sm" colorPalette="brand">
                        <Avatar.Fallback name={user.name} />
                      </Avatar.Root>
                    </Button>
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content minW="56">
                        <Box px="3" py="2">
                          <Text fontWeight="semibold">{user.name}</Text>
                          <Text fontSize="sm" color="fg.muted">
                            {user.email}
                          </Text>
                          <Badge mt="2" colorPalette="brand" variant="subtle" textTransform="capitalize">
                            {user.role}
                          </Badge>
                        </Box>
                        <Menu.Separator />
                        <Menu.Item value="logout" onClick={handleLogout} color="fg.error" _hover={{ bg: 'bg.error', color: 'fg.error' }}>
                          Logout
                        </Menu.Item>
                        {Number.isSafeInteger(user.id) && (
                          <Menu.Item
                            value="delete-account"
                            onClick={handleDeleteAccount}
                            disabled={deletingAccount}
                            color="fg.error"
                            _hover={{ bg: 'bg.error', color: 'fg.error' }}
                          >
                            {deletingAccount ? 'Deleting account...' : 'Delete my account'}
                          </Menu.Item>
                        )}
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
              )}

              {(!user || !isPublicPage) && (
                <Drawer.Root open={drawerOpen} onOpenChange={(e) => setDrawerOpen(e.open)} placement="end" size="xs">
                  <Drawer.Trigger asChild>
                    <IconButton variant="ghost" size="sm" hideFrom="md" aria-label="Open menu">
                      <MenuIcon />
                    </IconButton>
                  </Drawer.Trigger>
                  <Portal>
                    <Drawer.Backdrop />
                    <Drawer.Positioner>
                      <Drawer.Content>
                        <Drawer.Header>
                          <Drawer.Title color="brand.fg">Orderly</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>
                          <Stack as="nav" gap="1" aria-label="Main navigation">
                            {renderNav(true)}
                          </Stack>
                        </Drawer.Body>
                        <Drawer.CloseTrigger asChild>
                          <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                      </Drawer.Content>
                    </Drawer.Positioner>
                  </Portal>
                </Drawer.Root>
              )}
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Container as="main" maxW="7xl" px={{ base: '4', md: '6' }} py="8">
        {children}
      </Container>
    </Box>
  );
}
