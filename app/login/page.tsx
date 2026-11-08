'use client';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Alert, Box, Button, Field, Heading, Input, Link, Stack, Text } from '@chakra-ui/react';
import { AppShell } from '../../components/AppShell';
import { PasswordInput } from '../../components/ui/password-input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to log in');
      }

      localStorage.setItem('orderly-user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <Box mx="auto" maxW="xl" rounded="3xl" borderWidth="1px" bg="bg.panel" p={{ base: '6', md: '8' }} shadow="xs">
        <Heading as="h1" mb="6" textAlign="center" size="3xl" fontWeight="extrabold">
          Login
        </Heading>

        <form onSubmit={handleSubmit}>
          <Stack gap="5">
            <Field.Root required>
              <Field.Label>Email</Field.Label>
              <Input id="email" type="email" size="lg" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field.Root>

            <Field.Root required>
              <Field.Label>Password</Field.Label>
              <PasswordInput id="password" size="lg" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field.Root>

            {error && (
              <Alert.Root status="error">
                <Alert.Indicator />
                <Alert.Title>{error}</Alert.Title>
              </Alert.Root>
            )}

            <Button type="submit" colorPalette="brand" size="lg" width="full" loading={loading} loadingText="Signing in...">
              Login
            </Button>
          </Stack>
        </form>

        <Text mt="5" textAlign="center" fontSize="sm" color="fg.muted">
          Don&apos;t have an account?{' '}
          <Link asChild fontWeight="semibold" color="brand.fg">
            <NextLink href="/signup">Sign up</NextLink>
          </Link>
        </Text>
      </Box>
    </AppShell>
  );
}
