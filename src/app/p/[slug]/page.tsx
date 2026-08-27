import Link from "next/link";
import { notFound } from "next/navigation";
import { submitFeedback } from "@/app/actions";
import { StatusPill } from "@/components/status-pill";
import { ThemeFrame } from "@/components/theme-frame";
import { getProject, getTheme } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params, searchParams }: PageProps<"/p/[slug]">) {
  const { slug } = await params;
  const query = await searchParams;
  const [project, theme] = await Promise.all([getProject(slug), getTheme()]);
  if (!project) notFound();
  const action = submitFeedback.bind(null, slug);
  return (
    <ThemeFrame theme={theme} className="min-h-screen bg-[#f7f5ef] text-[#1e2621]">
      <header className="border-b border-[#deddd5] bg-white/80 px-5 py-5 backdrop-blur"><div className="mx-auto flex max-w-6xl items-center justify-between"><Link href="/" className="font-bold">CodeM Studio</Link><span className="text-sm text-[#69716c]">客户项目空间</span></div></header>
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="text-sm font-bold text-[var(--theme-accent)]">{project.customer}</p>
            <h1 className="mt-3 text-5xl font-semibold tracking-[-.04em]">{project.name}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#626b65]">{project.summary}</p>
            <div className="mt-10 rounded-3xl bg-[var(--theme-primary)] p-8 text-white">
              <div className="flex justify-between text-sm"><span>项目整体进度</span><strong>{project.progress}%</strong></div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[var(--theme-accent)]" style={{ width: `${project.progress}%` }} /></div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">{project.highlights.map((item) => <div key={item} className="rounded-2xl bg-white/10 p-4 text-sm leading-6">✓ {item}</div>)}</div>
            </div>
            <section className="mt-12">
              <h2 className="text-2xl font-semibold">反馈进度</h2>
              <div className="mt-5 space-y-3">{project.feedback.length ? project.feedback.map((item) => <article key={item.id} className="rounded-2xl border border-[#e1dfd6] bg-white p-5"><div className="flex items-center justify-between gap-4"><div><strong>{item.author}</strong><span className="ml-3 text-xs text-[#858b87]">{new Date(item.createdAt).toLocaleString("zh-CN")}</span></div><StatusPill value={item.status} /></div><p className="mt-3 leading-7 text-[#545d57]">{item.content}</p></article>) : <p className="rounded-2xl border border-dashed border-[#d5d3ca] p-8 text-center text-[#777f79]">还没有反馈</p>}</div>
            </section>
          </div>
          <aside id="feedback" className="h-fit rounded-3xl border border-[#dfded6] bg-white p-7 shadow-[0_20px_60px_rgba(33,43,36,.08)] lg:sticky lg:top-8">
            <p className="text-sm font-bold text-[var(--theme-accent)]">SUBMIT FEEDBACK</p><h2 className="mt-2 text-2xl font-semibold">告诉我们需要怎么改</h2><p className="mt-2 text-sm leading-6 text-[#6b746e]">提交后，团队会在后台接收并更新处理状态。</p>
            {query.sent && <p className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">反馈已提交，感谢你的建议。</p>}
            {query.error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">请填写姓名和具体需求。</p>}
            <form action={action} className="mt-6 space-y-4"><label className="block text-sm font-semibold">姓名<input name="author" required maxLength={40} className="mt-2 w-full rounded-xl border border-[#d9ddd9] px-4 py-3 outline-none focus:border-[var(--theme-primary)]" /></label><label className="block text-sm font-semibold">联系方式（选填）<input name="contact" maxLength={100} placeholder="邮箱或手机号" className="mt-2 w-full rounded-xl border border-[#d9ddd9] px-4 py-3 outline-none focus:border-[var(--theme-primary)]" /></label><label className="block text-sm font-semibold">修改需求<textarea name="content" required maxLength={2000} rows={6} placeholder="请描述希望调整的内容、效果或优先级" className="mt-2 w-full resize-none rounded-xl border border-[#d9ddd9] px-4 py-3 outline-none focus:border-[var(--theme-primary)]" /></label><button className="w-full rounded-xl bg-[var(--theme-primary)] px-5 py-3.5 font-bold text-white brightness-100 hover:brightness-110">提交需求</button></form>
          </aside>
        </div>
      </section>
    </ThemeFrame>
  );
}
