import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../autoapi';


export const fetchTodos = createAsyncThunk('todos/fetchTodos', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/todos');
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const addTask = createAsyncThunk('todos/addTask', async (todoData, { rejectWithValue }) => {
    try {
        const response = await api.post('/todos', todoData);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const updateTodo = createAsyncThunk('todos/updateTodo', async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await api.put(`/todos/${id}`, data);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/todos/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

const todoSlice = createSlice({
    name: 'todos',
    initialState: {
        items: [],
        status: 'idle', 
        error: null
    },
    reducers: {
        resetTodoStatus: (state) => {
            state.status = 'idle';
        }
    },
    
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.pending, (state) => {
                state.status = 'loading';
            })
           // ... আগের কোড ঠিক থাকবে

           .addCase(fetchTodos.fulfilled, (state, action) => {
            state.status = 'succeeded';
            
            // API রেসপন্স যদি সরাসরি এরে হয় অথবা অবজেক্টের ভেতর ডেটা থাকে
            let incomingData = [];
            
            if (Array.isArray(action.payload)) {
                incomingData = action.payload; // সরাসরি array হলে
            } else if (action.payload && Array.isArray(action.payload.data)) {
                incomingData = action.payload.data; // { data: [] } ফরম্যাট হলে
            } else if (action.payload && typeof action.payload === 'object') {
                // যদি অন্য কোনো কি-তে ডেটা থাকে (যেমন: response.data.todos)
                incomingData = action.payload.todos || action.payload.items || [];
            }
        
            state.items = incomingData;
            state.error = null;
        })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            
            .addCase(addTask.fulfilled, (state, action) => {
                if (!Array.isArray(state.items)) state.items = [];
                    const newTask = action.payload?.data || action.payload;
                state.items.unshift(newTask);
            })
    
            .addCase(updateTodo.fulfilled, (state, action) => {
                if (!Array.isArray(state.items)) return;
                
                const updatedTask = action.payload?.data || action.payload;
                const index = state.items.findIndex(item => item._id === updatedTask._id);
                if (index !== -1) {
                    state.items[index] = updatedTask;
                }
            })
    
            .addCase(deleteTodo.fulfilled, (state, action) => {
                if (!Array.isArray(state.items)) return;
                state.items = state.items.filter(item => item._id !== action.payload);
            });
    }
});

export const { resetTodoStatus } = todoSlice.actions;
export default todoSlice.reducer;