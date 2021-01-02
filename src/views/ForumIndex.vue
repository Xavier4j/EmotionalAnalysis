<template>
  <v-app>
    <bar />

    <drawer />

    <main-view />
  </v-app>
</template>

<script>
export default {
  name: "Index",
  components: {
    Bar: () => import("@/components/forum/Bar"),
    Drawer: () => import("@/components/forum/Drawer"),
    MainView: () => import("@/components/MainView")
  }
};
</script>
