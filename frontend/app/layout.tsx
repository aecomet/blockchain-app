import { AppMenu } from '@/components/common/AppMenu';
import { Web3SignerContextProvider } from '@/context/web3.context';
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import '@mantine/core/styles.css';
import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Blockchain Sample App',
  description: 'This is a sample application for blockchain development.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider defaultColorScheme="light" theme={{}}>
          <Web3SignerContextProvider>
            <AppMenu>{children}</AppMenu>
          </Web3SignerContextProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
