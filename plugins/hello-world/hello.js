export default function (ctx) {
  ctx.addHook('onLogin', (ctx, next) => {
    next();
  });
}
