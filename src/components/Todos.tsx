import { base } from '@/const/base';
import type { Todo } from '@/types/todo';
import { useQuery } from '@tanstack/react-query';

const getTodos = async (): Promise<Todo[]> => {
  const res = await fetch(`${base.url}/todos`);
  return res.json();
};

export default function Todos() {
  const { data: todos } = useQuery({ queryKey: ['todos'], queryFn: getTodos });

  return (
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
            <div className="text-nowrap">
              <div>
                <div className="text-center text-xs text-gray-500">完了</div>
                <div className="text-center">
                  <input
                    id={`todo-${todo.id.toString()}`}
                    aria-describedby="comments-description"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    defaultChecked={todo.completed}
                  />
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">タスクなし</div>
      )}
    </div>
  );
}
