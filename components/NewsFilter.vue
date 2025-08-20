<template>
  <div class="filter">
    <div class="filter__buttons">
      <span class="filter_button_text">Все</span>
      <button class="filter_button active">
        <span class="filter_button_text">Lenta.ru</span>
      </button>
      <button class="filter_button active">
        <span class="filter_button_text">Mos.ru</span>
      </button>
    </div>
    <div class="layout__buttons">
      <button class="layout_button">
        <img src="~/assets/images/layout-list.svg" alt="Список">
      </button>
      <button class="layout_button active">
        <img src="../assets/images/layout-grid.svg" alt="Сетка">
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
  .filter {
    display: flex;
    justify-content: space-between;
    padding: 26px 0 28px 0;
  }

  .filter__buttons {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .filter_button,
  .layout_button {
    background-color: inherit;
    padding: 0;
    border: none;
  }

  .filter_button_text {
    font-size: 14px;
    font-weight: 700;
    line-height: 100%;
    letter-spacing: 0;
  }

  .layout__buttons {
    display: flex;
    gap: 10px;
  }
</style>