"use client";

import { useState } from "react";

type TaskResult = {
  category: string;
  skill: string;
  urgency: string;
  mode: string;
};

type TaskResponse = {
  id: number;
  tracking_code: string;
};

type ProposalFormProps = {
  taskId: number;
  providerId: number;
};

function analyzeTask(text: string): TaskResult {
  const value = text.toLowerCase();

  if (
    value.includes("پرینتر") ||
    value.includes("لپ تاپ") ||
    value.includes("لپ‌تاپ") ||
    value.includes("کامپیوتر") ||
    value.includes("مودم") ||
    value.includes("اینترنت") ||
    value.includes("ویندوز")
  ) {
    return {
      category: "فناوری اطلاعات",
      skill: "تعمیر و پشتیبانی IT",
      urgency: "عادی",
      mode: "حضوری یا آنلاین",
    };
  }

  if (
    value.includes("سشوار") ||
    value.includes("جارو") ||
    value.includes("تلویزیون") ||
    value.includes("اسپیکر") ||
    value.includes("تعمیر")
  ) {
    return {
      category: "تعمیرات",
      skill: "تعمیر لوازم و تجهیزات",
      urgency: "عادی",
      mode: "حضوری",
    };
  }

  if (
    value.includes("اکسل") ||
    value.includes("پاورپوینت") ||
    value.includes("ترجمه") ||
    value.includes("تحقیق") ||
    value.includes("برنامه نویسی") ||
    value.includes("برنامه‌نویسی")
  ) {
    return {
      category: "خدمات تخصصی",
      skill: "خدمات دانش و مهارت",
      urgency: "عادی",
      mode: "آنلاین",
    };
  }

  return {
    category: "خدمات",
    skill: "نیاز به بررسی",
    urgency: "عادی",
    mode: "قابل تعیین",
  };
}

