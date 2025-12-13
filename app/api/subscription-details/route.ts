import { stripe } from "../stripe";
import { getUserID } from "@/lib/auth/get-user-id";
import { NextRequest, NextResponse } from "next/server";

// Mock user details for development
const MOCK_USER_EMAIL = "dev@hackerai.local";
const MOCK_ORG_ID = "mock-org-001";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json().catch(() => ({}));
    const targetPlan: string | undefined = body?.plan;
    const confirm: boolean = body?.confirm === true;
    const requestedQuantity: number | undefined = body?.quantity;

    const userId = await getUserID(req);

    // Find Stripe customer
    const customers = await stripe.customers.list({
      email: MOCK_USER_EMAIL,
      limit: 10,
    });

    const matchingCustomer = customers.data.find(
      (c) => c.metadata.organizationId === MOCK_ORG_ID,
    );

    if (!matchingCustomer) {
      return NextResponse.json(
        { error: "No Stripe customer found" },
        { status: 404 },
      );
    }

    // Get target price
    const targetPrices = await stripe.prices.list({
      lookup_keys: [targetPlan || "pro-monthly-plan"],
    });

    if (!targetPrices.data || targetPrices.data.length === 0) {
      return NextResponse.json(
        { error: "Target plan price not found" },
        { status: 404 },
      );
    }

    const targetPrice = targetPrices.data[0];
    const targetAmount = targetPrice.unit_amount
      ? targetPrice.unit_amount / 100
      : 0;

    // Validate quantity for team plans
    const isTeamPlan = targetPlan?.includes("team");
    const quantity = isTeamPlan
      ? Math.max(requestedQuantity || 2, 2)
      : 1;

    if (
      isTeamPlan &&
      requestedQuantity !== undefined &&
      requestedQuantity < 2
    ) {
      return NextResponse.json(
        { error: "Team plans require minimum 2 seats" },
        { status: 400 },
      );
    }

    // Get active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: matchingCustomer.id,
      status: "active",
      limit: 1,
    });

    let proratedCredit = 0;
    let currentAmount = 0;
    let totalDue = targetAmount * quantity;
    let additionalCredit = 0;
    let paymentMethodInfo = "";
    let planType: "free" | "pro" | "ultra" | "team" = "free";
    let interval: "monthly" | "yearly" = "monthly";
    let currentPeriodStart: number | null = null;
    let currentPeriodEnd: number | null = null;
    let nextInvoiceAmountEstimate = targetAmount * quantity;
    let proratedAmount = targetAmount * quantity;

    if (subscriptions.data.length > 0) {
      const subscription = subscriptions.data[0];
      const currentPrice = subscription.items.data[0]?.price;

      currentPeriodStart = (subscription as any).current_period_start ?? null;
      currentPeriodEnd = (subscription as any).current_period_end ?? null;

      currentAmount = currentPrice?.unit_amount
        ? currentPrice.unit_amount / 100
        : 0;

      // Determine plan type
      const productId = currentPrice?.product;
      if (productId && typeof productId === "string") {
        try {
          const product = await stripe.products.retrieve(productId);
          const productName = product.name?.toLowerCase() || "";
          const productMetadata = product.metadata || {};
          if (productName.includes("ultra") || productMetadata.plan === "ultra")
            planType = "ultra";
          else if (productName.includes("team") || productMetadata.plan === "team")
            planType = "team";
          else if (productName.includes("pro") || productMetadata.plan === "pro")
            planType = "pro";
        } catch {}
      }

      if (currentPrice?.recurring?.interval === "year") interval = "yearly";
      else if (currentPrice?.recurring?.interval === "month") interval = "monthly";

      // Load payment method
      const defaultPaymentMethod = subscription.default_payment_method as any;
      try {
        if (defaultPaymentMethod) {
          let pm: any = defaultPaymentMethod;
          if (typeof defaultPaymentMethod === "string") {
            pm = await stripe.paymentMethods.retrieve(defaultPaymentMethod);
          }
          if (pm?.type === "card" && pm.card) {
            const brand = (pm.card.brand || "").toUpperCase();
            const last4 = pm.card.last4 || "";
            paymentMethodInfo = `${brand} *${last4}`;
          }
        }
      } catch {}

      // If confirm flag is true, update the subscription
      if (confirm) {
        try {
          const updatedSubscription = await stripe.subscriptions.update(
            subscription.id,
            {
              items: [
                {
                  id: subscription.items.data[0].id,
                  price: targetPrice.id,
                  quantity: quantity,
                },
              ],
              proration_behavior: "always_invoice",
              proration_date: Math.floor(Date.now() / 1000),
              payment_behavior: "pending_if_incomplete",
            },
          );

          return NextResponse.json({
            success: true,
            message: "Subscription updated successfully",
            subscriptionId: updatedSubscription.id,
          });
        } catch (updateError) {
          console.error("Error updating subscription:", updateError);
          const errorMessage = updateError instanceof Error ? updateError.message : "Failed to update subscription";
          return NextResponse.json({ error: errorMessage }, { status: 500 });
        }
      }
    }

    // Return preview details
    return NextResponse.json({
      proratedAmount: Number(proratedAmount.toFixed(2)),
      proratedCredit: Number(proratedCredit.toFixed(2)),
      totalDue: Number(totalDue.toFixed(2)),
      additionalCredit: Number(additionalCredit.toFixed(2)),
      paymentMethod: paymentMethodInfo,
      currentPlan: planType,
      quantity: quantity,
      currentPeriodStart,
      currentPeriodEnd,
      nextInvoiceDate: currentPeriodEnd,
      nextInvoiceAmount: Number(nextInvoiceAmountEstimate.toFixed(2)),
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    console.error("Error calculating upgrade preview:", errorMessage, error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};
