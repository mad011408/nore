"use client";

import { ReactNode, useMemo } from "react";
import { ConvexReactClient, ConvexProvider } from "convex/react";
import { createContext, useContext } from "react";

// Check if Convex is available - exported so components can check
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
export const isConvexConfigured = !!CONVEX_URL && CONVEX_URL.length > 0;

// Mock user for development (no authentication required)
const MOCK_USER = {
  id: "dev-user-001",
  email: "dev@hackerai.local",
  firstName: "Dev",
  lastName: "User",
};

// Create auth context for components that need user info
interface MockAuthContextType {
  user: typeof MOCK_USER | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const MockAuthContext = createContext<MockAuthContextType>({
  user: MOCK_USER,
  isLoading: false,
  isAuthenticated: true,
});

export const useAuth = () => useContext(MockAuthContext);

// Context to check if Convex is available at runtime
const ConvexAvailableContext = createContext<boolean>(false);
export const useIsConvexAvailable = () => useContext(ConvexAvailableContext);

// Create Convex client - singleton pattern
// For disabled mode, we need a valid-looking URL that won't actually be used
// The format must be: https://<deployment-name>.convex.cloud
const DISABLED_CONVEX_URL = "https://disabled-placeholder-00000000000000000000.convex.cloud";

let convexClient: ConvexReactClient | null = null;
let disabledClient: ConvexReactClient | null = null;

function getConvexClient(): ConvexReactClient {
  if (isConvexConfigured && CONVEX_URL) {
    if (!convexClient) {
      convexClient = new ConvexReactClient(CONVEX_URL);
    }
    return convexClient;
  } else {
    // Return a disabled client - all queries should use "skip"
    if (!disabledClient) {
      disabledClient = new ConvexReactClient(DISABLED_CONVEX_URL, {
        unsavedChangesWarning: false,
      });
    }
    return disabledClient;
  }
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const authValue = {
    user: MOCK_USER,
    isLoading: false,
    isAuthenticated: true,
  };

  const client = useMemo(() => getConvexClient(), []);

  return (
    <ConvexAvailableContext.Provider value={isConvexConfigured}>
      <MockAuthContext.Provider value={authValue}>
        <ConvexProvider client={client}>
          {children}
        </ConvexProvider>
      </MockAuthContext.Provider>
    </ConvexAvailableContext.Provider>
  );
}
