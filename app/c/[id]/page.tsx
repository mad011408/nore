"use client";

import { Chat } from "../../components/chat";
import Loading from "@/components/ui/loading";
import PricingDialog from "../../components/PricingDialog";
import { usePricingDialog } from "../../hooks/usePricingDialog";
import { useGlobalState } from "../../contexts/GlobalState";
import { use } from "react";

// Mock authentication components for development mode
const Authenticated = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const Unauthenticated = ({ children }: { children: React.ReactNode }) => null;
const AuthLoading = ({ children }: { children: React.ReactNode }) => null;

export default function Page(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const chatId = params.id;
  const { subscription } = useGlobalState();
  const { showPricing, handleClosePricing } = usePricingDialog(subscription);

  return (
    <>
      <AuthLoading>
        <div className="h-full bg-background flex flex-col overflow-hidden">
          <div className="flex-1 flex items-center justify-center">
            <Loading />
          </div>
        </div>
      </AuthLoading>

      <Authenticated>
        <Chat chatId={chatId} autoResume={true} />
      </Authenticated>

      <Unauthenticated>
        <div className="h-full bg-background flex flex-col overflow-hidden">
          <div className="flex-1 flex items-center justify-center">
            <Loading />
          </div>
        </div>
      </Unauthenticated>

      <PricingDialog isOpen={showPricing} onClose={handleClosePricing} />
    </>
  );
}
