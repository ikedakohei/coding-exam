import { deleteTodo, getTodos, updateTodo } from '@/api/todo';
import Loading from '@/components/Loading';
import TodoForm from '@/components/TodoForm';
import type { Todo } from '@/types/todo';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/16/solid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function Todos() {
  const { data: todos, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  });

  const [open, setOpen] = useState(false);
  const [editableTodo, setEditableTodo] = useState<Todo>();

  const queryClient = useQueryClient();
  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: (data) => {
      if ('error' in data) {
        toast.error(data.error);
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: (data) => {
      if ('error' in data) {
        toast.error(data.error);
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('タスクを削除しました');
    },
  });

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
                    checked={todo.completed}
                    onChange={(e) => {
                      updateTodoMutation.mutate({
                        id: todo.id,
                        completed: e.target.checked,
                      });
                    }}
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
                <div>
                  <div className="text-center text-xs text-gray-500">削除</div>
                  <button
                    type="button"
                    onClick={() => {
                      deleteTodoMutation.mutate({ id: todo.id });
                    }}
                  >
                    <TrashIcon className="text-red-500 h-5 w-5" />
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
