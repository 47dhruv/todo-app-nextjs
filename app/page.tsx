"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import {
  ArrowUpRight,
  Search,
  BarChart3,
  Target,
  Sparkles,
  Check,
  CheckCircle2,
  ListTodo,
  Plus,
  Trash2,
  Clock3,
  CalendarDays,
  CalendarRange,
  Calendar,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

type FilterType = "all" | "pending" | "completed";


const buildTrackerQuery = () => {
  const d = new Date()
  const start = {
    today: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
    week: new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7)),
    month: new Date(d.getFullYear(), d.getMonth(), 1),
    year: new Date(d.getFullYear(), 0, 1),
  }
  return Object.entries(start).map(([k, v]) => `${k}=${v.toISOString()}`).join("&")
}

const Homepage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hiddenCount, setHiddenCount] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [tracker, setTracker] = useState<{
    day: number;
    week: number;
    month: number;
    year: number;
  } | null>(null);

  /* ================= FETCH ================= */
  const todolist = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/todos");
      setTodos(response.data.todo || []);
      setHiddenCount(response.data.hiddenCount || 0);
    } catch (error: any) {       
      console.error(error?.response || error);
      toast.error("Something went wrong");
    }
  };

  const loadTracker = async () => {
    try {
      const response = await axios.get(`/api/tracker?${buildTrackerQuery()}`);
      // Supports APIs that return the tracker directly or inside { tracker: ... }.
      const data = response.data?.tracker ?? response.data;
      setTracker({
        day: Number(data.day ?? data.today ?? 0),
        week: Number(data.week ?? 0),
        month: Number(data.month ?? 0),
        year: Number(data.year ?? 0),
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data?.message ?? "Tracker could not be loaded");
      }
    }
  }


  /* ================= DELETE ================= */
  const deleteHandler = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/todos/${id}`);
      toast.success("Task deleted");
      await todolist()
      await loadTracker()
    } catch (error: any) {
      console.error(error?.response?.data?.message);
      toast.error(error?.response?.data?.message ?? "Task could not be deleted");
    }
  };

  /* ================= TOGGLE ================= */
  const toggle = async (id: number, completed: boolean) => {
    try {
      await axios.patch(`http://localhost:3000/api/todos/${id}`, {
        completed: !completed,
      });

      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      );
      await loadTracker()
    } catch (error: any) {
      console.error(error?.response?.data?.message);
      toast.error(error?.response?.data?.message ?? "Something went wrong");
    }
  };

  /* ================= CREATE ================= */
  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Write something first!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/api/todos", {
        title: title.trim(),
      });

      setTodos((prev) => [...prev, response.data.data]);
      setTitle("");
      toast.success("New task added!");
    } catch (error: any) {
      console.error(error?.response?.data?.message);
      toast.error(error?.response?.data?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    todolist();
    loadTracker();
  }, []);

  const completed = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos]
  );
  const pending = todos.length - completed;
  const completionRate = todos.length ? Math.round((completed / todos.length) * 100) : 0;

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesSearch =
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (todo.description &&
          todo.description.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;
      if (activeFilter === "pending") return !todo.completed;
      if (activeFilter === "completed") return todo.completed;
      return true;
    });
  }, [todos, searchQuery, activeFilter]);

  /* ================= UI ================= */
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#171717] text-[#F5F5F5] selection:bg-[#E49385] selection:text-[#171717]">
      {/* Subtle dotted canvas background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.14]"
        style={{
          backgroundImage: "radial-gradient(#F5F5F5 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        {/* Navigation Bar */}
        <motion.header
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="mb-8 flex min-h-[68px] flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#2e2e2e] bg-[#222222] px-5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.35)] sm:px-7"
        >
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-[#F5F5F5]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#292929] border border-[#333333] text-[#E49385]">
                <ListTodo size={20} strokeWidth={2} />
              </div>
              <span>
                Task<span className="text-[#E49385]">Flow</span>
              </span>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4">
            {/* Interactive Search Bar */}
            <div className="relative flex h-10 w-full max-w-[260px] items-center rounded-xl border border-[#333333] bg-[#292929] px-3 text-[#A3A3A3] focus-within:border-[#E49385] focus-within:text-[#F5F5F5] transition-colors">
              <Search size={16} className="shrink-0 text-[#A3A3A3]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full bg-transparent px-2.5 text-xs text-[#F5F5F5] placeholder-[#A3A3A3] outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-[#A3A3A3] hover:text-[#F5F5F5]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Clerk Authentication */}
            {!isLoaded ? (
              <div className="h-9 w-9 animate-pulse rounded-full bg-[#292929] border border-[#333333]" />
            ) : isSignedIn && user ? (
              <div className="flex items-center gap-2 rounded-xl border border-[#333333] bg-[#292929] py-1 pl-3 pr-1.5">
                <span className="hidden max-w-28 truncate text-xs font-medium text-[#A3A3A3] sm:block">
                  {user.firstName || user.username || "Account"}
                </span>
                <UserButton
                  appearance={{
                    theme:dark,
                    elements: {
                      avatarBox: "!h-8 !w-8 rounded-lg",
                      userButtonAvatarBox: "!h-8 !w-8",
                      userButtonTrigger: "!rounded-lg",
                      userButtonPopoverCard:
                        "!rounded-xl !border !border-[#333333] !bg-[#222222] !text-[#F5F5F5] !shadow-2xl",
                      userButtonPopoverActionButton:
                        "!text-[#F5F5F5] hover:!bg-[#292929]",
                      userButtonPopoverFooter: "!border-t !border-[#333333]",
                    },
                  }}
                />
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#E49385] px-4 py-2 text-xs font-semibold text-[#171717] transition hover:bg-[#d48173]"
              >
                Sign in <ArrowUpRight size={14} />
              </Link>
            )}
          </div>
        </motion.header>

        {/* Dashboard Grid Layout */}
        <div className="grid items-start gap-6 xl:grid-cols-[300px_minmax(420px,1fr)_340px]">
          {/* Left Rail: Metrics & Focus */}
          <aside className="space-y-6">
            {/* Quick Action / Workspace Card */}
            <motion.div
              whileHover={{ y: -2 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#333333] bg-[#222222] p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#292929] border border-[#333333] text-[#A2D7CB]">
                  <ListTodo size={22} />
                </div>
                <span className="rounded-full border border-[#A2D7CB]/30 bg-[#A2D7CB]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#A2D7CB]">
                  Active List
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-bold tracking-tight text-[#F5F5F5]">
                  Task Workspace
                </h3>
                <p className="mt-1 text-xs text-[#A3A3A3]">
                  {pending === 0
                    ? "All caught up for now."
                    : `${pending} remaining tasks requiring attention.`}
                </p>
              </div>
            </motion.div>

            {/* Live Progress Card */}
            <div className="rounded-2xl border border-[#333333] bg-[#222222] p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#292929] border border-[#333333] text-[#E49385]">
                  <Target size={20} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#A3A3A3]">
                  Daily Completion
                </span>
              </div>

              <div className="mt-6 flex items-baseline justify-between">
                <span className="text-4xl font-bold tracking-tight text-[#F5F5F5]">
                  {completionRate}%
                </span>
                <span className="text-xs text-[#A3A3A3]">
                  {completed} of {todos.length} done
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#292929]">
                <motion.div
                  className="h-full rounded-full bg-[#A2D7CB]"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Numeric Breakdown */}
            <section
              id="stats"
              className="rounded-2xl border border-[#333333] bg-[#222222] p-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#A3A3A3]">
                  Breakdown
                </p>
                <BarChart3 size={18} className="text-[#A2D7CB]" />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2.5">
                <div className="rounded-xl border border-[#333333] bg-[#292929] p-3 text-center">
                  <span className="text-xs text-[#A3A3A3]">Total</span>
                  <p className="mt-1 text-xl font-bold text-[#F5F5F5]">
                    {todos.length}
                  </p>
                </div>
                <div className="rounded-xl border border-[#333333] bg-[#292929] p-3 text-center">
                  <span className="text-xs text-[#A3A3A3]">To Do</span>
                  <p className="mt-1 text-xl font-bold text-[#E49385]">
                    {pending}
                  </p>
                </div>
                <div className="rounded-xl border border-[#333333] bg-[#292929] p-3 text-center">
                  <span className="text-xs text-[#A3A3A3]">Done</span>
                  <p className="mt-1 text-xl font-bold text-[#A2D7CB]">
                    {completed}
                  </p>
                </div>
              </div>
            </section>
          </aside>

          {/* Center Column: Primary Task Hub */}
          <section id="tasks" className="min-w-0">
            {/* Header & Quick Action */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#E49385]">
                  Productivity Dashboard
                </p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#F5F5F5] sm:text-4xl">
                  Tasks
                </h1>
              </div>

              {/* Functional Filters */}
              <div className="flex items-center rounded-xl border border-[#333333] bg-[#222222] p-1">
                {(["all", "pending", "completed"] as FilterType[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveFilter(tab)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${activeFilter === tab
                      ? "bg-[#292929] text-[#F5F5F5] shadow-sm border border-[#3a3a3a]"
                      : "text-[#A3A3A3] hover:text-[#F5F5F5]"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Task Creation Form */}
            <section
              id="add-task"
              className="mb-6 rounded-2xl border border-[#333333] bg-[#222222] p-5 shadow-sm sm:p-6"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#A2D7CB]">
                  Create Item
                </span>
                <Sparkles size={16} className="text-[#E49385]" />
              </div>
              <form
                onSubmit={onSubmitHandler}
                className="flex flex-col gap-2.5 sm:flex-row"
              >
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs to be done next?"
                  className="h-11 min-w-0 rounded-xl border border-[#333333] bg-[#292929] px-4 text-sm text-[#F5F5F5] placeholder:text-[#A3A3A3] focus-visible:ring-1 focus-visible:ring-[#E49385]"
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 rounded-xl bg-[#E49385] px-5 text-sm font-semibold text-[#171717] hover:bg-[#d48173] disabled:opacity-60 transition"
                >
                  <Plus size={16} className="mr-1.5" />
                  {loading ? "Adding…" : "Add Task"}
                </Button>
              </form>
            </section>

            {/* Task List Header */}
            <div className="mb-3 flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#A3A3A3]">
                {activeFilter === "all" ? "All Tasks" : `${activeFilter} Tasks`} (
                {filteredTodos.length})
              </h2>
              {searchQuery && (
                <span className="text-xs text-[#E49385]">
                  Filtered by &ldquo;{searchQuery}&rdquo;
                </span>
              )}
            </div>

            {/* Task Items / Empty State */}
            {filteredTodos.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#333333] bg-[#222222] px-6 py-14 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#292929] border border-[#333333] text-[#A3A3A3]">
                  <CheckCircle2 size={24} className="text-[#A2D7CB]" />
                </div>
                <h3 className="text-base font-semibold text-[#F5F5F5]">
                  {searchQuery
                    ? "No tasks match your search"
                    : activeFilter === "completed"
                      ? "No completed tasks yet"
                      : "No tasks found"}
                </h3>
                <p className="mt-1 text-xs text-[#A3A3A3]">
                  {searchQuery
                    ? "Try adjusting your query or resetting filters."
                    : "Add a new task above to get your momentum rolling."}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                <AnimatePresence initial={false}>
                  {filteredTodos.map((todo) => (
                    <motion.article
                      key={todo.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className={`group flex items-center gap-3.5 rounded-xl border p-4 transition-all ${todo.completed
                        ? "border-[#292929] bg-[#1d1d1d]/90 text-[#A3A3A3]"
                        : "border-[#333333] bg-[#222222] hover:border-[#3d3d3d] hover:bg-[#252525]"
                        }`}
                    >
                      {/* Checkbox Button */}
                      <button
                        type="button"
                        onClick={() => toggle(todo.id, todo.completed)}
                        aria-label={
                          todo.completed
                            ? "Mark task incomplete"
                            : "Mark task complete"
                        }
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${todo.completed
                          ? "border-[#A2D7CB] bg-[#A2D7CB] text-[#171717]"
                          : "border-[#444444] bg-[#292929] hover:border-[#E49385]"
                          }`}
                      >
                        {todo.completed && <Check size={13} strokeWidth={3} />}
                      </button>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <p
                          className={`break-words text-sm font-medium transition-all ${todo.completed
                            ? "text-[#A3A3A3] line-through"
                            : "text-[#F5F5F5]"
                            }`}
                        >
                          {todo.title}
                        </p>
                        {todo.description && (
                          <p className="mt-1 break-words text-xs text-[#A3A3A3]">
                            {todo.description}
                          </p>
                        )}
                      </div>

                      {/* Delete Action Button */}
                      <button
                        type="button"
                        onClick={() => deleteHandler(todo.id)}
                        aria-label="Delete task"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#A3A3A3] opacity-100 transition hover:bg-[#E49385]/10 hover:text-[#E49385] sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <Trash2 size={15} />
                      </button>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Hidden items notification preserved from backend */}
            {hiddenCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-xl border border-[#E49385]/20 bg-[#E49385]/5 px-4 py-3 text-xs leading-5 text-[#A3A3A3]"
              >
                <span className="font-semibold text-[#E49385]">
                  {hiddenCount} more {hiddenCount === 1 ? "task is" : "tasks are"} hidden.
                </span>{" "}
                Subscribe or upgrade to view your full history.
              </motion.div>
            )}
          </section>

          {/* Right Rail: Summary and Status */}
          <aside className="space-y-6">
            {/* Live Progress Summary */}
            <section className="rounded-2xl border border-[#333333] bg-[#222222] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#A3A3A3]">
                    Overview
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-[#F5F5F5]">
                    Status Metrics
                  </h2>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#292929] border border-[#333333] text-[#A2D7CB]">
                  <Clock3 size={18} />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-[#333333] bg-[#292929] p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[#E49385]" />
                    <div>
                      <p className="text-xs font-medium text-[#F5F5F5]">Pending Tasks</p>
                      <p className="text-[11px] text-[#A3A3A3]">Awaiting action</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-[#E49385]">{pending}</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-[#333333] bg-[#292929] p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[#A2D7CB]" />
                    <div>
                      <p className="text-xs font-medium text-[#F5F5F5]">Completed</p>
                      <p className="text-[11px] text-[#A3A3A3]">Finished items</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-[#A2D7CB]">{completed}</span>
                </div>
              </div>
            </section>

            {/* Activity Tracker */}
            <section className="overflow-hidden rounded-2xl border border-[#333333] bg-[#222222] p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#A3A3A3]">
                    Activity tracker
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-[#F5F5F5]">
                    Your consistency
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-[#A3A3A3]">
                    Tasks completed across different time periods.
                  </p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#A2D7CB]/20 bg-[#A2D7CB]/10 text-[#A2D7CB]">
                  <TrendingUp size={19} />
                </div>
              </div>

              {tracker ? (
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "Today",
                      value: tracker.day,
                      icon: Clock3,
                      accent: "coral",
                    },
                    {
                      label: "This week",
                      value: tracker.week,
                      icon: CalendarRange,
                      accent: "mint",
                    },
                    {
                      label: "This month",
                      value: tracker.month,
                      icon: CalendarDays,
                      accent: "mint",
                    },
                    {
                      label: "This year",
                      value: tracker.year,
                      icon: Calendar,
                      accent: "coral",
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    const coral = item.accent === "coral";

                    return (
                      <motion.div
                        key={item.label}
                        whileHover={{ y: -2 }}
                        className="rounded-xl border border-[#383838] bg-[#292929] p-3.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-medium text-[#A3A3A3]">
                            {item.label}
                          </span>
                          <Icon
                            size={15}
                            className={coral ? "text-[#E49385]" : "text-[#A2D7CB]"}
                          />
                        </div>
                        <p
                          className={`mt-3 text-2xl font-bold tabular-nums ${
                            coral ? "text-[#E49385]" : "text-[#A2D7CB]"
                          }`}
                        >
                          {item.value}
                        </p>
                        <p className="mt-1 text-[10px] text-[#858585]">
                          {item.value === 1 ? "task completed" : "tasks completed"}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#383838] bg-[#292929] px-4 py-5">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-[#A2D7CB]" />
                  <p className="text-xs text-[#A3A3A3]">
                    Loading your activity...
                  </p>
                </div>
              )}
            </section>

            {/* Productive Habit Card */}
            <section className="rounded-2xl border border-[#333333] bg-[#222222] p-6">
              <span className="rounded-md border border-[#A2D7CB]/30 bg-[#A2D7CB]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#A2D7CB]">
                Focus Rule
              </span>
              <h3 className="mt-3 text-base font-bold text-[#F5F5F5]">
                Single-task progression
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#A3A3A3]">
                Break down friction by completing one item before triaging next priorities.
              </p>
            </section>
          </aside>
        </div>

        {/* Footer */}
        <footer className="mt-12 flex flex-col justify-between gap-3 border-t border-[#292929] px-1 pt-6 text-xs text-[#A3A3A3] sm:flex-row">
          <span>TaskFlow Studio</span>
          <span>
            {completed} of {todos.length} total tasks completed ({completionRate}%)
          </span>
        </footer>
      </div>
    </main>
  );
};

export default Homepage;