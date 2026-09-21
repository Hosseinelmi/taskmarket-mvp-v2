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

 
