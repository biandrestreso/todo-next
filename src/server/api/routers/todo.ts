import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAllForCurrentUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.todo.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          user: true,
        }
      });
    }),

  addTodo: publicProcedure
    .input(z.object({ title: z.string(), userId: z.string() })).mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.create({
        data: {
          title: input.title,
          userId: input.userId,
        },
      });
      return todo;
    }),

  toggleCompleted: publicProcedure
    .input(z.object({ id: z.string(), completed: z.boolean() })).mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          completed: input.completed,
        },
      });
      return todo;
    }),

  deleteTodo: publicProcedure
    .input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.delete({
        where: {
          id: input.id,
        },
      });
      return todo;
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
