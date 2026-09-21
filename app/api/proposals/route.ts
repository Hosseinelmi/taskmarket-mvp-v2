import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const taskId = Number(body.task_id);
    const providerId = Number(body.provider_id);
    const price = Number(body.price);
    const estimatedDays = Number(body.estimated_days ?? 1);
    const message = String(body.message ?? "").trim();

    if (
      !Number.isInteger(taskId) ||
      !Number.isInteger(providerId) ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "اطلاعات پیشنهاد معتبر نیست."
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

    const task = await sql`
      SELECT id
      FROM tasks
      WHERE id = ${taskId}
      LIMIT 1
    `;

    if (task.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "درخواست موردنظر پیدا نشد."
        },
        { status: 404 }
      );
    }

    const provider = await sql`
      SELECT id
      FROM providers
      WHERE id = ${providerId}
      AND status = 'ACTIVE'
      LIMIT 1
    `;

    if (provider.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "انجام‌دهنده موردنظر پیدا نشد."
        },
        { status: 404 }
      );
    }

    const existingProposal = await sql`
      SELECT id
      FROM proposals
      WHERE task_id = ${taskId}
      AND provider_id = ${providerId}
      AND status = 'PENDING'
      LIMIT 1
    `;

    if (existingProposal.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "این انجام‌دهنده قبلاً برای این درخواست پیشنهاد داده است."
        },
        { status: 409 }
      );
    }

    const result = await sql`
      INSERT INTO proposals (
        task_id,
        provider_id,
        price,
        estimated_days,
        message
      )
      VALUES (
        ${taskId},
        ${providerId},
        ${price},
        ${estimatedDays},
        ${message}
      )
      RETURNING
        id,
        task_id,
        provider_id,
        price,
        estimated_days,
        message,
        status,
        created_at
    `;

    return NextResponse.json({
      success: true,
      message: "پیشنهاد با موفقیت ثبت شد.",
      proposal: result[0]
    });
  } catch (error) {
    console.error("Proposal creation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "ثبت پیشنهاد انجام نشد."
      },
      { status: 500 }
    );
  }
}
