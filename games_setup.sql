-- سياسة أمان وجدول لتسجيل الفائزين في الألعاب الذكية

create table if not exists public.game_winners (
    id bigserial primary key,
    student_id uuid references public.students(id),
    game_name text not null,
    won_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- تفعيل سياسات الأمان
alter table public.game_winners enable row level security;

-- السماح بإدخال بيانات الفوز
drop policy if exists "Enable insert for all" on public.game_winners;
create policy "Enable insert for all" 
on public.game_winners 
as permissive 
for insert 
to public 
with check (true);

-- السماح بقراءة النتائج
drop policy if exists "Enable read access for all" on public.game_winners;
create policy "Enable read access for all" 
on public.game_winners 
as permissive 
for select 
to public 
using (true);
