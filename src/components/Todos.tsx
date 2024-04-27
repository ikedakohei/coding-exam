import { getTodos } from '@/api/todo';
import Loading from '@/components/Loading';
import TodoForm from '@/components/TodoForm';
import type { Todo } from '@/types/todo';
import { PencilSquareIcon } from '@heroicons/react/16/solid';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export default function Todos() {
  const { data: todos, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  });

  const [open, setOpen] = useState(false);
  const [editableTodo, setEditableTodo] = useState<Todo>();

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <Loading />
      </div>
    );

  return (
    <>
      <div className="space-y-2">
        {todos && todos.length !== 0 ? (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between space-x-5 border-2 border-gray-500 px-4 py-2 rounded-xl"
            >
              <div>
                <div className="text-nowrap w-1/12 text-xs text-gray-500 mr-1">
                  ID: {todo.id}
                </div>
                <div className="break-words whitespace-pre-wrap">
                  {todo.title}
                </div>
              </div>
              <div className="flex items-start space-x-2 text-nowrap">
                <div className="text-center">
                  <div className="text-xs text-gray-500">完了</div>
                  <input
                    id={`todo-${todo.id.toString()}`}
                    aria-describedby="comments-description"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    defaultChecked={todo.completed}
                  />
                </div>
                <div>
                  <div className="text-center text-xs text-gray-500">編集</div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditableTodo(todo);
                      setOpen(true);
                    }}
                  >
                    <PencilSquareIcon className="text-indigo-600 h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">タスクなし</div>
        )}
      </div>
      <TodoForm open={open} setOpen={setOpen} todo={editableTodo} />
    </>
  );
}
