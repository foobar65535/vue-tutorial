<template>
  <div class="someclass" :class="$attrs.class">This div has own and inherited classes</div>
  <div class="someclass">This div has own classes</div>
  <div class="someclass" :class="$attrs.class">This div also has own and inherited classes</div>
</template>

<style scoped>
.someclass {
  border-bottom: 4px solid #0f8;
}
</style>
