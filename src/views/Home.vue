<template>
  <div class="home">
    <!-- <Header /> -->
    <div class="banner d-flex align-items-center justify-content-center">
      <h1>ToDo App</h1>
    </div>
    <div class="cards todo">
      <div class="form-floating col-12 col-md-6">
        <input v-model="user" type="text" class="form-control" id="floatingInput" placeholder="Search by name or e-mail">
      </div>
      <div class="card-list-box d-flex scroll-bar">
        <div v-for="user in data.userTodos" :key="user.id" class="card-list">
          <div
            class="user-header d-flex align-items-center justify-content-between px-3 py-2 scroll-bar"
          >
            <div class="user-image rounded-circle overflow-hidden">
              <img
                :src="require('@/assets/avatar.webp')"
                alt="profile"
                class="w-100"
              />
            </div>
            <div>
              <div class="text-muted footer-font">{{ user.name }}</div>
              <div class="text-muted footer-font">{{ user.email }}</div>
            </div>
            <div>
              <b
                class="text-primary main-card-sort cursor-pointer"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                >...</b
              >
              <div class="dropdown-menu" style="">
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="sortTodos(user.id, true)"
                  >Completed</a
                >
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="sortTodos(user.id, false)"
                  >Pending</a
                >
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="sortTodos(user.id, 'All')"
                  >All</a
                >
              </div>
            </div>
          </div>
          <div class="todo-list-box w-100 scroll-bar" :id="'todo-box-'+user.id">
            <div
              v-for="todo in user.todos"
              :key="todo.id"
              class="mr-2 mb-1 ml-2"
            >
              <Task
                :todo="todo.title"
                :completed="todo.completed"
                @statusClick="changeStatus($event, user.id, todo.id)"
              />
            </div>
            <div class="mr-2 ml-2 collapse" :class="'collapseTextarea-'+user.id">
              <textarea autofocus class="w-100 textarea px-3 py-2" rows="2" :id="user.id"></textarea>
            </div>
          </div>

          <div
            class="add-todo text-muted cursor-pointer text-primary"
            data-toggle="collapse" :data-target="'.collapseTextarea-'+user.id" aria-expanded="false" aria-controls="collapseExample"
          >
            <div class="show" :class="'collapseTextarea-'+user.id" @click="scrollCardsToBottom('todo-box-'+user.id, user.id)">
              <div>+ Add another task</div>
            </div>
            <div class="collapse pl-2 pr-3 pt-1" :class="'collapseTextarea-'+user.id">
              <div class="d-flex justify-content-between">
                <div>
                  <button type="button" class="btn btn-success btn-sm mr-2" @click="saveTodo(user.id)">Add Todo</button>
                  <span class="d-inline-block pl-2">X</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import Header from "@/components/Header.vue";
import Task from "@/components/Task.vue";

import { ref, reactive, onBeforeMount, watch } from "vue";
import { useStore } from "vuex";
import axios from "@/axios";

