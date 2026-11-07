'use client';

import { useEffect, useState } from 'react';
import { Badge, Box, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { AppShell } from '../../../components/AppShell';

type User = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Unable to load users.');
        setUsers(data.users);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load users.');
      }
    }

    loadUsers();
  }, []);

  return (
    <AppShell>
      <Box rounded="3xl" borderWidth="1px" bg="bg.panel" p="6" shadow="xs">
        <Flex mb="6" align="center" justify="space-between" gap="4">
          <div>
            <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase" letterSpacing="widest" color="fg.muted">
              Admin
            </Text>
            <Heading as="h1" mt="2" size="3xl" fontWeight="black">
              Users
            </Heading>
          </div>
          <Badge colorPalette="brand" variant="subtle" size="lg" rounded="full">
            {users.length} users
          </Badge>
        </Flex>

        {error ? (
          <Text color="fg.error">{error}</Text>
        ) : (
          <SimpleGrid gap="4" columns={{ base: 1, md: 2, xl: 3 }}>
            {users.map((user) => (
              <Box key={user.id} rounded="2xl" borderWidth="1px" bg="bg.muted" p="5">
                <Heading as="h2" size="lg">
                  {user.name}
                </Heading>
                <Text mt="2" color="fg.muted">
                  {user.email}
                </Text>
                <Text mt="4" fontSize="xs" color="fg.subtle">
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Box>
    </AppShell>
  );
}
