<template>
  <v-snackbar
    v-model="snackbar"
    :bottom="y === 'bottom'"
    :color="color"
    :left="x === 'left'"
    :multi-line="mode === 'multi-line'"
    :right="x === 'right'"
    :timeout="timeout"
    :top="y === 'top'"
    :vertical="mode === 'vertical'"
  >
    {{ text }}
    <v-btn dark text @click="snackbar = false">Close</v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: "Toast",
  data() {
    return {};
  },
  methods: {}
};
</script>
