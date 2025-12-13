import { NextRequest, NextResponse } from "next/server";

// Mock team invite route for development

export const POST = async (req: NextRequest) => {
  return NextResponse.json(
    { error: "Team features are not available in development mode" },
    { status: 501 }
  );
};

export const DELETE = async (req: NextRequest) => {
  return NextResponse.json(
    { error: "Team features are not available in development mode" },
    { status: 501 }
  );
};
