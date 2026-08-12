// content/signals.ts packs each job's `sub` field as "Company · Location ·
// Range" (or "Company · Range" when there's no location) in one string —
// Experience.tsx needs company + range split back out for the job-tab
// layout (tab label = company, panel = "Title @ Company" + range).
export function splitSub(sub: string): { company: string; range: string } {
  const parts = sub.split(' · ');
  return { company: parts[0], range: parts[parts.length - 1] };
}
