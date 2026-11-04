'use client';

import { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Orderly API',
    version: '1.0.0',
    description:
      'Orderly API documentation for staff authentication, order management, and admin controls.',
  },
  servers: [
    { url: 'http://localhost:3000/api', description: 'Local development' },
    { url: 'https://orderly-amber.vercel.app/api', description: 'Production' },
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
        summary: 'Create a new staff account',
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
        summary: 'Get all orders',
        responses: { '200': { description: 'List of orders' } },
      },
      post: {
        summary: 'Create an order',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['customerName', 'description', 'orderDate'],
                properties: {
                  customerName: { type: 'string', example: 'Alicia Stone' },
                  description: { type: 'string', example: '2 grilled chicken wraps and 1 lemonade' },
                  orderDate: { type: 'string', format: 'date', example: '2026-10-09' },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Order created successfully' } },
      },
    },
    '/orders/{id}': {
      get: {
        summary: 'Get one order by id',
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
        summary: 'Update an order',
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
                  status: { type: 'string', enum: ['preparing', 'done', 'cancelled'], example: 'done' },
                  customerName: { type: 'string', example: 'Jordan Smith' },
                  description: { type: 'string', example: 'Updated burger order' },
                  orderDate: { type: 'string', format: 'date', example: '2026-10-09' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Updated order' } },
      },
      delete: {
        summary: 'Delete an order',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Order ID',
          },
        ],
        responses: { '200': { description: 'Deleted order' } },
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
      <div className="mx-auto mt-12 max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black text-slate-800">Orderly API Docs</h1>
        <p className="mt-3 text-slate-600">Sign in to access the interactive API documentation.</p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" className="rounded-xl bg-[#4f46e5] px-5 py-3 font-semibold text-white hover:bg-[#4338ca]">
            Access docs
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"
        >
          Logout from docs
        </button>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <SwaggerUI spec={swaggerSpec as any} tryItOutEnabled />
      </div>
    </div>
  );
}
