import { Badge, Box, Flex, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { Order, OrderCard } from './OrderCard';
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_PALETTE,
  PUBLIC_ORDER_STATUSES,
} from '../lib/order-status';

const EMPTY_MESSAGES: Record<(typeof PUBLIC_ORDER_STATUSES)[number], string> = {
  pending: 'No orders waiting.',
  preparing: 'Nothing being prepared right now.',
  done: 'No orders finished recently.',
};

/** Public order board: orders grouped into pending, preparing and done columns. */
export function PublicOrderBoard({ orders }: { orders: Order[] }) {
  return (
    <SimpleGrid gap="5" columns={{ base: 1, lg: 3 }}>
      {PUBLIC_ORDER_STATUSES.map((status) => {
        const column = orders.filter((order) => order.status === status);
        return (
          <Box
            key={status}
            as="section"
            aria-label={`${ORDER_STATUS_LABELS[status]} orders`}
            rounded="2xl"
            bg="bg.subtle"
            p="4"
          >
            <Flex mb="4" align="center" justify="space-between">
              <Heading as="h3" size="md">
                {ORDER_STATUS_LABELS[status]}
              </Heading>
              <Badge colorPalette={ORDER_STATUS_PALETTE[status]} variant="subtle" rounded="full">
                {column.length}
              </Badge>
            </Flex>
            {column.length ? (
              <Stack gap="3">
                {column.map((order) => (
                  <OrderCard key={order.id} order={order} publicView />
                ))}
              </Stack>
            ) : (
              <Text fontSize="sm" color="fg.muted">
                {EMPTY_MESSAGES[status]}
              </Text>
            )}
          </Box>
        );
      })}
    </SimpleGrid>
  );
}
