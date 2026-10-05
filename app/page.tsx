
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Check,
  Trash2,
  Plus,
  Circle,
  CheckCircle2,
  ListTodo,
  Sparkles,
  Zap,
} from "lucide-react";

interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

const Homepage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const todolist = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/todos");

      setTodos(response.data.todo);
      toast.success("Todo list fetched successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const deleteHandler = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/todos/${id}`);

      setTodos((prev) => prev.filter((todo) => todo.id !== id));

      toast.success("Todo deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Todo not deleted");
    }
  };

  const toggle = async (id: number, completed: boolean) => {
    try {
      await axios.patch(`http://localhost:3000/api/todos/${id}`, {
        completed: !completed,
      });

      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id
            ? { ...todo, completed: !completed }
            : todo
        )
      );

      toast.success(
        !completed ? "Todo completed 🎉" : "Todo marked incomplete"
      );
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const onSubmitHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (title.trim().length <= 0) {
      toast.error("Title is required");
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

      setTodos((prev) => [...prev, response.data.data]);

      toast.success("Todo added successfully ✨");
      setTitle("");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    todolist();
  }, []);

  const completedTodos = todos.filter((todo) => todo.completed).length;
  const pendingTodos = todos.length - completedTodos;

  return (
    <main className="min-h-screen overflow-hidden bg-[#080808] text-white">
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[-180px] top-[-180px] h-[500px] w-[500px] rounded-full bg-fuchsia-600/30 blur-[140px]"
        />

        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[-180px] top-[20%] h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[140px]"
        />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-10 md:px-10 lg:py-16">

        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="mb-5 flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.25)]"
            >
              <Sparkles size={23} />
            </motion.div>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-white/60 backdrop-blur-xl">
              Personal Productivity
            </span>
          </div>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="text-6xl font-black leading-[0.9] tracking-tighter sm:text-7xl lg:text-8xl">
                GET
                <span className="block bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  THINGS
                </span>
                <span className="block">DONE.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-white/50 md:text-lg">
                Your tasks. Your rules. One brutally simple place to
                organize everything that needs to get done.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl">
              <div className="rounded-2xl bg-fuchsia-500/10 p-4 text-fuchsia-400">
                <Zap size={24} />
              </div>

              <div className="pr-5">
                <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                  Productivity
                </p>
                <p className="text-xl font-black">
                  {todos.length === 0
                    ? "Let's start"
                    : `${Math.round(
                        (completedTodos / todos.length) * 100
                      )}% complete`}
                </p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* STATS */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl"
          >
            <ListTodo className="mb-5 text-cyan-400" size={28} />

            <p className="text-sm font-bold uppercase tracking-widest text-white/40">
              Total Tasks
            </p>

            <p className="mt-1 text-5xl font-black">{todos.length}</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl"
          >
            <Circle className="mb-5 text-yellow-400" size={28} />

            <p className="text-sm font-bold uppercase tracking-widest text-white/40">
              Pending
            </p>

            <p className="mt-1 text-5xl font-black">{pendingTodos}</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl"
          >
            <CheckCircle2 className="mb-5 text-emerald-400" size={28} />

            <p className="text-sm font-bold uppercase tracking-widest text-white/40">
              Completed
            </p>

            <p className="mt-1 text-5xl font-black">{completedTodos}</p>
          </motion.div>
        </div>

        {/* ADD TODO */}
        <motion.form
          onSubmit={onSubmitHandler}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 rounded-[32px] border border-white/10 bg-white/[0.06] p-3 shadow-2xl backdrop-blur-2xl"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Plus
                className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30"
                size={22}
              />

              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="h-16 rounded-[24px] border-white/10 bg-black/40 pl-14 text-lg text-white placeholder:text-white/25 focus-visible:ring-fuchsia-500"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-16 rounded-[24px] bg-white px-8 font-black text-black transition-all hover:scale-[1.02] hover:bg-fuchsia-400"
            >
              {loading ? "ADDING..." : "ADD TASK"}
              <Plus size={20} />
            </Button>
          </div>
        </motion.form>

        {/* TODO LIST */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-fuchsia-400">
                Your workspace
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight">
                All Tasks
              </h2>
            </div>

            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white/50">
              {todos.length} {todos.length === 1 ? "task" : "tasks"}
            </div>
          </div>

          {todos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-[36px] border border-dashed border-white/10 bg-white/[0.025] px-6 py-24 text-center"
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20">
                <ListTodo size={36} className="text-white/50" />
              </div>

              <h3 className="text-2xl font-black">
                Nothing here yet.
              </h3>

              <p className="mt-2 text-white/40">
                Add your first task and start crushing your goals.
              </p>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence mode="popLayout">
                {todos.map((todo, index) => (
                  <motion.div
                    key={todo.id}
                    layout
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.8,
                      x: 100,
                    }}
                    transition={{
                      duration: 0.35,
                      delay: index * 0.04,
                    }}
                    whileHover={{ scale: 1.01 }}
                    className={`group relative overflow-hidden rounded-[30px] border p-5 backdrop-blur-xl transition-all md:p-6 ${
                      todo.completed
                        ? "border-emerald-500/20 bg-emerald-500/[0.04]"
                        : "border-white/10 bg-white/[0.045] hover:border-fuchsia-500/30"
                    }`}
                  >
                    {/* Number */}
                    <div className="absolute right-6 top-5 text-6xl font-black text-white/[0.035]">
                      {(index + 1).toString().padStart(2, "0")}
                    </div>

                    <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                      <div className="flex min-w-0 items-start gap-5">
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={() =>
                            toggle(todo.id, todo.completed)
                          }
                          className={`mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-all ${
                            todo.completed
                              ? "border-emerald-400 bg-emerald-400 text-black shadow-[0_0_25px_rgba(52,211,153,0.3)]"
                              : "border-white/15 bg-white/5 text-white/30 hover:border-fuchsia-400 hover:text-fuchsia-400"
                          }`}
                        >
                          {todo.completed ? (
                            <Check size={23} strokeWidth={3} />
                          ) : (
                            <Circle size={22} />
                          )}
                        </motion.button>

                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-3">
                            <h3
                              className={`break-words text-xl font-black md:text-2xl ${
                                todo.completed
                                  ? "text-white/30 line-through"
                                  : "text-white"
                              }`}
                            >
                              {todo.title}
                            </h3>

                            <span
                              className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                                todo.completed
                                  ? "bg-emerald-400/10 text-emerald-400"
                                  : "bg-fuchsia-400/10 text-fuchsia-400"
                              }`}
                            >
                              {todo.completed
                                ? "Completed"
                                : "In Progress"}
                            </span>
                          </div>

                          {todo.description && (
                            <p className="max-w-2xl text-sm leading-6 text-white/40">
                              {todo.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <Button
                          variant="outline"
                          onClick={() =>
                            toggle(todo.id, todo.completed)
                          }
                          className={`h-11 rounded-xl border-white/10 bg-white/5 font-bold hover:bg-white/10 ${
                            todo.completed
                              ? "text-yellow-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {todo.completed ? (
                            <>
                              <Circle size={17} />
                              Undo
                            </>
                          ) : (
                            <>
                              <Check size={17} />
                              Done
                            </>
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() =>
                            deleteHandler(todo.id)
                          }
                          className="h-11 rounded-xl border-red-500/10 bg-red-500/5 text-red-400 hover:border-red-500/30 hover:bg-red-500/10"
                        >
                          <Trash2 size={17} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* FOOTER */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center text-xs font-bold uppercase tracking-[0.2em] text-white/20 md:flex-row md:text-left"
        >
          <p>Built for getting things done.</p>

          <p>
            {completedTodos} / {todos.length} completed
          </p>
        </motion.footer>
      </div>
    </main>
  );
};

export default Homepage
