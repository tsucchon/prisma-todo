<script setup lang="ts">
  // interface
  interface TodoList {
    id: number;
    title: string;
  }
  // 入力値
  const todo = ref<string>("");
  // TODOを格納する配列
  const todoList = ref<TodoList[]>([]);
  
  // TODOリストに追加
  const addTodo = async () => {
    try {
      if (!todo.value.trim()) return;
      await $fetch("/api/todos/create", {
        method: "POST",
        body: { title: todo.value },
      });
      todo.value = "";
      await fetchTodos();
    } catch (error) {
      console.error(error);
    }
  };
  
  // TODOリストから削除
  const deleteTodo = async (id: number) => {
    try {
      await $fetch(`/api/todos/${id}`, { method: "DELETE" });
      await fetchTodos();
    } catch (error) {
      console.error(error);
    }
  };
  
  const fetchTodos = async () => {
    try {
      todoList.value = await $fetch<TodoList[]>("/api/todos");
    } catch (error) {
      console.error(error);
    }
  };
  
  onMounted(async () => {
    await fetchTodos();
  });
  </script>
  
  <template>
    <div class="flex flex-col items-center min-h-screen bg-gray-100 w-full pt-24">
      <h1 class="text-5xl font-bold text-slate-700 mb-8">TODO App</h1>
      <div class="w-96">
        <el-row :gutter="24">
          <el-col :span="20">
            <el-input v-model="todo" placeholder="Please input" size="large" />
          </el-col>
          <el-col :span="4">
            <el-button
              type="primary"
              class="text-2xl"
              size="large"
              @click="addTodo"
            >
              追加
            </el-button>
          </el-col>
        </el-row>
        <template v-if="todoList.length > 0">
          <el-row>
            <el-col :span="12">
              <el-card class="w-[410px] mt-4">
                <div
                  v-for="todo in todoList"
                  :key="todo.id"
                  class="text-lg flex justify-between items-center py-2"
                >
                  <span class="ml-2">{{ todo.title }}</span>
                  <el-button type="danger" @click="deleteTodo(todo.id)"
                    >削除</el-button
                  >
                </div>
              </el-card>
            </el-col>
          </el-row>
        </template>
      </div>
    </div>
  </template>