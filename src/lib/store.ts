import { promises as fs } from "node:fs";
import path from "node:path";
import type { Feedback, FeedbackStatus, Store } from "./types";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "store.json");

async function readStore(): Promise<Store> {
  const raw = await fs.readFile(dataFile, "utf8");
  return JSON.parse(raw) as Store;
}

async function writeStore(store: Store) {
  await fs.mkdir(dataDir, { recursive: true });
  const temporary = `${dataFile}.${process.pid}.tmp`;
  await fs.writeFile(temporary, `${JSON.stringify(store, null, 2)}\n`, "utf8");
  await fs.rename(temporary, dataFile);
}

export async function listProjects() {
  return (await readStore()).projects;
}

export async function getProject(slug: string) {
  return (await readStore()).projects.find((project) => project.slug === slug);
}

export async function addFeedback(slug: string, input: Pick<Feedback, "author" | "contact" | "content">) {
  const store = await readStore();
  const project = store.projects.find((item) => item.slug === slug);
  if (!project) throw new Error("项目不存在");
  project.feedback.unshift({
    id: crypto.randomUUID(),
    ...input,
    status: "待处理",
    createdAt: new Date().toISOString(),
  });
  project.updatedAt = new Date().toISOString();
  await writeStore(store);
}

export async function changeFeedbackStatus(projectId: string, feedbackId: string, status: FeedbackStatus) {
  const store = await readStore();
  const project = store.projects.find((item) => item.id === projectId);
  const feedback = project?.feedback.find((item) => item.id === feedbackId);
  if (!project || !feedback) throw new Error("反馈不存在");
  feedback.status = status;
  project.updatedAt = new Date().toISOString();
  await writeStore(store);
}
