"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { ClientSummary, JobListItem, listClients, listJobs } from "@/lib/api";

type Props = {
  role: "admin" | "staff" | "client";
};

const JOB_BASE_PATH: Record<Props["role"], string> = {
  admin: "/admin/jobs",
  staff: "/staff/jobs",
  client: "/portal/orders",
};

export default function GlobalSearch({ role }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setJobs([]);
      setClients([]);
      return;
    }

    const timeout = setTimeout(() => {
      listJobs({ q: query }).then(setJobs).catch(() => setJobs([]));

      if (role !== "client") {
        listClients(query).then(setClients).catch(() => setClients([]));
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [query, role]);

  const basePath = JOB_BASE_PATH[role];
  const hasResults = jobs.length > 0 || clients.length > 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-[420px]">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
      />

      <input
        placeholder="Search jobs, clients, invoices..."
        aria-label="Search jobs, clients, invoices"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="h-11 w-full rounded-full border border-[#E5E7EB] bg-[#FAFAFA] pl-11 pr-4 text-sm outline-none transition focus:border-[#FF6B00] focus:bg-white sm:h-12"
      />

      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 max-h-96 overflow-y-auto rounded-xl border border-[#EAEAEA] bg-white p-2 shadow-lg">
          {!hasResults && (
            <p className="px-3 py-4 text-center text-sm text-[#94A3B8]">
              No matches found.
            </p>
          )}

          {jobs.length > 0 && (
            <div className="mb-1">
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                Jobs
              </p>
              {jobs.slice(0, 6).map((job) => (
                <Link
                  key={job.id}
                  href={`${basePath}/${job.id}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-[#FFF7F2]"
                >
                  <span className="font-semibold text-[#0F172A]">{job.job_number}</span>{" "}
                  <span className="text-[#64748B]">{job.job_name}</span>
                </Link>
              ))}
            </div>
          )}

          {clients.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                Clients
              </p>
              {clients.slice(0, 6).map((client) => (
                <Link
                  key={client.id}
                  href={role === "admin" ? "/admin/clients" : "/staff/clients"}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-[#FFF7F2]"
                >
                  <span className="font-semibold text-[#0F172A]">{client.name}</span>{" "}
                  <span className="text-[#64748B]">{client.email}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