export default function HomePage() {
  const [task, setTask] = useState("");
  const [result, setResult] = useState<TaskResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [trackingCode, setTrackingCode] = useState("");
  const [taskId, setTaskId] = useState<number | null>(null);

  const [error, setError] = useState("");

  function handleAnalyze() {
    if (!task.trim()) {
      setError("لطفاً ابتدا درخواست خود را وارد کنید.");
      return;
    }

    const analysis = analyzeTask(task);

    setResult(analysis);
    setSubmitted(false);
    setTrackingCode("");
    setTaskId(null);
    setError("");
  }

  async function handleSubmit() {
    if (!task.trim() || !result || loading) {
      return;
    }

    setLoading(true);
    setSubmitted(false);
    setTrackingCode("");
    setTaskId(null);
    setError("");

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: task.trim().slice(0, 200),
          description: task.trim(),
          category: result.category,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "ثبت درخواست انجام نشد."
        );
      }

      const savedTask: TaskResponse = data.task;

      setSubmitted(true);
      setTrackingCode(savedTask.tracking_code);
      setTaskId(Number(savedTask.id));
    } catch (err) {
      console.error("Task submission error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "خطایی در ثبت درخواست رخ داد."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <header
          style={{
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "#172033",
              color: "#ffffff",
              padding: "8px 18px",
              borderRadius: 30,
              fontSize: 14,
              marginBottom: 20,
            }}
          >
            TaskMarket
          </div>

          <h1
            style={{
              fontSize: "clamp(32px, 6vw, 56px)",
              margin: "10px 0",
              lineHeight: 1.3,
            }}
          >
            هر کاری داری، فقط بگو
          </h1>

          <p
            style={{
              fontSize: 20,
              color: "#667085",
              lineHeight: 1.8,
            }}
          >
            ما آدم مناسبش را پیدا می‌کنیم.
          </p>
        </header>

        <section
          style={{
            background: "#ffffff",
            borderRadius: 24,
            padding: 30,
            boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
          }}
        >
          <label
            htmlFor="task"
            style={{
              display: "block",
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            چه کاری می‌خواهی انجام شود؟
          </label>

          <textarea
            id="task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="مثلاً: پرینترم کار نمی‌کند، دنبال کسی هستم که تعمیرش کند."
            rows={6}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: 16,
              border: "1px solid #d0d5dd",
              borderRadius: 16,
              fontSize: 17,
              lineHeight: 1.8,
              resize: "vertical",
              fontFamily: "Tahoma, Arial, sans-serif",
            }}
          />

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!task.trim()}
            style={{
              width: "100%",
              marginTop: 16,
              padding: 16,
              border: 0,
              borderRadius: 14,
              background: task.trim()
                ? "#172033"
                : "#cbd5e1",
              color: "#ffffff",
              fontSize: 17,
              fontWeight: 700,
              cursor: task.trim()
                ? "pointer"
                : "not-allowed",
            }}
          >
            تحلیل درخواست
          </button>

          {result && (
            <section
              style={{
                marginTop: 24,
                background: "#f8fafc",
                borderRadius: 20,
                padding: 24,
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: 20,
                }}
              >
                تحلیل درخواست
              </h2>

              <div
                style={{
                  display: "grid",
                  gap: 12,
                }}
              >
                <InfoRow
                  label="دسته‌بندی"
                  value={result.category}
                />

                <InfoRow
                  label="مهارت موردنیاز"
                  value={result.skill}
                />

                <InfoRow
                  label="فوریت"
                  value={result.urgency}
                />

                <InfoRow
                  label="نحوه انجام"
                  value={result.mode}
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || submitted}
                style={{
                  width: "100%",
                  marginTop: 24,
                  padding: 16,
                  border: 0,
                  borderRadius: 14,
                  background:
                    loading || submitted
                      ? "#94a3b8"
                      : "#2563eb",
                  color: "#ffffff",
                  fontSize: 17,
                  fontWeight: 700,
                  cursor:
                    loading || submitted
                      ? "default"
                      : "pointer",
                }}
              >
                {loading
                  ? "در حال ثبت درخواست..."
                  : submitted
                  ? "درخواست ثبت شد"
                  : "ثبت درخواست"}
              </button>
            </section>
          )}

          {submitted && trackingCode && (
            <section
              style={{
                marginTop: 24,
                padding: 22,
                borderRadius: 18,
                background: "#ecfdf3",
                color: "#166534",
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                ✅ درخواست شما با موفقیت ثبت شد.
              </div>

              <div style={{ marginBottom: 8 }}>
                کد پیگیری شما:
              </div>

              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  direction: "ltr",
                  textAlign: "center",
                  background: "#ffffff",
                  padding: 12,
                  borderRadius: 12,
                  letterSpacing: 1,
                }}
              >
                {trackingCode}
              </div>

              <p
                style={{
                  marginBottom: 0,
                  lineHeight: 1.8,
                }}
              >
                این کد را برای پیگیری درخواست خود نگه دارید.
              </p>
            </section>
          )}

          {error && (
            <div
              style={{
                marginTop: 20,
                padding: 16,
                borderRadius: 14,
                background: "#fef2f2",
                color: "#b91c1c",
                lineHeight: 1.8,
              }}
            >
              ❌ {error}
            </div>
          )}
        </section>

        {submitted && taskId !== null && (
          <ProposalForm
            taskId={taskId}
            providerId={1}
          />
        )}

        <footer
          style={{
            textAlign: "center",
            marginTop: 40,
            paddingBottom: 30,
            color: "#667085",
            fontSize: 14,
          }}
        >
          TaskMarket — AI-first Task Marketplace
        </footer>
      </div>
    </main>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 20,
        background: "#ffffff",
        padding: "14px 16px",
        borderRadius: 12,
        border: "1px solid #eaecf0",
      }}
    >
      <span
        style={{
          color: "#667085",
        }}
      >
        {label}
      </span>

      <strong>{value}</strong>
    </div>
  );
}

