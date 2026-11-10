'use client';

import { Button, Dialog, Portal } from '@chakra-ui/react';

export function DeleteOrderDialog({
  orderId,
  isDeleting,
  onClose,
  onConfirm,
}: {
  orderId: number | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog.Root
      open={orderId !== null}
      onOpenChange={(event) => {
        if (!event.open && !isDeleting) onClose();
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Delete order?</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Dialog.Description>
                Order #{orderId} will be permanently deleted. This cannot be
                undone.
              </Dialog.Description>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={onClose} disabled={isDeleting}>
                Cancel
              </Button>
              <Button
                colorPalette="red"
                onClick={onConfirm}
                loading={isDeleting}
                loadingText="Deleting..."
              >
                Delete order
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
