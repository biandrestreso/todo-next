import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { api } from "~/utils/api";

export default function Home() {
  return (
    <>
      <Head>
        <title>Code and Coffee</title>
        <meta name="description" content="Todos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-col items-center gap-2">
            <Todos />
          </div>
        </div>
      </main>
    </>
  );
}

function Todos() {
  const { data: sessionData } = useSession();
  const utils = api.useContext();

  const addTodo = api.todo.addTodo.useMutation({
    async onSuccess() {
      await utils.todo.getAllForCurrentUser.invalidate();
    },
  });

  const toggleCompleted = api.todo.toggleCompleted.useMutation({
    async onSuccess() {
      await utils.todo.getAllForCurrentUser.invalidate();
    },
  });

  const deleteTodo = api.todo.deleteTodo.useMutation({
    async onSuccess() {
      await utils.todo.getAllForCurrentUser.invalidate();
    },
  });

  function toggleCompletedHandler(id: string, completed: boolean) {
    toggleCompleted.mutate({
      id,
      completed,
    });
  }

  function deleteHandler(id: string) {
    deleteTodo.mutate({
      id,
    });
  }

  const { data: todos } = api.todo.getAllForCurrentUser.useQuery({
    userId: sessionData?.user?.id ?? "",
  });

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
      {todos && sessionData && (
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-2">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between gap-2 text-white"
              >
                <span>{todo.title}</span>
                <span>{todo.completed ? "✅" : "❌"}</span>
                <button
                  className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                  onClick={() =>
                    toggleCompletedHandler(todo.id, !todo.completed)
                  }
                >
                  Toggle completed
                </button>
                <button
                  className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                  onClick={() => deleteHandler(todo.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <input
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            placeholder="Add todo"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTodo.mutate({
                  userId: sessionData?.user?.id ?? "",
                  title: e.currentTarget.value,
                });
                e.currentTarget.value = "";
              }
            }}
          />
        </div>
      )}

      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
