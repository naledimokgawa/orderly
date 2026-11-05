'use client';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Alert, Box, Button, Field, Heading, Input, Link, Stack, Text } from '@chakra-ui/react';
import { AppShell } from '../../components/AppShell';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

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
      if (!response.ok) throw new Error(data.message || 'Unable to create account');

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
      <Box mx="auto" maxW="xl" rounded="3xl" borderWidth="1px" bg="bg.panel" p={{ base: '6', md: '8' }} shadow="xs">
        <Heading as="h1" mb="6" textAlign="center" size="3xl" fontWeight="extrabold">
          Create an account
        </Heading>

        <form onSubmit={handleSubmit}>
          <Stack gap="5">
            <Field.Root required>
              <Field.Label>Full name</Field.Label>
              <Input id="name" type="text" size="lg" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field.Root>

            <Field.Root required>
              <Field.Label>Email</Field.Label>
              <Input id="email" type="email" size="lg" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field.Root>

            <Field.Root required>
              <Field.Label>Password</Field.Label>
              <Input
                id="password"
                type="password"
                size="lg"
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />            </Field.Root>

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

            <Button type="submit" colorPalette="brand" size="lg" width="full" loading={loading} loadingText="Creating account...">
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
    </AppShell>
  );
}
