/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { Loader } from './components/Loader';
import { ErrorNotification } from './components/ErrorNotifications';

enum TodoError {
  LOAD = 'Unable to load todos',
  EMPTY_TITLE = 'Title should not be empty',
  ADD = 'Unable to add a todo',
  DELETE = 'Unable to delete a todo',
  UPDATE = 'Unable to update a todo',
}

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const activeCount = todos.filter(todo => !todo.completed).length;

  const filtredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  function loadTodos() {
    setIsLoading(true);
    setError(null);

    getTodos()
      .then(setTodos)
      .catch(() => setError(TodoError.LOAD))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [error]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {isLoading && <Loader />}

      <div className="todoapp__content">
        <TodoHeader />

        {todos.length > 0 && <TodoList todos={filtredTodos} />}

        {todos.length > 0 && (
          <TodoFooter
            activeCount={activeCount}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </div>

      <ErrorNotification error={error} onClose={() => setError(null)} />
    </div>
  );
};
