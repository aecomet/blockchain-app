'use client';

import { Signer } from 'ethers';
import React, { Dispatch, createContext, useState } from 'react';

/**
 * アプリケーション全体で使用する Signer を提供するための Context
 */
export const Web3SignerContext = createContext<{
  signer: Signer | null;
  setSigner: Dispatch<Signer | null>;
}>({
  signer: null,
  setSigner: () => {}
});

/**
 *  Signer を提供するための Context Provider
 * @param children {@link React.ReactNode} - 子要素
 * @returns {@link JSX.Element} - Provider
 */
export const Web3SignerContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [signer, setSigner] = useState<Signer | null>(null);

  return <Web3SignerContext.Provider value={{ signer, setSigner }}>{children}</Web3SignerContext.Provider>;
};
