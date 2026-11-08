import {
  Badge,
  Button,
  Card,
  Flex,
  HStack,
  Heading,
  Text,
} from '@chakra-ui/react';

type Order = {
  id: number;
  status: 'preparing' | 'done' | 'cancelled';
  customer_name?: string;
  customer_first_name?: string;
  description?: string;
  order_date?: string;
  created_by_name?: string;
};

export const statusPalette: Record<Order['status'], string> = {
  preparing: 'orange',
  done: 'green',
  cancelled: 'red',
};

export function OrderCard({
  order,
  onDone,
  onDelete,
  publicView = false,
  busyAction,
}: {
  order: Order;
  onDone?: (id: number) => void;
  onDelete?: (id: number) => void;
  publicView?: boolean;
  busyAction?: 'update' | 'delete';
}) {
  return (
    <Card.Root
      rounded="2xl"
      bg="bg.panel"
      shadow="xs"
      transition="box-shadow 0.2s"
      _hover={{ shadow: 'md' }}
    >
      <Card.Body gap="3">
        <Flex align="flex-start" justify="space-between" gap="3">
          <div>
            <Text
              fontSize="xs"
              fontWeight="semibold"
              textTransform="uppercase"
              letterSpacing="widest"
              color="fg.muted"
            >
              Tracking number
            </Text>
            <Heading size="lg" mt="1" aria-label={`Order ${order.id}`}>
              #{order.id}
            </Heading>
          </div>
          <Badge
            colorPalette={statusPalette[order.status]}
            variant="subtle"
            rounded="full"
            px="2.5"
            textTransform="capitalize"
          >
            {order.status}
          </Badge>
        </Flex>

        {publicView && order.customer_first_name && (
          <Text fontSize="sm" color="fg" fontWeight="semibold">
            {order.customer_first_name}
          </Text>
        )}

        {!publicView && (
          <>
            {order.customer_name && (
              <Text fontSize="sm" color="fg" fontWeight="semibold">
                {order.customer_name}
              </Text>
            )}
            {order.description && (
              <Text fontSize="sm" color="fg.muted" lineHeight="tall">
                {order.description}
              </Text>
            )}

            <Flex justify="space-between" fontSize="sm" color="fg.subtle">
              {order.order_date && <span>{order.order_date}</span>}
              {order.created_by_name && <span>By {order.created_by_name}</span>}
            </Flex>
          </>
        )}
      </Card.Body>

      {(onDone || onDelete) && (
        <Card.Footer>
          <HStack gap="3">
            {onDone && order.status !== 'done' && (
              <Button
                size="sm"
                colorPalette="brand"
                onClick={() => onDone(order.id)}
                disabled={Boolean(busyAction)}
              >
                {busyAction === 'update' ? 'Updating...' : 'Mark as done'}
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                colorPalette="red"
                variant="subtle"
                onClick={() => onDelete(order.id)}
                disabled={Boolean(busyAction)}
              >
                {busyAction === 'delete' ? 'Deleting...' : 'Delete'}
              </Button>
            )}
          </HStack>
        </Card.Footer>
      )}
    </Card.Root>
  );
}
