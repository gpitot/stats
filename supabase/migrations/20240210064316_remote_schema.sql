create table "public"."stats" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "name" text not null
);


alter table "public"."stats" enable row level security;

CREATE UNIQUE INDEX stats_name_key ON public.stats USING btree (name);

CREATE UNIQUE INDEX stats_pkey ON public.stats USING btree (id);

alter table "public"."stats" add constraint "stats_pkey" PRIMARY KEY using index "stats_pkey";

alter table "public"."stats" add constraint "stats_name_key" UNIQUE using index "stats_name_key";

grant delete on table "public"."stats" to "anon";

grant insert on table "public"."stats" to "anon";

grant references on table "public"."stats" to "anon";

grant select on table "public"."stats" to "anon";

grant trigger on table "public"."stats" to "anon";

grant truncate on table "public"."stats" to "anon";

grant update on table "public"."stats" to "anon";

grant delete on table "public"."stats" to "authenticated";

grant insert on table "public"."stats" to "authenticated";

grant references on table "public"."stats" to "authenticated";

grant select on table "public"."stats" to "authenticated";

grant trigger on table "public"."stats" to "authenticated";

grant truncate on table "public"."stats" to "authenticated";

grant update on table "public"."stats" to "authenticated";

grant delete on table "public"."stats" to "service_role";

grant insert on table "public"."stats" to "service_role";

grant references on table "public"."stats" to "service_role";

grant select on table "public"."stats" to "service_role";

grant trigger on table "public"."stats" to "service_role";

grant truncate on table "public"."stats" to "service_role";

grant update on table "public"."stats" to "service_role";

create policy "Enable insert for authenticated users only"
on "public"."stats"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for authenticated"
on "public"."stats"
as permissive
for select
to authenticated
using (true);



