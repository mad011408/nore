"use client";

import { useCallback } from "react";

// Mock auth for development - no authentication required
const MOCK_USER = { id: "dev-user-001" };
const MOCK_ACCESS_TOKEN = "mock-access-token-dev";

export type ConvexAuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  fetchAccessToken: (args?: {
    forceRefreshToken?: boolean;
  }) => Promise<string | null>;
};

export function useAuthFromAuthKit(): ConvexAuthState {
  const fetchAccessToken = useCallback(
    async (): Promise<string | null> => {
      return MOCK_ACCESS_TOKEN;
    },
    [],
  );

  return {
    isLoading: false,
    isAuthenticated: true,
    fetchAccessToken,
  };
}
