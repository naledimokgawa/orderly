'use client';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Field,
  Heading,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import { AppShell } from '../../components/AppShell';
import { Order } from '../../components/OrderCard';
import { PublicOrderBoard } from '../../components/PublicOrderBoard';
import { PasswordInput } from '../../components/ui/password-input';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadPublicOrders() {
      try {
        const response = await fetch('/api/orders?public=true');
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || 'Unable to load current orders.');
        setOrders(data.orders);
      } catch (err) {
        setOrdersError(
          err instanceof Error ? err.message : 'Unable to load current orders.'
        );
      } finally {
        setOrdersLoading(false);
      }
    }

    loadPublicOrders();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || 'Unable to create account');

      setSuccess('Account created successfully. Redirecting to login...');
      setTimeout(() => router.push('/login'), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create account');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <Stack gap="8">
        <Box
          mx="auto"
          w="full"
          maxW="xl"
          rounded="3xl"
          borderWidth="1px"
          bg="bg.panel"
          p={{ base: '6', md: '8' }}
          shadow="xs"
        >
          <Heading
            as="h1"
            mb="6"
            textAlign="center"
            size="3xl"
            fontWeight="extrabold"
          >
            Create an account
          </Heading>

          <form onSubmit={handleSubmit}>
            <Stack gap="5">
              <Field.Root required>
                <Field.Label>Full name</Field.Label>
                <Input
                  id="name"
                  type="text"
                  size="lg"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Email</Field.Label>
                <Input
                  id="email"
                  type="email"
                  size="lg"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Password</Field.Label>
                <PasswordInput
                  id="password"
                  size="lg"
                  minLength={6}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </Field.Root>

              {error && (
                <Alert.Root status="error">
                  <Alert.Indicator />
                  <Alert.Title>{error}</Alert.Title>
                </Alert.Root>
              )}
              {success && (
                <Alert.Root status="success">
                  <Alert.Indicator />
                  <Alert.Title>{success}</Alert.Title>
                </Alert.Root>
              )}

              <Button
                type="submit"
                colorPalette="brand"
                size="lg"
                width="full"
                loading={loading}
                loadingText="Creating account..."
              >
                Sign up
              </Button>
            </Stack>
          </form>

          <Text mt="5" textAlign="center" fontSize="sm" color="fg.muted">
            Already have an account?{' '}
            <Link asChild fontWeight="semibold" color="brand.fg">
              <NextLink href="/login">Login</NextLink>
            </Link>
          </Text>
        </Box>

        <Box
          rounded="3xl"
          borderWidth="1px"
          bg="bg.panel"
          p={{ base: '6', md: '8' }}
          shadow="xs"
        >
          <Stack
            mb="6"
            direction={{ base: 'column', sm: 'row' }}
            align={{ base: 'flex-start', sm: 'center' }}
            justify="space-between"
          >
            <Box>
              <Text
                fontSize="sm"
                fontWeight="semibold"
                textTransform="uppercase"
                letterSpacing="widest"
                color="fg.muted"
              >
                Public order updates
              </Text>
              <Heading as="h2" mt="2" size="2xl">
                Order status
              </Heading>
            </Box>
          </Stack>

          {ordersLoading ? (
            <Text color="fg.muted">Loading current orders...</Text>
          ) : ordersError ? (
            <Text color="fg.error">{ordersError}</Text>
          ) : (
            <PublicOrderBoard orders={orders} />
          )}
        </Box>
      </Stack>
    </AppShell>
  );
}
