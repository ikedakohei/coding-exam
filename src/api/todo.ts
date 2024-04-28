import { base } from '@/const/base';
import type { Todo } from '@/types/todo';

export const getTodos = async (): Promise<Todo[]> => {
  const res = await fetch(`${base.url}/todos`);
  return res.json();
};

export const createTodo = async ({
  title,
}: { title: string }): Promise<Todo | { error: string }> => {
  const res = await fetch(`${base.url}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });
  return res.json();
};

export const updateTodo = async ({
  id,
  title,
  completed,
}: { id: number; title?: string; completed?: boolean }): Promise<
  Todo | { error: string }
> => {
  const res = await fetch(`${base.url}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, completed }),
  });
  return res.json();
};

export const deleteTodo = async ({
  id,
}: { id: number }): Promise<{ message?: string; error?: string }> => {
  const res = await fetch(`${base.url}/todos/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};
