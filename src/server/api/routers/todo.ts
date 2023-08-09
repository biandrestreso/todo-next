import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
  getAllForCurrentUser: protectedProcedure
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

  addTodo: protectedProcedure
    .input(z.object({ title: z.string(), userId: z.string() })).mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.create({
        data: {
          title: input.title,
          userId: input.userId,
        },
      });
      return todo;
    }),

  toggleCompleted: protectedProcedure
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

  deleteTodo: protectedProcedure
    .input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.delete({
        where: {
          id: input.id,
        },
      });
      return todo;
    }),
});
