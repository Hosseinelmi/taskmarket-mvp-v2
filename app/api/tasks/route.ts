import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const title = String(body.title ?? "").trim();
    const description = String(body.description ?? "").trim();
    const category = String(body.category ?? "").trim();

    if (!title || !description) {
      return NextResponse.json(
        {
          success: false,
          message: "عنوان و توضیحات درخواست الزامی است."
        },
        { status: 400 }
      );
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          success: false,
          message: "DATABASE_URL تنظیم نشده است."
        },
        { status: 500 }
      );
    }

    const sql = neon(process.env.DATABASE_URL);

    const trackingCode =
      "TM-" +
      Date.now().toString(36).toUpperCase() +
      "-" +
      Math.random().toString(36).substring(2, 6).toUpperCase();

    const result = await sql`
      INSERT INTO tasks (
        tracking_code,
        title,
        description,
        category
      )
      VALUES (
        ${trackingCode},
        ${title},
        ${description},
        ${category}
      )
      RETURNING id, tracking_code, created_at
    `;

    return NextResponse.json({
      success: true,
      message: "درخواست با موفقیت ثبت شد.",
      task
