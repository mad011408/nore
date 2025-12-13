import { stripe } from "../stripe";
import { getUserID } from "@/lib/auth/get-user-id";
import { NextRequest, NextResponse } from "next/server";

// Mock user details for development
const MOCK_USER_EMAIL = "dev@hackerai.local";
const MOCK_ORG_ID = "mock-org-001";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json().catch(() => ({}));
    const requestedPlan: string | undefined = body?.plan;
    const requestedQuantity: number | undefined = body?.quantity;

    // Get user ID from mock auth
    const userId = await getUserID(req);

    const allowedPlans = new Set([
      "pro-monthly-plan",
      "ultra-monthly-plan",
      "pro-yearly-plan",
      "ultra-yearly-plan",
      "team-monthly-plan",
      "team-yearly-plan",
    ]);

    const subscriptionLevel =
      typeof requestedPlan === "string" && allowedPlans.has(requestedPlan)
        ? (requestedPlan as
            | "pro-monthly-plan"
            | "ultra-monthly-plan"
            | "pro-yearly-plan"
            | "ultra-yearly-plan"
            | "team-monthly-plan"
            | "team-yearly-plan")
        : "pro-monthly-plan";

    // Quantity is only used for team plans, defaults to 1 for individual plans
    const quantity =
      requestedQuantity && requestedQuantity >= 1 ? requestedQuantity : 1;

    // Retrieve price ID from Stripe
    let price;

    try {
      price = await stripe.prices.list({
        lookup_keys: [subscriptionLevel],
      });

      if (!price.data || price.data.length === 0) {
        console.error(
          `No price found for lookup key: ${subscriptionLevel}. Run the setup script \`pnpm run setup\` to create them.`,
        );
        return NextResponse.json(
          {
            error: "Subscription plan not found",
            details: `No price found for plan: ${subscriptionLevel}`,
          },
          { status: 404 },
        );
      }
    } catch (error) {
      console.error(
        `Error retrieving price from Stripe for lookup key: ${subscriptionLevel}.`,
        error,
      );
      return NextResponse.json(
        { error: "Error retrieving price from Stripe" },
        { status: 500 },
      );
    }

    // Check if we have an existing customer
    let customer;

    const existingCustomers = await stripe.customers.list({
      email: MOCK_USER_EMAIL,
      limit: 10,
    });

    const matchingCustomer = existingCustomers.data.find(
      (c) => c.metadata.organizationId === MOCK_ORG_ID,
    );

    if (matchingCustomer) {
      customer = matchingCustomer;
    }

    if (!customer) {
      // Create new Stripe customer
      customer = await stripe.customers.create({
        email: MOCK_USER_EMAIL,
        metadata: {
          organizationId: MOCK_ORG_ID,
          userId: userId,
        },
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_BASE_URL is not configured" },
        { status: 500 },
      );
    }

    const successUrl = new URL(baseUrl);
    successUrl.searchParams.set("refresh", "entitlements");

    if (
      subscriptionLevel === "team-monthly-plan" ||
      subscriptionLevel === "team-yearly-plan"
    ) {
      successUrl.searchParams.set("team-welcome", "true");
    }

    const cancelUrl = new URL(baseUrl);

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      billing_address_collection: "auto",
      line_items: [
        {
          price: price.data[0].id,
          quantity: quantity,
        },
      ],
      mode: "subscription",
      success_url: successUrl.toString(),
      cancel_url: cancelUrl.toString(),
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    console.error(errorMessage, error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};
