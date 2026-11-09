import {
  Badge,
  Button,
  Card,
  Flex,
  HStack,
  Heading,
  Text,
} from '@chakra-ui/react';
import {
  NEXT_ORDER_STATUS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_PALETTE,
  OrderStatus,
} from '../lib/order-status';

export type Order = {
  id: number;
  status: OrderStatus;
  customer_name?: string;
  customer_first_name?: string;
  description?: string;
  order_date?: string;
  created_by_name?: string;
};

export function OrderCard({
  order,
  onAdvance,
  onDelete,
  publicView = false,
  busyAction,
}: {
  order: Order;
  onAdvance?: (id: number, status: OrderStatus) => void;
  onDelete?: (id: number) => void;
  publicView?: boolean;
  busyAction?: 'update' | 'delete';
}) {
  const nextStep = NEXT_ORDER_STATUS[order.status];

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
            colorPalette={ORDER_STATUS_PALETTE[order.status]}
            variant="subtle"
            rounded="full"
            px="2.5"
          >
            {ORDER_STATUS_LABELS[order.status]}
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

      {(onAdvance || onDelete) && (
        <Card.Footer>
          <HStack gap="3">
            {onAdvance && nextStep && (
              <Button
                size="sm"
                colorPalette="brand"
                onClick={() => onAdvance(order.id, nextStep.status)}
                disabled={Boolean(busyAction)}
              >
                {busyAction === 'update' ? 'Updating...' : nextStep.action}
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
