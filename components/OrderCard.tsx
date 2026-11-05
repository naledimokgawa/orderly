import { Badge, Button, Card, Flex, HStack, Heading, Text } from '@chakra-ui/react';

type Order = {
  id: number;
  customer_name: string;
  description: string;
  order_date: string;
  status: 'preparing' | 'done' | 'cancelled';
  created_by_name?: string;
};

export const statusPalette: Record<Order['status'], string> = {
  preparing: 'orange',
  done: 'green',
  cancelled: 'red',
};

export function OrderCard({ order, onDone, onDelete }: { order: Order; onDone?: (id: number) => void; onDelete?: (id: number) => void }) {
  return (
    <Card.Root rounded="2xl" bg="bg.panel" shadow="xs" transition="box-shadow 0.2s" _hover={{ shadow: 'md' }}>
      <Card.Body gap="3">
        <Flex align="flex-start" justify="space-between" gap="3">
          <div>
            <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="widest" color="fg.muted">
              Order #{order.id}
            </Text>
            <Heading size="lg" mt="1">
              {order.customer_name}
            </Heading>
          </div>
          <Badge colorPalette={statusPalette[order.status]} variant="subtle" rounded="full" px="2.5" textTransform="capitalize">
            {order.status}
          </Badge>
        </Flex>

        <Text fontSize="sm" color="fg.muted" lineHeight="tall">
          {order.description}
        </Text>

        <Flex justify="space-between" fontSize="sm" color="fg.subtle">
          <span>{order.order_date}</span>
          {order.created_by_name && <span>By {order.created_by_name}</span>}
        </Flex>
      </Card.Body>

      {(onDone || onDelete) && (
        <Card.Footer>
          <HStack gap="3">
            {onDone && order.status !== 'done' && (
              <Button size="sm" colorPalette="brand" onClick={() => onDone(order.id)}>
                Mark as done
              </Button>
            )}
            {onDelete && (
              <Button size="sm" colorPalette="red" variant="subtle" onClick={() => onDelete(order.id)}>
                Delete
              </Button>
            )}
          </HStack>
        </Card.Footer>
      )}
    </Card.Root>
  );
}
