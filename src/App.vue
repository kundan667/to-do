<template>
  <router-view/>
</template>

<style>
*{
  box-sizing: border-box;
}
html {
  font-size: 1rem;
  scroll-behavior: smooth;
}
body{
  padding: 0;
  max-width: 1400px;
  margin: 0 auto;
  scrollbar-width: thin;          /* "auto" or "thin" */
  scrollbar-color: blue orange;   /* scroll thumb and track */
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
