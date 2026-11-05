import NextLink from 'next/link';
import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { AppShell } from '../components/AppShell';

export default function HomePage() {
  return (
    <AppShell>
      <Flex minH="70vh" direction="column" align="center" justify="center" px={{ base: '2', md: '6' }} py="12" textAlign="center">
        <Box maxW="4xl">
          <Heading as="h1" fontSize={{ base: '5xl', md: '7xl' }} fontWeight="black" letterSpacing="tight" lineHeight="1.1" color="brand.fg">
            Welcome to Orderly
          </Heading>

          <Stack mt="8" gap="5" fontSize="lg" lineHeight="tall" color="fg.muted">
            <Text>
              Orderly is a small business order manager designed to help you streamline your workflow,
              reduce errors, and keep everything organized in one place.
            </Text>
            <Text>
              With Orderly, you can track deliveries, manage customer notes, and maintain accurate
              records without the usual chaos. Every feature is built to support clarity, accuracy,
              and privacy.
            </Text>
            <Text>
              We believe in accessibility, collaboration, and precision. That means Orderly is
              responsive across devices, easy to use, and designed to reduce mistakes during order
              entry and fulfillment.
            </Text>
          </Stack>

          <Flex mt="10" justify="center">
            <Button asChild colorPalette="brand" size="xl" rounded="xl" px="8" shadow="md">
              <NextLink href="/login">Get Started</NextLink>
            </Button>
          </Flex>
        </Box>
      </Flex>
    </AppShell>
  );
}
