import { createStore, storeKey } from 'vuex'
import createPersistedState from "vuex-persistedstate";
import { reactive } from "vue"

export default createStore({
  state: reactive({
    todos: [],
    todosCopy: [],
  }),
  mutations: {
    // Mutate state
    SET_TODOS: ( state, payload ) => {
      state.todos =  [...payload];
    },
    SET_TODOS_COPY: ( state, payload ) => {
      state.todosCopy = [...payload];
    },
  },
  actions: {
    // Async operations
  },
  getters: {
    getTodos: state  => state.todos,
    getTodosCopy: state => state.todosCopy,
  },
  modules: {
  },

  // Save to the browser's memory (local storage)
  plugins: [createPersistedState()],
})
