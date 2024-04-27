import TodoForm from '@/components/TodoForm';
import { useState } from 'react';

export default function PostTodo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => {
            setOpen(true);
          }}
          className="mb-5 w-1/2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          新規作成
        </button>
      </div>
      <TodoForm open={open} setOpen={setOpen} />
    </>
  );
}
