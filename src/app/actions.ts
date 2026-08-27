"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { addFeedback, changeFeedbackStatus } from "@/lib/store";
import type { FeedbackStatus } from "@/lib/types";
import { clearAdminSession, createAdminSession, isAdmin, validPassword } from "@/lib/auth";

function text(form: FormData, key: string, max: number) {
  return String(form.get(key) || "").trim().slice(0, max);
}

export async function submitFeedback(slug: string, form: FormData) {
  const author = text(form, "author", 40);
  const contact = text(form, "contact", 100);
  const content = text(form, "content", 2000);
  if (!author || !content) redirect(`/p/${slug}?error=1#feedback`);
  await addFeedback(slug, { author, contact, content });
  revalidatePath(`/p/${slug}`);
  revalidatePath("/admin");
  redirect(`/p/${slug}?sent=1#feedback`);
}

export async function loginAdmin(form: FormData) {
  if (!validPassword(text(form, "password", 200))) redirect("/admin?error=1");
  await createAdminSession();
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin");
}

export async function updateFeedbackStatus(form: FormData) {
  if (!(await isAdmin())) redirect("/admin");
  const projectId = text(form, "projectId", 80);
  const feedbackId = text(form, "feedbackId", 80);
  const status = text(form, "status", 20) as FeedbackStatus;
  if (!["待处理", "修改中", "待确认", "已完成"].includes(status)) throw new Error("状态无效");
  await changeFeedbackStatus(projectId, feedbackId, status);
  revalidatePath("/admin");
}
