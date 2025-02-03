'use client';
import { Web3SignerContext } from '@/context/web3.context';
import { Alert, Badge, Button, Card, Container, Group, Image, SimpleGrid, Text, Title } from '@mantine/core';
import { Seaport } from '@opensea/seaport-js';
import { OrderWithCounter } from '@opensea/seaport-js/lib/types';
import { IconCubePlus, IconUser } from '@tabler/icons-react';
import { ethers } from 'ethers';
import { ethers as ethersV5 } from 'ethersV5';
import { useContext, useEffect, useState } from 'react';

export default function SellOrders() {
  const { signer } = useContext(Web3SignerContext);

  const [sellOrders, setSellOrders] = useState<OrderWithCounter[]>([]);
  // view state
  const [alert, setAlert] = useState<{ color: string; title: string; message: string } | null>(null);

  const fetchSellOrders = async () => {
    const response = await fetch('/api/order', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log(data);
    setSellOrders(data);
  };

  const seaportAddress = '0xdc64a140aa3e981100a9beca4e685f962f0cf6c9';
  const [mySeaport, setMySeaport] = useState<Seaport | null>(null);

  const buyNft = async (index: number, order: OrderWithCounter) => {
    try {
      const { executeAllActions: executeAllFulfillActions } = await mySeaport!.fulfillOrders({
        fulfillOrderDetails: [{ order }],
        accountAddress: await signer?.getAddress()
      });

      const transaction = await executeAllFulfillActions();

      console.log(transaction); // for debug

      const query = new URLSearchParams({ id: index.toString() });
      fetch(`/api/order?${query}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transaction)
      });

      setAlert({
        color: 'teal',
        title: 'success buy NFT',
        message: 'Now you own the NFT!'
      });
    } catch (error) {
      setAlert({
        color: 'red',
        title: 'Failed to buy NFT',
        message: (error as Error).message
      });
    }
  };

  useEffect(() => {
    if (signer) {
      const { ethereum } = window as never;
      const ethersV5Provider = new ethersV5.providers.Web3Provider(ethereum);
      const ethersV5Signer = ethersV5Provider.getSigner();

      const lSeaport = new Seaport(ethersV5Signer, {
        overrides: {
          contractAddress: seaportAddress
        }
      });

      setMySeaport(lSeaport);
    }
  }, [signer]);

  useEffect(() => {
    fetchSellOrders();
  }, []);

  return (
    <div>
      <Title order={1} style={{ paddingBottom: 12 }}>
        Sell NFT Orders
      </Title>
      {alert ? (
        <Container py={8}>
          <Alert
            variant="light"
            color={alert.color}
            title={alert.title}
            withCloseButton
            onClose={() => setAlert(null)}
            icon={<IconCubePlus />}
          >
            {alert.message}
          </Alert>
        </Container>
      ) : null}
      <SimpleGrid cols={{ base: 1, sm: 3, lg: 5 }}>
        {/* NFT一覧 */}
        {sellOrders.map((order, index) => (
          <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <Image src={`https://picsum.photos/id/${index}/200/300`} height={160} alt="No image" />
            </Card.Section>
            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>{`NFT #${order.parameters.offer[0].identifierOrCriteria}`}</Text>
              <Badge color="red" variant="light">
                tokenId: {order.parameters.offer[0].identifierOrCriteria}
              </Badge>
            </Group>
            <Group mt="xs" mb="xs">
              <IconUser size="2rem" stroke={1.5} />
              <Text size="md" c="dimmed">
                {order.parameters.consideration[0].recipient.slice(0, 6) +
                  '...' +
                  order.parameters.consideration[0].recipient.slice(-2)}
              </Text>
            </Group>
            <Group mt="xs" mb="xs">
              <Text fz="lg" fw={700}>
                {`Price: ${ethers.formatEther(BigInt(order.parameters.consideration[0].startAmount))} ether`}
              </Text>
              <Button
                variant="light"
                color="red"
                mt="xs"
                radius="xl"
                style={{ flex: 1 }}
                onClick={() => {
                  buyNft(index, order);
                }}
              >
                Buy this NFT
              </Button>
            </Group>
          </Card>
        ))}
      </SimpleGrid>
    </div>
  );
}
