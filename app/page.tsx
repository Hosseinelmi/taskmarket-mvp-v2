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
  const [loading, setLoading] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const [error, setError] = useState("");

  function handleAnalyze() {
    if (!task.trim()) return;

    const analysis = analyzeTask(task);

    setResult(analysis);
    setSubmitted(false);
    setTrackingCode("");
    setError("");
  }

  async function handleSubmit() {
    if (!task.trim() || !result || loading) return;

    setLoading(true);
    setSubmitted(false);
    setTrackingCode("");
    setError("");

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: task.trim().slice(0, 200),
          description: task.trim(),
          category: result.category
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "ثبت درخواست انجام نشد."
        );
      }

      setSubmitted(true);
      setTrackingCode(data.task.tracking_code);
    } catch (err) {
      console.error(err);

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
            هر کاری داری، فقط بگو
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
           
