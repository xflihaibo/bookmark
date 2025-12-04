import React, { useState, useEffect } from 'react';
import { TodoItem, TodoPanelProps } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { BOOKMARK_STORAGE_KEYS } from '@/enum/bookmarks';

export const TodoPanel: React.FC<TodoPanelProps> = ({ show, onClose }) => {
  const { isDark } = useTheme();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    if (show) {
      const savedTodos = localStorage.getItem(BOOKMARK_STORAGE_KEYS.TASK_ITEMS);
      if (savedTodos) {
        setTodos(JSON.parse(savedTodos));
      }
    }
  }, [show]);

  useEffect(() => {
    if (show) {
      localStorage.setItem(BOOKMARK_STORAGE_KEYS.TASK_ITEMS, JSON.stringify(todos));
    }
  }, [todos, show]);

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      const newItem: TodoItem = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false
      };
      setTodos([...todos, newItem]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      <div className={`w-full max-w-[548px] backdrop-blur-lg rounded-2xl p-5 pb-10 border shadow-xl transform transition-all duration-300 ${isDark ? 'bg-white/10 border-white/18' : 'bg-white/70 border-gray-200'}`}
        onClick={handleModalClick}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>待办事项</h3>
          <button 
            onClick={onClose}
            className={`text-xl p-1 rounded-full transition-colors ${isDark ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="flex gap-2 mb-5">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="添加新的待办事项..."
            className={`flex-1 border rounded-full px-4 py-2.5 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${isDark ? 'bg-white/20 border-white/18 text-white focus:ring-white/30' : 'bg-white/80 border-gray-300 text-gray-800 focus:ring-blue-300'}`}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
          />
          <button 
            onClick={handleAddTodo}
            className={`border rounded-full px-4 py-2.5 transition-all ${isDark ? 'bg-white/20 hover:bg-white/30 border-white/18 text-white' : 'bg-white/80 hover:bg-white border-gray-300 text-gray-800'}`}
          >
            <i className="fas fa-plus transition-transform duration-300 hover:scale-110"></i>
          </button>
        </div>
        
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {todos.length === 0 ? (
            <div className={`text-center italic py-10 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
              <i className="fas fa-tasks text-3xl mb-2 opacity-50"></i>
              <p>暂无待办内容</p>
              <p className="text-sm mt-1 opacity-70">添加任务开始管理时间</p>
            </div>
          ) : (
            todos.map(todo => (
              <div 
                key={todo.id} 
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 transition-all ${isDark ? 'bg-white/10 hover:bg-white/15' : 'bg-white/60 hover:bg-white'}`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="accent-blue-400 h-5 w-5 cursor-pointer"
                  />
                  <span 
                    className={`${todo.completed ? 'line-through' : ''} transition-colors ${isDark ? todo.completed ? 'text-gray-400' : 'text-white' : todo.completed ? 'text-gray-400' : 'text-gray-800'}`}
                  >
                    {todo.text}
                  </span>
                </div>
                <button 
                  onClick={() => deleteTodo(todo.id)}
                  className={`p-1 rounded-full transition-all ${isDark ? 'text-gray-400 hover:text-red-400 hover:bg-red-400/10' : 'text-gray-500 hover:text-red-600 hover:bg-red-100'}`}
                  aria-label="删除"
                >
                  <i className="fas fa-trash-alt transition-transform duration-300 hover:scale-110"></i>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}