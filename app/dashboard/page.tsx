'use client';

import { useEffect, useState } from 'react';
import { Badge, Box, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { AppShell } from '../../components/AppShell';

type UserSession = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'user';
};

function StatTile({ label, value, palette, capitalize }: { label: string; value: string; palette: string; capitalize?: boolean }) {
  return (
    <Box
      rounded="2xl"
      p="5"
      colorPalette={palette}
      // Dark mode: a faint tint plus a soft border, so tomato/orange don't read as error banners.
      bg={{ base: 'colorPalette.subtle', _dark: 'colorPalette.500/10' }}
      borderWidth="1px"
      borderColor={{ base: 'transparent', _dark: 'colorPalette.500/25' }}
    >
      <Text fontSize="sm" color="colorPalette.fg">
        {label}
      </Text>
      <Text mt="2" fontSize="xl" fontWeight="bold" textTransform={capitalize ? 'capitalize' : undefined} wordBreak="break-word">
        {value}
      </Text>
    </Box>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('orderly-user');
    if (raw) {
      setUser(JSON.parse(raw));
    }
  }, []);

  return (
    <AppShell>
      <Box rounded="3xl" borderWidth="1px" bg="bg.panel" p={{ base: '6', md: '8' }} shadow="xs">
        <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase" letterSpacing="widest" color="fg.muted">
          Dashboard
        </Text>
        <Heading as="h1" mt="3" size="4xl" fontWeight="black">
          Welcome back, {user?.name || 'Team member'}
        </Heading>
        <Text mt="4" fontSize="lg" color="fg.muted">
          {user?.role === 'admin'
            ? 'You are signed in as an administrator and can manage staff members and orders.'
            : user?.role === 'staff'
              ? 'You are signed in as a staff member and can manage daily orders.'
              : 'You are signed in as a user.'}
        </Text>

        <SimpleGrid mt="8" gap="5" columns={{ base: 1, md: 3 }}>
          <StatTile label="Role" value={user?.role || 'user'} palette="brand" capitalize />
          <StatTile label="Email" value={user?.email || 'N/A'} palette="accent" />
          <StatTile label="Status" value="Active" palette="orange" />
        </SimpleGrid>

        {user?.role === 'admin' && (
          <Box mt="8" rounded="2xl" borderWidth="1px" bg="bg.muted" p="5">
            <Flex align="center" justify="space-between" gap="4">
              <div>
                <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase" letterSpacing="widest" color="fg.muted">
                  OAuth status
                </Text>
                <Heading as="h2" mt="2" size="2xl">
                  GitHub authentication
                </Heading>
              </div>
              <Badge colorPalette="green" variant="subtle" size="lg" rounded="full">
                Enabled
              </Badge>
            </Flex>

            <SimpleGrid mt="4" gap="3" columns={{ base: 1, md: 2 }}>
              <Box rounded="xl" bg="bg.panel" p="4">
                <Text fontSize="sm" color="fg.muted">
                  Local callback
                </Text>
                <Text mt="2" fontSize="sm" fontWeight="medium" wordBreak="break-all">
                  http://localhost:3000/api/auth/callback/github
                </Text>
              </Box>
              <Box rounded="xl" bg="bg.panel" p="4">
                <Text fontSize="sm" color="fg.muted">
                  Production callback
                </Text>
                <Text mt="2" fontSize="sm" fontWeight="medium" wordBreak="break-all">
                  https://orderly-amber.vercel.app/api/auth/callback/github
                </Text>
              </Box>
            </SimpleGrid>
          </Box>
        )}
      </Box>
    </AppShell>
  );
}
