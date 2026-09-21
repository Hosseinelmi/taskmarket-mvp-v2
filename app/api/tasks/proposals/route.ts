import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const taskId = Number(id);

    if (!Number.isInteger(taskId) || taskId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه درخواست معتبر نیست."
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

    const result = await sql`
      SELECT
        p.id,
        p.task_id,
        p.provider_id,
        pr.name AS provider_name,
        pr.skills,
        pr.category,
        pr.city,
        p.price,
        p.estimated_days,
        p.message,
        p.status,
        p.created_at
      FROM proposals p
      JOIN providers pr
        ON pr.id = p.provider_id
      WHERE p.task_id = ${taskId}
      ORDER BY p.created_at ASC
    `;

    return NextResponse.json({
      success: true,
      task_id: taskId,
      proposals: result
    });
  } catch (error) {
    console.error("Get proposals error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "دریافت پیشنهادها انجام نشد."
      },
      { status: 500 }
    );
  }
}
