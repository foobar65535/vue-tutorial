<template>
  <div class="comproot" :class="$attrs.class">This div has class "comproot"</div>
  <div class="comproot" :class="$attrs.class">
    This div has class "comproot"
    <div class="comproot" :class="$attrs.class">This nested div also has class "comproot"</div>
  </div>
</template>

<style scoped>
.comproot {
  background-color: #ff8;
  padding: 4px;
  font-size: 1.5em;
}
</style>
