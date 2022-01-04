module.exports = {
  // This is a simple example plugin.
  async onActive() {
    console.log('Plugin On active Hook Called');
  },
  async onDeactivate() {
    console.log('Plugin On deactivate Hook Called');
  },
  async onSignIn(context) {
    console.log('Plugin On SignIn Hook Called');
    console.log(context);
  },
};
