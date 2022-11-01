import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface TODO {
  id: string | number;
  uid: string;
  title: string;
  date: any;
  detail: string;
  status: string;
}

export const todosSlice = createSlice({
  name: "todos",
  initialState: {
    todos: Array(),
  },

  reducers: {
    addTodos: (state, action) => {
      state.todos = action.payload;
    },
    updateTodos: (state, action: PayloadAction<TODO>) => {
      state.todos = [...state.todos, action.payload];
    },
    deleteTodos: (state, action) => {
      state.todos = state.todos.filter(
        (value, index) => index !== action.payload.index
      );
    },
    changeTitle: (state, action) => {
      const newTodos = [...state.todos];
      newTodos[action.payload.index].title = action.payload.title;
      state.todos = newTodos;
    },
    changeDate: (state, action) => {
      const newTodos = [...state.todos];
      newTodos[action.payload.index].date = action.payload.date;
      state.todos = newTodos;
    },
    changeDetail: (state, action) => {
      const newTodos = [...state.todos];
      newTodos[action.payload.index].detail = action.payload.detail;
      state.todos = newTodos;
    },
    changeStatus: (state, action) => {
      const newTodos = [...state.todos];
      newTodos[action.payload.index].status = action.payload.status;
      state.todos = newTodos;
    },
  },
});

export const {
  addTodos,
  updateTodos,
  deleteTodos,
  changeTitle,
  changeDate,
  changeDetail,
  changeStatus,
} = todosSlice.actions;

export const Todos = (state: RootState) => state.todo.todos;
export const TodosMaxIndex = (state: RootState) =>
  state.todo.todos.length > 0 ? state.todo.todos.length : 0;

export default todosSlice.reducer;
