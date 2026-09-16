
"use client";

import { useState } from "react";

type TaskResult = {
  category: string;
  skill: string;
  urgency: string;
  mode: string;
};

function analyzeTask(text: string): TaskResult {
  const value = text.toLowerCase();

  if (
    value.includes("پرینتر") ||
    value.includes("لپ تاپ") ||
    value.includes("کامپیوتر") ||
    value.includes("مودم") ||
    value.includes("اینترنت") ||
    value.includes("ویندوز")
  ) {
    return {
      category: "فناوری اطلاعات",
      skill: "تعمیر و پشتیبانی IT",
      urgency: "عادی",
      mode: "حضوری یا آنلاین"
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
      mode: "حضوری"
    };
  }

  if (
    value.includes("اکسل") ||
    value.includes("پاورپوینت") ||
    value.includes("ترجمه") ||
    value.includes("تحقیق") ||
    value.includes("برنامه نویسی")
  ) {
    return {
      category: "خدمات تخصصی",
      skill: "خدمات دانش و مهارت",
      urgency: "عادی",
      mode: "آنلاین"
    };
  }

  return {
    category: "خدمات",
    skill: "نیاز به بررسی",
    urgency: "عادی",
    mode: "قابل تعیین"
  };
}

export default function HomePage() {
  const [task, setTask] = useState("");
  const [result, setResult] = useState<TaskResult | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleAnalyze() {
    if (!task.trim()) return;

    const analysis = analyzeTask(task);

    setResult(analysis);
    setSubmitted(false);
  }

  function handleSubmit() {
    if (!task.trim()) return;

    setSubmitted(true);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto"
        }}
      >
        <header
          style={{
            textAlign: "center",
            marginBottom: 40
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "#172033",
              color: "white",
              padding: "8px 18px",
              borderRadius: 30,
              fontSize: 14,
              marginBottom: 20
            }}
          >
            TaskMarket
          </div>

          <h1
            style={{
              fontSize: "clamp(32px, 6vw, 56px)",
              margin: "10px 0",
              lineHeight: 1.3
            }}
          >
            هر کاری داری،222 فقط بگو
          </h1>

          <p
            style={{
              fontSize: 20,
              color: "#667085",
              lineHeight: 1.8
            }}
          >
            ما آدم مناسبش را پیدا می‌کنیم.
          </p>
        </header>

        <section
          style={{
            background: "white",
            borderRadius: 24,
            padding: 30,
            boxShadow: "0 10px 35px rgba(0,0,0,0.08)"
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 12
            }}
          >
            چه کاری می‌خواهی انجام شود؟
          </label>

          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="مثلاً: سشوارم خراب شده، دنبال کسی هستم که با هزینه مناسب تعمیرش کند."
            rows={5}
            style={{
              width: "100%",
              boxSizing: "border-box",
              border: "1px solid #d0d5dd",
              borderRadius: 16,
              padding: 18,
              fontSize: 16,
              resize: "vertical",
              outline: "none",
              fontFamily: "inherit"
            }}
          />

          <button
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
                : "#d0d5dd",
              color: "white",
              fontSize: 17,
              fontWeight: 700,
              cursor: task.trim()
                ? "pointer"
                : "not-allowed"
            }}
          >
            تحلیل درخواست
          </button>
        </section>

        {result && (
          <section
            style={{
              background: "white",
              marginTop: 24,
              borderRadius: 24,
              padding: 30,
              boxShadow: "0 10px 35px rgba(0,0,0,0.06)"
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              برداشت اولیه TaskMarket
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(180px,1fr))",
                gap: 15,
                marginTop: 20
              }}
            >
              <Info
                title="دسته‌بندی"
                value={result.category}
              />

              <Info
                title="مهارت موردنیاز"
                value={result.skill}
              />

              <Info
                title="فوریت"
                value={result.urgency}
              />

              <Info
                title="نحوه انجام"
                value={result.mode}
              />
            </div>

            <button
              onClick={handleSubmit}
              style={{
                width: "100%",
                marginTop: 24,
                padding: 16,
                border: 0,
                borderRadius: 14,
                background: "#16a34a",
                color: "white",
                fontSize: 17,
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              ثبت درخواست
            </button>

            {submitted && (
              <div
                style={{
                  marginTop: 20,
                  padding: 18,
                  borderRadius: 14,
                  background: "#ecfdf3",
                  color: "#166534",
                  lineHeight: 1.8
                }}
              >
                درخواست شما با موفقیت ثبت شد.
                <br />
                در مرحله بعد متخصصان مناسب می‌توانند
                پیشنهاد خود را ارسال کنند.
              </div>
            )}
          </section>
        )}

        <footer
          style={{
            textAlign: "center",
            marginTop: 40,
            color: "#98a2b3",
            fontSize: 14
          }}
        >
          TaskMarket — AI-first Task Marketplace
        </footer>
      </div>
    </main>
  );
}

function Info({
  title,
  value
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: "#f8fafc",
        borderRadius: 16,
        padding: 18
      }}
    >
      <div
        style={{
          fontSize: 13,
          color: "#667085",
          marginBottom: 8
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontWeight: 700,
          lineHeight: 1.7
        }}
      >
        {value}
      </div>
    </div>
  );
}
