"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";


import { useUser, UserButton } from '@clerk/nextjs'

import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Circle,
  ListTodo,
  Plus,
  Trash2,
  X,
  Zap,
  MoveUpRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

const Homepage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(user)







  /* ================= FETCH ================= */

  const todolist = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/todos"
      );

      setTodos(response.data.todo);
    } catch (error:any) {
      console.log(error.response);
      toast.error("Something went wrong");
    }
  };

  /* ================= DELETE ================= */

  const deleteHandler = async (id: number) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/todos/${id}`
      );

      setTodos((prev) =>
        prev.filter((todo) => todo.id !== id)
      );

      toast.success("Task deleted");
    } catch (error:any) {
      console.log(error );
      toast.error("Task could not be deleted");
    }
  };

  /* ================= TOGGLE ================= */

  const toggle = async (
    id: number,
    completed: boolean
  ) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/todos/${id}`,
        {
          completed: !completed,
        }
      );

      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id
            ? {
              ...todo,
              completed: !completed,
            }
            : todo
        )
      );
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  /* ================= CREATE ================= */

  const onSubmitHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Write something first!");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3000/api/todos",
        {
          title,
        }
      );

      setTodos((prev) => [
        ...prev,
        response.data.data,
      ]);

      setTitle("");

      toast.success("New task added!");
    } catch (error:any) {
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message ?? "something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    todolist();
  }, []);

  const completed = todos.filter(
    (todo) => todo.completed
  ).length;

  const pending = todos.length - completed;

  /* ================= UI ================= */

  return (
    <main className="min-h-screen overflow-hidden bg-[#f1eee5] text-[#111]">

      {/* ================= DECORATIVE BACKGROUND ================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        {/* noise */}
        <div className="absolute inset-0 opacity-[0.08] [background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 180 180%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%22.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%22.3%22/%3E%3C/svg%3E')]" />

        {/* lime blob */}
        <motion.div
          animate={{
            rotate: [8, -5, 8],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
          className="absolute -right-20 top-20 h-64 w-64 rotate-6 bg-[#c8ff00]"
        />

        {/* red blob */}
        <motion.div
          animate={{
            rotate: [-10, 5, -10],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
          }}
          className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#ff5a52]"
        />

        {/* grid */}
        <div className="absolute right-10 top-24 h-40 w-40 opacity-30 [background-image:radial-gradient(#111_1px,transparent_1px)] [background-size:10px_10px]" />

      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-6 md:px-10 lg:px-14">

        {/* ================= NAVBAR ================= */}



        <motion.nav
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-20 flex flex-wrap items-center justify-between gap-5 border-b-2 border-black pb-5"
        >
          {/* Logo */}
          <Link href="/" className="group flex shrink-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center border-2 border-black bg-[#c8ff00] shadow-[4px_4px_0_#111] transition-transform group-hover:-rotate-6">
              <ListTodo size={23} strokeWidth={3} />
            </div>

            <div>
              <span className="block text-xl font-black uppercase leading-none tracking-[-0.07em] sm:text-2xl">
                TODO<span className="text-[#ff5a52]">.</span>STUDIO
              </span>
              <span className="mt-1 block text-[9px] font-black uppercase tracking-[0.2em] text-black/50">
                Get things done
              </span>
            </div>
          </Link>

          {/* Navigation links */}
          <div className="hidden items-center gap-7 text-xs font-black uppercase tracking-widest lg:flex">
            <a href="#tasks" className="transition-colors hover:text-[#ff5a52]">
              Work ↗
            </a>

            <a href="#stats" className="transition-colors hover:text-[#ff5a52]">
              Progress ↗
            </a>

            <a href="#add-task" className="transition-colors hover:text-[#ff5a52]">
              New Task ↗
            </a>
          </div>

          {/* Clerk user section */}
          <div className="ml-auto flex min-w-0 items-center gap-3">
            {/* Loading state */}
            {!isLoaded ? (
              <div className="flex items-center gap-3">
                <div className="hidden h-10 w-28 animate-pulse border-2 border-black bg-white sm:block" />
                <div className="h-12 w-12 animate-pulse border-2 border-black bg-[#c8ff00]" />
              </div>
            ) : isSignedIn && user ? (
              <>
                {/* User details */}
                <div className="min-w-0 text-right">
                  <p className="max-w-[150px] truncate text-xs font-black uppercase sm:max-w-[190px] sm:text-sm">
                    {user.firstName || user.username || "DOER"}
                  </p>

                  <p className="max-w-[150px] truncate text-[10px] font-bold text-black/55 sm:max-w-[190px]">
                    {user.primaryEmailAddress?.emailAddress}
                  </p>

                  <div className="mt-1 flex items-center justify-end gap-1.5">
                    <span className="h-2 w-2 rounded-full border border-black bg-[#c8ff00]" />
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      Online
                    </span>
                  </div>
                </div>

                {/* Profile avatar and Clerk account menu */}
                <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center border-2 border-black bg-[#c8ff00] p-1 shadow-[4px_4px_0_#111] transition-transform hover:-translate-y-1 hover:shadow-[5px_5px_0_#ff5a52]">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "!h-10 !w-10 !rounded-none",
                        userButtonAvatarBox: "!h-10 !w-10 !rounded-none",
                        userButtonTrigger: "!rounded-none",
                        userButtonPopoverCard: "!rounded-none !border-2 !border-black",
                        userButtonPopoverActionButton: "!rounded-none",
                      },
                    }}
                  />
                </div>
              </>
            ) : (
              /* Signed-out state */
              <Link
                href="/sign-in"
                className="group flex h-12 items-center gap-3 border-2 border-black bg-black px-4 text-xs font-black uppercase tracking-widest text-white shadow-[4px_4px_0_#c8ff00] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:bg-[#c8ff00] hover:text-black hover:shadow-[6px_6px_0_#111]"
              >
                Sign In
                <ArrowUpRight
                  size={17}
                  strokeWidth={3}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            )}
          </div>
        </motion.nav>

        {/* ================= HERO ================= */}

        <section className="relative py-16 md:py-24">

          {/* sticker */}

          <motion.div
            initial={{ rotate: 12, scale: 0 }}
            animate={{ rotate: 12, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              delay: 0.3,
            }}
            className="absolute right-[8%] top-10 hidden rotate-6 border-2 border-black bg-[#c8ff00] px-5 py-3 text-xs font-black uppercase shadow-[5px_5px_0_#111] md:block"
          >
            GET IT
            <br />
            DONE →
          </motion.div>

          <div className="max-w-5xl">

            <p className="mb-5 text-sm font-black uppercase tracking-[0.3em]">
              ✦ Personal productivity / 2026
            </p>

            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="font-black uppercase leading-[0.78] tracking-[-0.07em]"
            >

              <span className="block text-[17vw] sm:text-[120px] lg:text-[155px]">
                GET
              </span>

              <span className="relative inline-block bg-[#ff5a52] px-3 text-[17vw] sm:text-[120px] lg:text-[155px]">
                SHIT
              </span>

              <span className="block text-[17vw] sm:text-[120px] lg:text-[155px]">
                DONE.
              </span>

            </motion.h1>

            <div className="mt-10 flex max-w-2xl items-start gap-5">

              <div className="h-16 w-3 shrink-0 bg-black" />

              <p className="text-lg font-bold leading-7 md:text-xl">
                A brutally simple task manager for people
                who have things to build, deadlines to hit,
                and absolutely no time to waste.
              </p>

            </div>

          </div>

        </section>

        {/* ================= STATS ================= */}

        <section id="stats" className="mb-12 grid border-2 border-black md:grid-cols-3">

          <div className="border-b-2 border-black bg-white p-6 md:border-b-0 md:border-r-2">
            <p className="text-xs font-black uppercase tracking-widest">
              Total Tasks
            </p>

            <p className="mt-2 text-6xl font-black">
              {todos.length}
            </p>
          </div>

          <div className="border-b-2 border-black bg-[#c8ff00] p-6 md:border-b-0 md:border-r-2">
            <p className="text-xs font-black uppercase tracking-widest">
              Pending
            </p>

            <p className="mt-2 text-6xl font-black">
              {pending}
            </p>
          </div>

          <div className="bg-[#ff5a52] p-6">
            <p className="text-xs font-black uppercase tracking-widest">
              Completed
            </p>

            <p className="mt-2 text-6xl font-black">
              {completed}
            </p>
          </div>

        </section>

        {/* ================= ADD TASK ================= */}

        <section id="add-task" className="mb-16">
          <div className="mb-4 flex items-end justify-between">

            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em]">
                New mission
              </p>

              <h2 className="mt-1 text-4xl font-black uppercase tracking-tight">
                Add a task.
              </h2>
            </div>

            <Zap
              className="hidden md:block"
              size={38}
              strokeWidth={3}
            />

          </div>

          <form
            onSubmit={onSubmitHandler}
            className="relative flex flex-col border-2 border-black bg-white p-3 shadow-[8px_8px_0_#111] md:flex-row"
          >

            <Input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="WRITE YOUR NEXT MOVE..."
              className="h-16 rounded-none border-0 bg-transparent text-lg font-black uppercase placeholder:text-black/30 focus-visible:ring-0"
            />

            <Button
              type="submit"
              disabled={loading}
              className="h-16 rounded-none border-2 border-black bg-[#c8ff00] px-8 text-black shadow-[4px_4px_0_#111] hover:bg-[#ff5a52] md:w-48"
            >
              <Plus size={22} strokeWidth={3} />
              {loading ? "ADDING..." : "ADD TASK"}
            </Button>

          </form>

        </section>

        {/* ================= TASK LIST ================= */}

        <section id="tasks">
          <div className="mb-8 flex items-end justify-between border-b-2 border-black pb-4">

            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em]">
                The list
              </p>

              <h2 className="text-5xl font-black uppercase tracking-[-0.05em]">
                Your tasks
              </h2>
            </div>

            <ArrowUpRight
              size={42}
              strokeWidth={3}
            />

          </div>

          {todos.length === 0 ? (

            <div className="border-2 border-dashed border-black bg-white p-16 text-center">

              <Circle
                className="mx-auto mb-5"
                size={45}
                strokeWidth={2}
              />

              <h3 className="text-4xl font-black uppercase">
                Nothing here.
              </h3>

              <p className="mt-3 font-bold">
                Add something before you forget it.
              </p>

            </div>

          ) : (

            <div className="space-y-5">

              <AnimatePresence>

                {todos.map((todo, index) => (

                  <motion.article
                    key={todo.id}
                    layout
                    initial={{
                      opacity: 0,
                      x: -80,
                      rotate: -2,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      rotate: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: 100,
                      rotate: 4,
                    }}
                    whileHover={{
                      x: -5,
                      y: -5,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    className={`relative border-2 border-black p-5 shadow-[7px_7px_0_#111] md:p-7 ${todo.completed
                        ? "bg-[#c8ff00]"
                        : index % 3 === 0
                          ? "bg-white"
                          : index % 3 === 1
                            ? "bg-[#ff5a52]"
                            : "bg-[#e6e1d5]"
                      }`}
                  >

                    {/* task number */}

                    <div className="absolute right-5 top-3 text-6xl font-black opacity-10">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                      <div className="flex items-start gap-5">

                        {/* CHECK */}

                        <button
                          onClick={() =>
                            toggle(
                              todo.id,
                              todo.completed
                            )
                          }
                          className={`mt-1 flex h-12 w-12 shrink-0 items-center justify-center border-2 border-black bg-white transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_#111] ${todo.completed
                              ? "bg-black text-[#c8ff00]"
                              : ""
                            }`}
                        >
                          {todo.completed ? (
                            <Check
                              size={27}
                              strokeWidth={4}
                            />
                          ) : (
                            <Circle
                              size={25}
                              strokeWidth={3}
                            />
                          )}
                        </button>

                        <div>

                          <div className="mb-2 flex flex-wrap items-center gap-3">

                            <span className="border-2 border-black bg-white px-2 py-1 text-[10px] font-black uppercase">
                              TASK {index + 1}
                            </span>

                            {todo.completed && (
                              <span className="border-2 border-black bg-black px-2 py-1 text-[10px] font-black uppercase text-white">
                                DONE
                              </span>
                            )}

                          </div>

                          <h3
                            className={`max-w-3xl text-2xl font-black uppercase leading-tight tracking-tight md:text-4xl ${todo.completed
                                ? "line-through decoration-4"
                                : ""
                              }`}
                          >
                            {todo.title}
                          </h3>

                          {todo.description && (
                            <p className="mt-3 max-w-xl font-bold">
                              {todo.description}
                            </p>
                          )}

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="flex gap-2">

                        <Button
                          onClick={() =>
                            toggle(
                              todo.id,
                              todo.completed
                            )
                          }
                          className="h-12 rounded-none border-2 border-black bg-white px-5 font-black text-black shadow-[4px_4px_0_#111] hover:bg-[#c8ff00]"
                        >
                          {todo.completed ? (
                            <>
                              <X size={18} />
                              UNDO
                            </>
                          ) : (
                            <>
                              <Check size={18} />
                              DONE
                            </>
                          )}
                        </Button>

                        <Button
                          onClick={() =>
                            deleteHandler(todo.id)
                          }
                          className="h-12 w-12 rounded-none border-2 border-black bg-black p-0 text-white shadow-[4px_4px_0_#ff5a52] hover:bg-[#ff5a52] hover:text-black"
                        >
                          <Trash2 size={19} />
                        </Button>

                      </div>

                    </div>

                  </motion.article>

                ))}

              </AnimatePresence>

            </div>

          )}

        </section>

        {/* ================= BOTTOM POSTER ================= */}

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative mt-24 overflow-hidden border-2 border-black bg-black p-8 text-white shadow-[10px_10px_0_#ff5a52] md:p-14"
        >

          <div className="absolute right-10 top-5 text-[100px] font-black leading-none text-[#c8ff00] opacity-20">
            +
          </div>

          <p className="relative mb-5 text-xs font-black uppercase tracking-[0.3em] text-[#c8ff00]">
            Productivity manifesto
          </p>

          <h2 className="relative max-w-4xl text-5xl font-black uppercase leading-[0.85] tracking-[-0.05em] md:text-8xl">
            STOP
            <br />
            THINKING.
            <br />
            START
            <span className="text-[#ff5a52]"> DOING.</span>
          </h2>

          <div className="relative mt-8 flex items-center gap-3 font-black uppercase">
            <MoveUpRight
              className="text-[#c8ff00]"
              size={25}
            />
            One task at a time.
          </div>

        </motion.section>

        {/* ================= FOOTER ================= */}

        <footer className="flex flex-col justify-between gap-5 py-10 text-xs font-black uppercase md:flex-row">

          <span>© TODO.STUDIO 2026</span>

          <span>
            {completed} / {todos.length} COMPLETE
          </span>

          <span>BUILT TO GET THINGS DONE.</span>

        </footer>

      </div>
    </main>
  );
};

export default Homepage;