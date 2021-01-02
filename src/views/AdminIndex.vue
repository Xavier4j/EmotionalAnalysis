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
    Bar: () => import("@/components/admin/Bar"),
    Drawer: () => import("@/components/admin/Drawer"),
    MainView: () => import("@/components/MainView")
  }
};
</script>
