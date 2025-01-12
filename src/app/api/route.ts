import { connectDB } from "@/config/dbConnection";
import DataModel from "@/models/Data";
import { NextResponse } from "next/server";

// GET request handler
export async function GET() {
  try {
    await connectDB();
    const data = await DataModel.find();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching data" },
      { status: 500 }
    );
  }
}

// POST request handler
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newItem = await DataModel.create(body);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating data" },
      { status: 500 }
    );
  }
}
