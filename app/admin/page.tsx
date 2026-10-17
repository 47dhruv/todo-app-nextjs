"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    motion,
    AnimatePresence,
} from "framer-motion";
import {
    ShieldCheck,
    Users,
    Mail,
    CheckCircle2,
    XCircle,
    RefreshCw,
    ShieldAlert,
    ArrowLeft,
    Loader2,
    Crown,
    ListTodo,
    UserCog,
} from "lucide-react";

interface AdminUser {
    id: string;
    email: string | null;
    isSubscribed: boolean;
    role: string;
    _count: {
        todos: number;
    };
}

const AdminPage = () => {
    const router = useRouter();

    const [users, setUsers] = useState<AdminUser[]>([]);
    const [denied, setDenied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const loadUsers = async () => {
        try {
            setLoading(true);

            const response = await axios.get("/api/admin/users");
            setUsers(response.data.users);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;

                if (status === 401) {
                    router.push("/sign-in");
                } else if (status === 403) {
                    setDenied(true);
                } else {
                    toast.error(
                        error.response?.data?.message ?? "Failed to load users."
                    );
                }
            } else {
                toast.error("Something went wrong while loading users.");
            }
        } finally {
            setLoading(false);
        }


    };

    const toggleSubscription = async (
        id: string,
        current: boolean
    ) => {
        try {
            setUpdatingId(id);


            const response = await axios.patch(`/api/admin/users/${id}`, {
                isSubscribed: !current,
            });

            toast.success(response.data.message);

            setUsers((prev) =>
                prev.map((user) =>
                    user.id === id
                        ? {
                            ...user,
                            isSubscribed: response.data.data.isSubscribed,
                        }
                        : user
                )
            );
        } catch (error: unknown) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message
                : undefined;

            toast.error(message ?? "Subscription update failed.");
        } finally {
            setUpdatingId(null);
        }


    };

    useEffect(() => {
        loadUsers();
    }, []);

    const subscribedCount = users.filter(
        (user) => user.isSubscribed
    ).length;

    const totalTodos = users.reduce(
        (total, user) => total + user._count.todos,
        0
    );

    if (denied) {
        return (<main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#171717] px-5 text-[#f5f5f5]">
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.13]"
                style={{
                    backgroundImage:
                        "radial-gradient(#a3a3a3 1px, transparent 1px)",
                    backgroundSize: "22px 22px",
                }}
            />


            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md rounded-3xl border border-[#393939] bg-[#222222] p-8 text-center shadow-2xl"
            >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#e49385]/30 bg-[#e49385]/10">
                    <ShieldAlert className="h-8 w-8 text-[#e49385]" />
                </div>

                <h1 className="text-2xl font-bold tracking-tight">
                    Access restricted
                </h1>

                <p className="mt-3 text-sm leading-6 text-[#a3a3a3]">
                    You don&apos;t have permission to access the admin
                    dashboard. Contact an administrator if you believe this
                    is a mistake.
                </p>

                <button
                    onClick={() => router.push("/")}
                    className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#e49385] px-5 py-3 text-sm font-semibold text-[#171717] transition hover:bg-[#f0a497] active:scale-[0.98]"
                >
                    <ArrowLeft size={16} />
                    Back to homepage
                </button>
            </motion.div>
        </main>
        );


    }

    return (<main className="relative min-h-screen overflow-hidden bg-[#171717] text-[#f5f5f5]">
        {/* Dotted background */}
        <div
            className="pointer-events-none fixed inset-0 opacity-[0.12]"
            style={{
                backgroundImage:
                    "radial-gradient(#a3a3a3 1px, transparent 1px)",
                backgroundSize: "22px 22px",
            }}
        />


        {/* Ambient accents */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#a2d7cb]/[0.06] blur-3xl" />
        <div className="pointer-events-none absolute -left-40 top-[35rem] h-96 w-96 rounded-full bg-[#e49385]/[0.05] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8 flex flex-col justify-between gap-5 border-b border-[#333333] pb-7 sm:flex-row sm:items-center"
            >
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#a2d7cb]/20 bg-[#a2d7cb]/10">
                        <ShieldCheck className="h-6 w-6 text-[#a2d7cb]" />
                    </div>

                    <div>
                        <div className="mb-1 flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#a2d7cb]">
                                Control center
                            </span>
                            <span className="rounded-md border border-[#393939] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#a3a3a3]">
                                Admin
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            User management
                            <span className="text-[#e49385]">.</span>
                        </h1>

                        <p className="mt-1 text-sm text-[#a3a3a3]">
                            Manage users, subscriptions, and platform activity.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push("/")}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#393939] bg-[#222222] px-4 py-2.5 text-sm font-medium text-[#d4d4d4] transition hover:border-[#555555] hover:bg-[#292929]"
                    >
                        <ArrowLeft size={15} />
                        Homepage
                    </button>

                    <button
                        onClick={loadUsers}
                        disabled={loading}
                        aria-label="Refresh users"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e49385] px-4 py-2.5 text-sm font-bold text-[#171717] transition hover:bg-[#f0a497] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw
                            size={15}
                            className={loading ? "animate-spin" : ""}
                        />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                </div>
            </motion.header>

            {/* Statistics */}
            <section
                aria-label="User statistics"
                className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
            >
                {[
                    {
                        label: "Total users",
                        value: users.length,
                        icon: Users,
                        accent: "mint",
                        description: "Registered accounts",
                    },
                    {
                        label: "Subscribed",
                        value: subscribedCount,
                        icon: Crown,
                        accent: "coral",
                        description: "Active subscriptions",
                    },
                    {
                        label: "Total tasks",
                        value: totalTodos,
                        icon: ListTodo,
                        accent: "mint",
                        description: "Tasks across all users",
                    },
                ].map((stat, index) => {
                    const Icon = stat.icon;
                    const isCoral = stat.accent === "coral";

                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08, duration: 0.35 }}
                            className="rounded-2xl border border-[#383838] bg-[#222222]/90 p-5 transition-colors hover:border-[#505050]"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-[#a3a3a3]">
                                        {stat.label}
                                    </p>

                                    <p className="mt-3 text-3xl font-bold tracking-tight">
                                        {stat.value}
                                    </p>

                                    <p className="mt-2 text-xs text-[#858585]">
                                        {stat.description}
                                    </p>
                                </div>

                                <div
                                    className={`flex h-11 w-11 items-center justify-center rounded-xl border ${isCoral
                                            ? "border-[#e49385]/20 bg-[#e49385]/10 text-[#e49385]"
                                            : "border-[#a2d7cb]/20 bg-[#a2d7cb]/10 text-[#a2d7cb]"
                                        }`}
                                >
                                    <Icon size={21} />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </section>

            {/* Users table */}
            <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="overflow-hidden rounded-2xl border border-[#383838] bg-[#222222]/95"
            >
                <div className="flex flex-col gap-3 border-b border-[#383838] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <h2 className="text-lg font-bold">All users</h2>
                        <p className="mt-1 text-sm text-[#a3a3a3]">
                            Review accounts and manage subscription access.
                        </p>
                    </div>

                    <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#393939] bg-[#292929] px-3 py-2 text-xs font-medium text-[#d4d4d4]">
                        <span className="h-2 w-2 rounded-full bg-[#a2d7cb]" />
                        {users.length} {users.length === 1 ? "user" : "users"}
                    </span>
                </div>

                {loading ? (
                    <div className="flex min-h-64 flex-col items-center justify-center gap-4 px-6 text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[#a2d7cb]" />
                        <p className="text-sm text-[#a3a3a3]">
                            Loading user accounts...
                        </p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#393939] bg-[#292929]">
                            <Users className="h-6 w-6 text-[#a2d7cb]" />
                        </div>

                        <h3 className="text-base font-semibold">
                            No users found
                        </h3>

                        <p className="mt-2 max-w-sm text-sm text-[#a3a3a3]">
                            There are no user accounts to display right now.
                        </p>

                        <button
                            onClick={loadUsers}
                            className="mt-5 rounded-xl border border-[#444444] px-4 py-2 text-sm font-medium transition hover:bg-[#292929]"
                        >
                            Try again
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-[#383838] bg-[#292929]/70">
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a3a3a3]">
                                        User
                                    </th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a3a3a3]">
                                        Tasks
                                    </th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a3a3a3]">
                                        Subscription
                                    </th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a3a3a3]">
                                        Role
                                    </th>
                                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.18em] text-[#a3a3a3]">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#353535]">
                                <AnimatePresence initial={false}>
                                    {users.map((user) => {
                                        const isUpdating = updatingId === user.id;

                                        return (
                                            <motion.tr
                                                key={user.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="transition-colors hover:bg-[#292929]/70"
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#454545] bg-[#303030] text-[#a2d7cb]">
                                                            <Mail size={17} />
                                                        </div>

                                                        <div className="max-w-[260px]">
                                                            <p className="truncate text-sm font-semibold text-[#f5f5f5]">
                                                                {user.email ?? "No email available"}
                                                            </p>
                                                            <p className="mt-1 text-xs text-[#858585]">
                                                                ID: {user.id.slice(0, 8)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span className="inline-flex items-center gap-2 rounded-lg border border-[#393939] bg-[#292929] px-3 py-2 text-sm font-semibold tabular-nums">
                                                        <ListTodo
                                                            size={15}
                                                            className="text-[#a2d7cb]"
                                                        />
                                                        {user._count.todos}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5">
                                                    {user.isSubscribed ? (
                                                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#a2d7cb]/20 bg-[#a2d7cb]/10 px-3 py-2 text-xs font-semibold text-[#a2d7cb]">
                                                            <CheckCircle2 size={14} />
                                                            Subscribed
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#555555]/40 bg-[#303030] px-3 py-2 text-xs font-semibold text-[#b0b0b0]">
                                                            <XCircle size={14} />
                                                            Not subscribed
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span className="inline-flex items-center gap-2 text-sm capitalize text-[#d4d4d4]">
                                                        <UserCog
                                                            size={15}
                                                            className="text-[#e49385]"
                                                        />
                                                        {user.role}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5 text-right">
                                                    <button
                                                        onClick={() =>
                                                            toggleSubscription(
                                                                user.id,
                                                                user.isSubscribed
                                                            )
                                                        }
                                                        disabled={isUpdating}
                                                        className={`inline-flex min-w-[150px] items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${user.isSubscribed
                                                                ? "border-[#e49385]/30 bg-[#e49385]/10 text-[#e49385] hover:bg-[#e49385]/20"
                                                                : "border-[#a2d7cb]/30 bg-[#a2d7cb]/10 text-[#a2d7cb] hover:bg-[#a2d7cb]/20"
                                                            }`}
                                                    >
                                                        {isUpdating ? (
                                                            <Loader2
                                                                size={14}
                                                                className="animate-spin"
                                                            />
                                                        ) : user.isSubscribed ? (
                                                            <XCircle size={14} />
                                                        ) : (
                                                            <CheckCircle2 size={14} />
                                                        )}

                                                        {isUpdating
                                                            ? "Updating..."
                                                            : user.isSubscribed
                                                                ? "Remove subscription"
                                                                : "Enable subscription"}
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Footer */}
                {!loading && users.length > 0 && (
                    <div className="flex flex-col gap-2 border-t border-[#383838] bg-[#292929]/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <p className="text-xs text-[#858585]">
                            Showing{" "}
                            <span className="font-semibold text-[#d4d4d4]">
                                {users.length}
                            </span>{" "}
                            registered {users.length === 1 ? "user" : "users"}
                        </p>

                        <p className="flex items-center gap-2 text-xs text-[#858585]">
                            <ShieldCheck size={14} className="text-[#a2d7cb]" />
                            Admin dashboard
                        </p>
                    </div>
                )}
            </motion.section>

            <footer className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[#333333] pt-5 text-xs text-[#777777] sm:flex-row">
                <p>
                    TODO.STUDIO <span className="text-[#e49385]">/</span> Admin
                    console
                </p>
                <p>Manage responsibly. Keep your workspace organized.</p>
            </footer>
        </div>
    </main>


    );
};

export default AdminPage;
