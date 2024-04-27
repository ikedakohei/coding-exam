import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

import { base } from '@/const/base';
import type { Todo } from '@/types/todo';
import { ExclamationCircleIcon } from '@heroicons/react/16/solid';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Loading from './Loading';

const postTodo = async ({
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

export default function PostTodo() {
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = () => {
    setTitle('');
    setTitleError('');
    setOpen(true);
  };
  const closeModal = () => {
    setTitle('');
    setTitleError('');
    setOpen(false);
  };

  const queryClient = useQueryClient();
  const postTodoMutation = useMutation({
    mutationFn: postTodo,
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
      if ('error' in data) {
        setTitleError(data.error);
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      closeModal();
      toast.success('タスクを作成しました');
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  return (
    <>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => {
            openModal();
          }}
          className="mb-5 w-1/2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          新規作成
        </button>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => false}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div>
                      <div className="text-center">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          新規作成
                        </Dialog.Title>
                        <div className="mt-5 relative">
                          <label
                            htmlFor="new-todo"
                            className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                          >
                            タイトル
                          </label>
                          <input
                            type="text"
                            id="new-todo"
                            className="block w-full rounded-md border-0 px-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={(e) => setTitle(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    {isLoading ? (
                      <div className="flex justify-center space-x-2 mt-5">
                        <Loading />
                        <div>作成中...</div>
                      </div>
                    ) : (
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => postTodoMutation.mutate({ title })}
                          disabled={!title.trim()}
                        >
                          作成する
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                          onClick={closeModal}
                        >
                          キャンセル
                        </button>
                      </div>
                    )}
                    {titleError && (
                      <div
                        className="flex justify-center mt-4 text-sm text-red-600"
                        id="email-error"
                      >
                        <ExclamationCircleIcon
                          className="h-5 w-5 text-red-500"
                          aria-hidden="true"
                        />
                        <div className="ml-1">{titleError}</div>
                      </div>
                    )}
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
