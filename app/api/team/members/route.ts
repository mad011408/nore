import { NextRequest, NextResponse } from "next/server";

// Mock team members route for development

export const GET = async (req: NextRequest) => {
  // Return mock team data for development
  return NextResponse.json({
    members: [
      {
        id: "mock-member-001",
        userId: "dev-user-001",
        email: "dev@hackerai.local",
        firstName: "Dev",
        lastName: "User",
        role: "admin",
        createdAt: new Date().toISOString(),
        isCurrentUser: true,
      },
    ],
    invitations: [],
    teamInfo: {
      teamId: "mock-team-001",
      teamName: "Development Team",
      currentSeats: 1,
      totalSeats: 5,
      availableSeats: 4,
      billingPeriod: "monthly",
    },
    isAdmin: true,
  });
};

export const DELETE = async (req: NextRequest) => {
  return NextResponse.json(
    { error: "Team features are not available in development mode" },
    { status: 501 }
  );
};
