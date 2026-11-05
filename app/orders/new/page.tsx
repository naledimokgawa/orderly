'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Field, Heading, Input, Stack, Text } from '@chakra-ui/react';
import { AppShell, notifyOrdersChanged } from '../../../components/AppShell';

export default function NewOrderPage() {
  const router = useRouter();
  const [form, setForm] = useState({ customerName: '', description: '', orderDate: new Date().toISOString().slice(0, 10) });
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.message || 'Unable to create order');
      return;
    }

    notifyOrdersChanged();
    router.push('/orders');
  }

  return (
    <AppShell>
      <Box mx="auto" maxW="2xl" rounded="3xl" borderWidth="1px" bg="bg.panel" p={{ base: '6', md: '8' }} shadow="xs">
        <Heading as="h1" size="3xl" fontWeight="black">
          New order
        </Heading>

        <form onSubmit={handleSubmit}>
          <Stack mt="6" gap="5">
            <Field.Root required>
              <Field.Label>Customer name</Field.Label>
              <Input type="text" size="lg" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
            </Field.Root>
            <Field.Root required>
              <Field.Label>Order description</Field.Label>
              <Input type="text" size="lg" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Field.Root>
            <Field.Root required>
              <Field.Label>Order date</Field.Label>
              <Input type="date" size="lg" value={form.orderDate} onChange={(e) => setForm({ ...form, orderDate: e.target.value })} />
            </Field.Root>

            {error && (
              <Text fontSize="sm" color="fg.error">
                {error}
              </Text>
            )}

            <div>
              <Button type="submit" colorPalette="brand" size="lg">
                Save order
              </Button>
            </div>
          </Stack>
        </form>
      </Box>
    </AppShell>
  );
}
