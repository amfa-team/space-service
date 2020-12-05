// @types/whatwg-fetch is not valid
declare module "whatwg-fetch" {
  const { fetch } = window;
  export { fetch };
}

declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}