export default {
  name: "Home",
  components: { Header, Task },
  setup() {
    const store = useStore();
    let data = reactive({
      name: "kundan",
      userTodos: store.getters.getTodos,
      userTodosCopy: store.getters.getTodosCopy,
    });
    let user = ref("");

    if (Object.keys(data.userTodos).length === 0) {
      onBeforeMount(async () => {
        await axios
          .get("https://jsonplaceholder.typicode.com/users")
          .then((users) => {
            axios
              .get("https://jsonplaceholder.typicode.com/todos")
              .then((todos) => {
                users.data.forEach((user) => {
                  let data = [];
                  todos.data.forEach((todo) => {
                    if (user.id == todo.userId) {
                      data.push(todo);
                    }
                  });
                  user.todos = [...data];
                });
                data.userTodos = [...users.data];
                data.userTodosCopy = [...users.data];
                store.commit("SET_TODOS", users.data);
                store.commit("SET_TODOS_COPY", users.data);
              });
          });
      });
    }

    let sortTodos = (userId, isCompleted) => {
      let todoById = [];
      data.userTodosCopy.find((item) => {
        if (item.id === userId) {
          todoById = item.todos.filter((item) => {
            if (item.userId === userId && item.completed === isCompleted)
              return item;
            if (item.userId === userId && "All" === isCompleted) return item;
          });
        }
      });
      let index = data.userTodos.findIndex((item) => item.id === userId);
      data.userTodos[index].todos = todoById;
    };

    watch(user, (newValue) => {
      let todosCopy = [...data.userTodosCopy];
      let val = newValue.toLowerCase();
      let todoByName = todosCopy.filter((item) => {
        if (
          item.name.toLowerCase().search(val) != -1 ||
          item.email.toLowerCase().search(val) != -1
        ) {
          return item;
        }
      });
      data.userTodos = [...todoByName];
    });
    
    let changeStatus = (type, uId, tId) => {
      let todos = [...data.userTodos];
      todos.find((item) => {
        if (item.id === uId) {
          if (type === "Delete") {
            let index = item.todos.findIndex((todo) => todo.id === tId);
            item.todos.splice(index, 1);
          } else {
            item.todos.find((todo) => {
              if (todo.id === tId) todo.completed = !todo.completed;
            })
          }
        }
      });
      data.todos = todos;
      store.commit("SET_TODOS", data.todos);
      store.commit("SET_TODOS_COPY", data.todos);
    };

    let saveTodo = (id) => {
      if( document.getElementById(id).value.length === 0 ) return
      let userTodos = [...data.userTodos];
      userTodos.find( item  => {
        if (item.id === id) {
          let todoId = 0
          item.todos.forEach( todo => {
            if( todo.id > todoId ) todoId = todo.id;
          })
          let todoObj = {
            userId: id,
            id: todoId + 1,
            title: document.getElementById(id).value,
            completed: false
          }
          item.todos.push( todoObj );
        }
      });

      data.todos = userTodos;
      store.commit("SET_TODOS", data.todos);
      store.commit("SET_TODOS_COPY", data.todos);
    };
    let scrollCardsToBottom = (scrollId, textareaId) => {
      var todoBox = document.getElementById(scrollId);
      setTimeout( () => {
         todoBox.scrollTop = todoBox.scrollHeight;
         //document.getElementById(textareaId).focus();
      }, 500)
    };

    return {
      data,
      sortTodos,
      user,
      changeStatus,
      saveTodo,
      scrollCardsToBottom
    };
  },
};
</script>

<style scoped>
.banner{
  height: 20rem;
  background-image: url('../assets/banner-test-2.jpg');
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: cover;
  background-attachment: fixed;
  width: 100%;
}
.banner h1{
  color: #e91e63;
}
.card {
  box-shadow: 0 1px 2px -1px rgb(0 0 0 / 40%) !important;
}
.todo .form-floating{
  height: 4rem;
}
.cards {
  padding: 0 1em;
}
.user-header {
  height: 3rem;
  background: #ebebeb;
}
.card-list-box {
  overflow-x: scroll;
  overflow-y: hidden;
  user-select: none;
  /* white-space: nowrap; */
  -webkit-overflow-scrolling: initial;
  -webkit-transform: translateZ(0);
}
.card-list {
  margin: 0 0.4em;
  border-radius: 4px;
  width: 250px;
  min-width: 250px;
  overflow: hidden;
}
.card-list-header {
  text-align: left;
  padding: 0 0 1em 0;
  font-weight: 900;
}
.todo .user-image {
  height: 30px;
  width: 30px;
}
.todo .footer-font {
  font-size: 0.6rem;
}
.todo .todo-list-box {
  height: calc(100vh - (7rem + 10px + 2rem));
  min-height: 0;
  background: #ebebeb;
  overflow-y: scroll;
  overflow-x: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-overflow-scrolling: initial;
  -webkit-transform: translateZ(0);
}

.scroll-bar::-webkit-scrollbar {
  width: 7px;
  height: 10px;
}
.scroll-bar::-webkit-scrollbar-thumb {
  background-color: #aaa;
  border-radius: 2px;
}
.cursor-pointer {
  cursor: pointer;
}
.add-todo {
  background: #ebebeb;
  height: 2rem;
  border-radius: 4px;
}
.textarea{
  box-shadow: 0 1px 2px -1px rgb(0 0 0 / 40%) !important;
  border: none;
  border-radius: 4px;
}
.textarea:focus, .textarea:focus-visible{
  outline: none;
  border: none;
}
</style>
