import Link from "next/link";
import { getTheme, listProjects } from "@/lib/store";
import { ThemeFrame } from "@/components/theme-frame";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, theme] = await Promise.all([listProjects(), getTheme()]);
  return (
    <ThemeFrame theme={theme} className="min-h-screen bg-[#f4f5f2] px-5 py-16 text-[#18221d]">
      <section className="mx-auto max-w-6xl">
        <nav className="mb-20 flex items-center justify-between">
          <div className="flex items-center gap-3 text-lg font-bold"><span className="grid size-10 place-items-center rounded-xl bg-[var(--theme-primary)] text-white">C</span>CodeM Studio</div>
          <Link href="/admin" className="rounded-full border border-[#cad0ca] px-5 py-2.5 text-sm font-semibold hover:bg-white">管理后台</Link>
        </nav>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[.22em] text-[var(--theme-accent)]">Customer collaboration</p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.06] tracking-[-.045em] sm:text-7xl">让每一次演示，都自然进入下一次迭代。</h1>
          </div>
          <p className="max-w-xl text-lg leading-8 text-[#5f6862]">集中展示项目进展，收集客户反馈，并让每条需求的处理状态清晰可见。</p>
        </div>
        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <Link key={project.id} href={`/p/${project.slug}`} className="group rounded-[2rem] border border-[#dce0dc] bg-white p-8 shadow-[0_18px_60px_rgba(26,45,34,.06)] transition hover:-translate-y-1">
              <div className="mb-14 flex items-start justify-between"><span className="rounded-full bg-[#edf4ef] px-3 py-1 text-xs font-bold text-[#27553e]">{project.stage}</span><span className="text-sm text-[#7b837e]">{project.progress}%</span></div>
              <h2 className="text-3xl font-semibold tracking-tight">{project.name}</h2>
              <p className="mt-3 leading-7 text-[#69716c]">{project.summary}</p>
              <div className="mt-8 flex items-center justify-between border-t border-[#edf0ed] pt-5 text-sm"><span>{project.customer}</span><span className="font-bold text-[var(--theme-accent)] group-hover:translate-x-1">查看项目 →</span></div>
            </Link>
          ))}
        </div>
      </section>
    </ThemeFrame>
  );
}
