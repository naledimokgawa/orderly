'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Badge, Box, Button, Field, Flex, Heading, Input, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { AppShell, notifyOrdersChanged } from '../../components/AppShell';
import { OrderCard } from '../../components/OrderCard';

type UserSession = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff';
};

type Order = {
  id: number;
  customer_name: string;
  description: string;
  order_date: string;
  status: 'preparing' | 'done' | 'cancelled';
  created_by_name?: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<UserSession | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [description, setDescription] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem('orderly-user');
    if (raw) {
      setUser(JSON.parse(raw));
    }
    loadOrders();
  }, []);

  async function loadOrders() {
    const response = await fetch('/api/orders');
    const data = await response.json();
    setOrders(data.orders || []);
  }

  async function handleCreateOrder(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName, description, orderDate }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to create order');

      setSuccess('Order created successfully.');
      setCustomerName('');
      setDescription('');
      setOrderDate(new Date().toISOString().slice(0, 10));
      await loadOrders();
      notifyOrdersChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create order');
    }
  }

  async function handleMarkDone(id: number) {
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'done' }),
    });
    await loadOrders();
    notifyOrdersChanged();
  }

  async function handleDelete(id: number) {
    await fetch(`/api/orders/${id}`, { method: 'DELETE' });
    await loadOrders();
    notifyOrdersChanged();
  }

  return (
    <AppShell>
      <Stack gap="8">
        {user && (
          <Box as="section" rounded="3xl" borderWidth="1px" bg="bg.panel" p="6" shadow="xs">
            <Heading as="h2" size="2xl">
              Create an order
            </Heading>
            <form onSubmit={handleCreateOrder}>
              <SimpleGrid mt="5" gap="4" columns={{ base: 1, md: 3 }}>
                <Field.Root required>
                  <Field.Label>Customer name</Field.Label>
                  <Input type="text" size="lg" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                </Field.Root>
                <Field.Root required>
                  <Field.Label>Order description</Field.Label>
                  <Input type="text" size="lg" value={description} onChange={(e) => setDescription(e.target.value)} />
                </Field.Root>
                <Field.Root required>
                  <Field.Label>Order date</Field.Label>
                  <Input type="date" size="lg" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />
                </Field.Root>
              </SimpleGrid>
              <Flex mt="4" align="center" gap="3" wrap="wrap">
                <Button type="submit" colorPalette="brand" size="lg">
                  Save order
                </Button>
                {error && (
                  <Text fontSize="sm" color="fg.error">
                    {error}
                  </Text>
                )}
                {success && (
                  <Text fontSize="sm" color="fg.success">
                    {success}
                  </Text>
                )}
              </Flex>
            </form>
          </Box>
        )}

        <Box as="section" rounded="3xl" borderWidth="1px" bg="bg.panel" p="6" shadow="xs">
          <Flex mb="6" align="center" justify="space-between">
            <Heading as="h2" size="2xl">
              Current orders
            </Heading>
            <Badge size="lg" rounded="full" variant="subtle">
              {orders.length} total
            </Badge>
          </Flex>

          <SimpleGrid gap="5" columns={{ base: 1, md: 2, xl: 3 }}>
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onDone={user ? handleMarkDone : undefined}
                onDelete={user ? handleDelete : undefined}
              />
            ))}
          </SimpleGrid>
        </Box>
      </Stack>
    </AppShell>
  );
}
