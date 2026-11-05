'use client';

import { useEffect, useState } from 'react';
import { Badge, Box, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { AppShell } from '../../components/AppShell';

type StaffMember = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  created_at: string;
};

export default function AdminPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);

  useEffect(() => {
    async function loadStaff() {
      const response = await fetch('/api/staff');
      const data = await response.json();
      setStaff(data.staff || []);
    }

    loadStaff();
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
              Staff members
            </Heading>
          </div>
          <Badge colorPalette="brand" variant="subtle" size="lg" rounded="full">
            {staff.length} team members
          </Badge>
        </Flex>

        <SimpleGrid gap="4" columns={{ base: 1, md: 2, xl: 3 }}>
          {staff.map((member) => (
            <Box key={member.id} rounded="2xl" borderWidth="1px" bg="bg.muted" p="5">
              <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="widest" color="fg.muted">
                {member.role}
              </Text>
              <Heading as="h2" mt="2" size="lg">
                {member.name}
              </Heading>
              <Text mt="2" color="fg.muted">
                {member.email}
              </Text>
              <Text mt="4" fontSize="xs" color="fg.subtle">
                Joined {new Date(member.created_at).toLocaleDateString()}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </AppShell>
  );
}
