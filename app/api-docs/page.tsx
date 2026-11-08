'use client';

import { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import {
  Box,
  Button,
  Field,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import 'swagger-ui-react/swagger-ui.css';
import { PasswordInput } from '../../components/ui/password-input';

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Orderly API',
    version: '1.0.0',
    description:
      'Orderly API documentation for authentication, role-based order management, and admin controls.',
  },
  servers: [
    { url: 'http://localhost:3000/api', description: 'Local development' },
    { url: 'https://orderly-pied.vercel.app/api', description: 'Production' },
  ],
  paths: {
    '/auth/login': {
      post: {
        summary: 'Login as a staff member or admin',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'staffmember1@gmail.com' },
                  password: { type: 'string', example: 'staff1' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Successful login' } },
      },
    },
    '/auth/signup': {
      post: {
        summary: 'Create a regular user account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Alex Morgan' },
                  email: { type: 'string', example: 'alex.morgan@example.com' },
                  password: { type: 'string', example: 'newUser123' },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'User created successfully' } },
      },
    },
    '/orders': {
      get: {
        summary:
          'List orders (public requests return preparing order IDs and statuses only)',
        parameters: [
          {
            name: 'public',
            in: 'query',
            required: false,
            schema: { type: 'boolean' },
            description:
              'Set true to view preparing order IDs and statuses without signing in.',
          },
        ],
        responses: {
          '200': { description: 'Orders available to the signed-in role' },
          '401': { description: 'Authentication required' },
        },
      },
      post: {
        summary: 'Create an order (staff and admins only)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['customerName', 'description', 'orderDate'],
                properties: {
                  customerName: { type: 'string', example: 'Alicia Stone' },
                  description: {
                    type: 'string',
                    example: '2 grilled chicken wraps and 1 lemonade',
                  },
                  orderDate: {
                    type: 'string',
                    format: 'date',
                    example: '2026-10-09',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Order created successfully' },
          '401': { description: 'Authentication required' },
          '403': { description: 'Only staff and admins can create orders' },
        },
      },
    },
    '/orders/{id}': {
      get: {
        summary:
          'Get an order by id (users can only view orders being prepared)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Order ID',
          },
        ],
        responses: { '200': { description: 'Single order' } },
      },
      patch: {
        summary: 'Update an order (staff and admins only)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Order ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    enum: ['preparing', 'done', 'cancelled'],
                    example: 'done',
                  },
                  customerName: { type: 'string', example: 'Jordan Smith' },
                  description: {
                    type: 'string',
                    example: 'Updated burger order',
                  },
                  orderDate: {
                    type: 'string',
                    format: 'date',
                    example: '2026-10-09',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Updated order' },
          '401': { description: 'Authentication required' },
          '403': { description: 'Only staff and admins can update orders' },
        },
      },
      delete: {
        summary: 'Delete an order (staff and admins only)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Order ID',
          },
        ],
        responses: {
          '200': { description: 'Deleted order' },
          '401': { description: 'Authentication required' },
          '403': { description: 'Only staff and admins can delete orders' },
        },
      },
    },
    '/staff': {
      get: {
        summary: 'Get all staff members',
        responses: { '200': { description: 'Staff list' } },
      },
    },
  },
};

export default function ApiDocsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function checkAccess() {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      setIsAuthenticated(Boolean(data.user));
    }

    checkAccess();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const response = await fetch('/api/auth/docs/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.message || 'Invalid docs credentials.');
      return;
    }

    setError('');
    setIsAuthenticated(true);
  }

  async function handleLogout() {
    await fetch('/api/auth/docs/logout', { method: 'POST' });
    setIsAuthenticated(false);
  }

  if (!isAuthenticated) {
    return (
      <Box
        mx="auto"
        mt="12"
        maxW="xl"
        rounded="3xl"
        borderWidth="1px"
        bg="bg.panel"
        p="8"
        shadow="xs"
      >
        <Heading as="h1" size="3xl" fontWeight="black">
          Orderly API Docs
        </Heading>
        <Text mt="3" color="fg.muted">
          Sign in to access the interactive API documentation.
        </Text>

        <form onSubmit={handleLogin}>
          <Stack mt="6" gap="4">
            <Field.Root>
              <Field.Label>Username</Field.Label>
              <Input
                size="lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Password</Field.Label>
              <PasswordInput
                size="lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field.Root>

            {error && (
              <Text fontSize="sm" color="fg.error">
                {error}
              </Text>
            )}

            <div>
              <Button type="submit" colorPalette="brand" size="lg">
                Access docs
              </Button>
            </div>
          </Stack>
        </form>
      </Box>
    );
  }

  return (
    <Stack gap="4" p="4">
      <Flex justify="flex-end">
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout from docs
        </Button>
      </Flex>

      {/* Swagger UI has its own light styling, so keep its panel light in dark mode too. */}
      <Box rounded="2xl" bg="white" color="gray.900" p="4" shadow="xs">
        <SwaggerUI spec={swaggerSpec as any} tryItOutEnabled />
      </Box>
    </Stack>
  );
}
