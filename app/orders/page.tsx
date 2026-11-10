'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Field,
  Flex,
  Heading,
  Input,
  NativeSelect,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { AppShell, notifyOrdersChanged } from '../../components/AppShell';
import { DeleteOrderDialog } from '../../components/DeleteOrderDialog';
import { Order, OrderCard } from '../../components/OrderCard';
import { PublicOrderBoard } from '../../components/PublicOrderBoard';
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  OrderStatus,
  capOrdersForBoard,
  isOrderStatus,
} from '../../lib/order-status';

type UserSession = {
  id: number | string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'user';
};

type OrderStatusFilter = 'all' | OrderStatus;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<UserSession | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('all');
  const [deleteOrderId, setDeleteOrderId] = useState<number | null>(null);
  const [busyOrder, setBusyOrder] = useState<{
    id: number;
    action: 'update' | 'delete';
  } | null>(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [description, setDescription] = useState('');
  const [orderDate, setOrderDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadPage() {
      try {
        const sessionResponse = await fetch('/api/auth/session');
        const sessionData = await sessionResponse.json();
        if (!sessionResponse.ok)
          throw new Error(
            sessionData.message || 'Unable to verify your session.'
          );
        setUser(sessionData.user);
        await loadOrders();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load orders.');
      } finally {
        setOrdersLoading(false);
      }
    }

    loadPage();
  }, []);

  async function loadOrders() {
    setOrdersLoading(true);
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || 'Unable to load orders.');
      setOrders(data.orders || []);
    } finally {
      setOrdersLoading(false);
    }
  }

  const canManageOrders = user?.role === 'admin' || user?.role === 'staff';
  const filteredOrders =
    statusFilter === 'all'
      ? capOrdersForBoard(orders)
      : orders.filter((order) => order.status === statusFilter);
  const publicView = !canManageOrders;

  async function handleCreateOrder(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setCreatingOrder(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName, description, orderDate }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || 'Unable to create order');

      setSuccess('Order created successfully.');
      setCustomerName('');
      setDescription('');
      setOrderDate(new Date().toISOString().slice(0, 10));
      await loadOrders();
      notifyOrdersChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create order');
    } finally {
      setCreatingOrder(false);
    }
  }

  async function handleAdvance(id: number, status: OrderStatus) {
    setError('');
    setSuccess('');
    setBusyOrder({ id, action: 'update' });
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || 'Unable to update order.');
      await loadOrders();
      setSuccess(
        `Order #${id} is now ${ORDER_STATUS_LABELS[status].toLowerCase()}.`
      );
      notifyOrdersChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update order.');
    } finally {
      setBusyOrder(null);
    }
  }

  async function handleDelete(id: number) {
    setError('');
    setSuccess('');
    setBusyOrder({ id, action: 'delete' });
    try {
      const response = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || 'Unable to delete order.');
      await loadOrders();
      setSuccess(`Order #${id} deleted.`);
      setDeleteOrderId(null);
      notifyOrdersChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete order.');
    } finally {
      setBusyOrder(null);
    }
  }

  return (
    <AppShell>
      <Stack gap="8">
        {canManageOrders && (
          <Box
            as="section"
            rounded="3xl"
            borderWidth="1px"
            bg="bg.panel"
            p="6"
            shadow="xs"
          >
            <Heading as="h2" size="2xl">
              Create an order
            </Heading>
            <form onSubmit={handleCreateOrder}>
              <SimpleGrid mt="5" gap="4" columns={{ base: 1, md: 3 }}>
                <Field.Root required>
                  <Field.Label>Customer name</Field.Label>
                  <Input
                    type="text"
                    size="lg"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </Field.Root>
                <Field.Root required>
                  <Field.Label>Order description</Field.Label>
                  <Input
                    type="text"
                    size="lg"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Field.Root>
                <Field.Root required>
                  <Field.Label>Order date</Field.Label>
                  <Input
                    type="date"
                    size="lg"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                  />
                </Field.Root>
              </SimpleGrid>
              <Flex mt="4" align="center" gap="3" wrap="wrap">
                <Button
                  type="submit"
                  colorPalette="brand"
                  size="lg"
                  loading={creatingOrder}
                  loadingText="Saving order..."
                >
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

        <Box
          as="section"
          rounded="3xl"
          borderWidth="1px"
          bg="bg.panel"
          p="6"
          shadow="xs"
        >
          <Flex mb="6" align="center" justify="space-between">
            <Heading as="h2" size="2xl">
              {publicView ? 'Order status' : 'Current orders'}
            </Heading>
            {!publicView && (
              <Badge size="lg" rounded="full" variant="subtle">
                {filteredOrders.length === orders.length
                  ? `${orders.length} total`
                  : `Showing ${filteredOrders.length} of ${orders.length}`}
              </Badge>
            )}
          </Flex>

          {canManageOrders && (
            <Field.Root mb="5" maxW="xs">
              <Field.Label>Filter by status</Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field
                  value={statusFilter}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (value === 'all' || isOrderStatus(value)) {
                      setStatusFilter(value);
                    }
                  }}
                >
                  <option value="all">Latest orders</option>
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {ORDER_STATUS_LABELS[status]}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Field.Root>
          )}

          {error && (
            <Text mb="4" color="fg.error">
              {error}
            </Text>
          )}
          {success && (
            <Text mb="4" color="fg.success">
              {success}
            </Text>
          )}

          {ordersLoading && orders.length === 0 ? (
            <Text color="fg.muted">Loading orders...</Text>
          ) : publicView ? (
            <PublicOrderBoard orders={orders} />
          ) : filteredOrders.length === 0 ? (
            <Text color="fg.muted">
              {orders.length === 0
                ? 'There are no orders yet.'
                : 'No orders match this status.'}
            </Text>
          ) : (
            <SimpleGrid gap="5" columns={{ base: 1, md: 2, xl: 3 }}>
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  busyAction={
                    busyOrder?.id === order.id ? busyOrder.action : undefined
                  }
                  onAdvance={canManageOrders ? handleAdvance : undefined}
                  onDelete={canManageOrders ? setDeleteOrderId : undefined}
                />
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Stack>
      <DeleteOrderDialog
        orderId={deleteOrderId}
        isDeleting={
          deleteOrderId !== null &&
          busyOrder?.id === deleteOrderId &&
          busyOrder.action === 'delete'
        }
        onClose={() => setDeleteOrderId(null)}
        onConfirm={() => {
          if (deleteOrderId !== null) void handleDelete(deleteOrderId);
        }}
      />
    </AppShell>
  );
}
