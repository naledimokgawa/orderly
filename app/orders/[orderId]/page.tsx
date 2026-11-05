'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Badge, Box, Heading, Stack, Text } from '@chakra-ui/react';
import { AppShell } from '../../../components/AppShell';
import { statusPalette } from '../../../components/OrderCard';

type Order = {
  id: number;
  customer_name: string;
  description: string;
  order_date: string;
  status: 'preparing' | 'done' | 'cancelled';
};

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function loadOrder() {
      const response = await fetch(`/api/orders/${params.orderId}`);
      const data = await response.json();
      setOrder(data.order || null);
    }

    if (params.orderId) {
      loadOrder();
    }
  }, [params.orderId]);

  if (!order) {
    return (
      <AppShell>
        <Box rounded="3xl" borderWidth="1px" bg="bg.panel" p="8" color="fg.muted" shadow="xs">
          Loading order...
        </Box>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Box mx="auto" maxW="2xl" rounded="3xl" borderWidth="1px" bg="bg.panel" p={{ base: '6', md: '8' }} shadow="xs">
        <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase" letterSpacing="widest" color="fg.muted">
          Order #{order.id}
        </Text>
        <Heading as="h1" mt="2" size="3xl" fontWeight="black">
          {order.customer_name}
        </Heading>

        <Stack mt="6" gap="4" color="fg.muted">
          <Text>
            <Text as="span" fontWeight="semibold" color="fg">
              Description:
            </Text>{' '}
            {order.description}
          </Text>
          <Text>
            <Text as="span" fontWeight="semibold" color="fg">
              Date:
            </Text>{' '}
            {order.order_date}
          </Text>
          <Text>
            <Text as="span" fontWeight="semibold" color="fg">
              Status:
            </Text>{' '}
            <Badge colorPalette={statusPalette[order.status]} variant="subtle" rounded="full" textTransform="capitalize">
              {order.status}
            </Badge>
          </Text>
        </Stack>
      </Box>
    </AppShell>
  );
}
