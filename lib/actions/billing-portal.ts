"use server";

import { redirect } from "next/navigation";
import { stripe } from "../../app/api/stripe";

// Mock user ID for development
const MOCK_USER_ID = "dev-user-001";

export default async function redirectToBillingPortal() {
  // In development mode with mock auth, redirect to home
  // In production, you would create a Stripe billing portal session

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // For development without real Stripe, just redirect to home
  // In production, you would get the customer ID from your database
  try {
    // Try to create billing portal session if stripe customer exists
    // For now, just redirect to home
    redirect(baseUrl);
  } catch (error) {
    console.error("Billing portal error:", error);
    redirect(baseUrl);
  }
}
