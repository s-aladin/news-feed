<template>
    <header class="header">
      <div class="header__title_container">
        <h1 class="title header__title">Список новостей</h1>
        <button class="header__button">
          <img src="~/assets/images/refresh.svg" alt="Обновить">
        </button>
      </div>
      <div class="search_container">
        <input type="text" class="search_input">
        <img src="~/assets/images/search.svg" alt="Поиск" class="search_icon">
      </div>
    </header>
</template>

<script setup lang="ts">

</script>

<style scoped>
.header{
  display: flex;
  justify-content: space-between;
  padding: 36px 0;
  border-bottom: 1px solid #E5E5E5;
}

.header__button {
  width: 40px;
  height: 40px;
  margin-left: 30px;
  background-color: #FFFFFF;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.header__button:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header__title_container {
  display: flex;
}

.search_container {
  position: relative;
  width: 321px;
  height: 40px;
}

.search_input {
  width: 100%;
  height: 100%;
  padding: 0 40px 0 12px;
  border: 1px solid #fff;
  border-radius: 3px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.05);
  font-size: 14px;
  outline: none;
}

.search_input:focus {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
}

.search_icon {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  pointer-events: none;
}
</style>