'use client';

import { Web3SignerContext } from '@/context/web3.context';
import { MyERC721, MyERC721__factory } from '@/types';
import { NFT } from '@/types/nft';
import {
  Alert,
  Avatar,
  Button,
  Card,
  Container,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import { IconCubePlus } from '@tabler/icons-react';
import { isError } from 'ethers';
import { useContext, useEffect, useRef, useState } from 'react';

const contractAddress = '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0';

export default function MyNFT() {
  const { signer } = useContext(Web3SignerContext);

  const [myERC721, setMyERC721] = useState<MyERC721 | null>(null);

  useEffect(() => {
    // @dev コントラクトのインスタンスを生成
    const contract = MyERC721__factory.connect(contractAddress, signer);

    setMyERC721(contract);

    const fillAddress = async () => {
      if (ref.current) {
        // @dev　アドレスを取得してフォームにセット
        const address = await signer?.getAddress();

        if (address) {
          ref.current.value = address;
        }
      }
    };

    fillAddress();
  }, [signer]);

  const ref = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [myNFTs, setMyNFTs] = useState<NFT[]>([]);

  const handleButtonClick = async () => {
    setLoading(true);

    try {
      const account = ref.current!.value;

      // @dev NFTを作成
      await myERC721?.safeMint(account, 'https://example.com/nft1.json');

      setShowAlert(true);
      setAlertMessage(
        `NFT minted and sent to the wallet ${account?.slice(0, 6)}...${account?.slice(-2)}. Enjoy your NFT!`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchMyNFTs = async () => {
      const nfts = [];
      if (myERC721 && myERC721.runner) {
        const address = await signer?.getAddress();
        let balance = BigInt(0);

        try {
          balance = await myERC721.balanceOf(address!);
        } catch (e) {
          if (isError(e, 'BAD_DATA')) {
            balance = BigInt(0);
          } else {
            throw e;
          }
        }

        for (let i = 0; i < balance; i++) {
          // @dev トークンIDを取得
          const tokenId = await myERC721.tokenOfOwnerByIndex(address!, i);

          // 画面表示のためのダミーデータ
          const jsonMetaData = {
            name: `NFT ${tokenId}`,
            description: `This is NFT ${tokenId}`,
            image: `https://picsum.photos/id/${tokenId}/200/300`
          };
          nfts.push({ tokenId, ...jsonMetaData });
        }
        setMyNFTs(nfts);
      }
    };

    fetchMyNFTs();
  }, [myERC721, signer]);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  return (
    <div>
      <Title order={1} style={{ paddingBottom: 12 }}>
        {' '}
        My NFT Component
      </Title>
      {showAlert ? (
        <Container py={8}>
          <Alert
            variant="light"
            color="teal"
            title="NFT Minted successfully!"
            withCloseButton
            onClose={() => setShowAlert(false)}
            icon={<IconCubePlus />}
          >
            {alertMessage}
          </Alert>
        </Container>
      ) : null}

      <SimpleGrid cols={{ base: 1, sm: 3, lg: 5 }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section>
            <Container py={12}>
              <Group justify="center">
                <Avatar color="blue" radius="xl">
                  <IconCubePlus size="1.5rem" />
                </Avatar>
                <Text fw={700}>Mint Your NFTs!</Text>
              </Group>
            </Container>
          </Card.Section>

          <Stack>
            <TextInput ref={ref} label="wallet address" placeholder="0x000...." />
            <Button loading={loading} onClick={handleButtonClick}>
              Mint NFT
            </Button>
          </Stack>
        </Card>

        {myNFTs.map((nft, index) => (
          <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <Image src={nft.image} height={160} alt="not-image" />
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={700}>{nft.name}</Text>
              <Button color="blue" variant="light">
                tokenId: {nft.tokenId.toString()}
              </Button>

              <Text size="sm" c="dimend">
                {nft.description}
              </Text>
            </Group>
          </Card>
        ))}
      </SimpleGrid>
    </div>
  );
}