function ProposalForm({
  taskId,
  providerId,
}: ProposalFormProps) {
  const [price, setPrice] = useState("");
  const [days, setDays] = useState("2");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function submitProposal() {
    if (!price || Number(price) <= 0) {
      setError("لطفاً مبلغ پیشنهاد را وارد کنید.");
      return;
    }

    if (!days || Number(days) <= 0) {
      setError("لطفاً زمان انجام را وارد کنید.");
      return;
    }

    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const response = await fetch("/api/proposals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task_id: taskId,
          provider_id: providerId,
          price: Number(price),
          estimated_days: Number(days),
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "ثبت پیشنهاد انجام نشد."
        );
      }

      setSuccess(true);
    } catch (err) {
      console.error("Proposal submission error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "ثبت پیشنهاد انجام نشد."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      style={{
        background: "#ffffff",
        marginTop: 24,
        borderRadius: 24,
        padding: 30,
        boxShadow: "0 10px 35px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ marginTop: 0 }}>
        ثبت پیشنهاد انجام‌دهنده
      </h2>

      <p
        style={{
          color: "#667085",
          lineHeight: 1.8,
        }}
      >
        تعمیرکار تست — تعمیر و پشتیبانی IT
      </p>

      <label
        htmlFor="price"
        style={{
          display: "block",
          fontWeight: 700,
          marginTop: 20,
        }}
      >
        مبلغ پیشنهادی (تومان)
      </label>

      <input
        id="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        type="number"
        min="1"
        placeholder="مثلاً 1500000"
        style={{
          width: "100%",
          boxSizing: "border-box",
          marginTop: 8,
          padding: 14,
          border: "1px solid #d0d5dd",
          borderRadius: 12,
          fontSize: 16,
          fontFamily: "inherit",
        }}
      />

      <label
        htmlFor="days"
        style={{
          display: "block",
          marginTop: 16,
          fontWeight: 700,
        }}
      >
        زمان انجام (روز)
      </label>

      <input
        id="days"
        value={days}
        onChange={(e) => setDays(e.target.value)}
        type="number"
        min="1"
        style={{
          width: "100%",
          boxSizing: "border-box",
          marginTop: 8,
          padding: 14,
          border: "1px solid #d0d5dd",
          borderRadius: 12,
          fontSize: 16,
          fontFamily: "inherit",
        }}
      />

      <label
        htmlFor="message"
        style={{
          display: "block",
          marginTop: 16,
          fontWeight: 700,
        }}
      >
        توضیحات پیشنهاد
      </label>

      <textarea
        id="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        placeholder="توضیح کوتاهی درباره نحوه انجام کار..."
        style={{
          width: "100%",
          boxSizing: "border-box",
          marginTop: 8,
          padding: 14,
          border: "1px solid #d0d5dd",
          borderRadius: 12,
          fontSize: 16,
          resize: "vertical",
          fontFamily: "inherit",
          lineHeight: 1.8,
        }}
      />

      <button
        type="button"
        onClick={submitProposal}
        disabled={loading || success}
        style={{
          width: "100%",
          marginTop: 18,
          padding: 16,
          border: 0,
          borderRadius: 14,
          background:
            loading || success
              ? "#94a3b8"
              : "#2563eb",
          color: "#ffffff",
          fontSize: 17,
          fontWeight: 700,
          cursor:
            loading || success
              ? "default"
              : "pointer",
        }}
      >
        {loading
          ? "در حال ثبت پیشنهاد..."
          : success
          ? "پیشنهاد ثبت شد"
          : "ثبت پیشنهاد"}
      </button>

      {success && (
        <div
          style={{
            marginTop: 18,
            padding: 16,
            borderRadius: 12,
            background: "#ecfdf3",
            color: "#166534",
            lineHeight: 1.8,
          }}
        >
          ✅ پیشنهاد با موفقیت ثبت شد.
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: 18,
            padding: 16,
            borderRadius: 12,
            background: "#fef2f2",
            color: "#b91c1c",
            lineHeight: 1.8,
          }}
        >
          ❌ {error}
        </div>
      )}
    </section>
  );
}
