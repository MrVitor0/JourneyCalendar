/**
 * Global type declarations for the application
 * Enables TypeScript to recognize CSS module imports
 */

declare module "*.css" {
  const content: string;
  export default content;
}

declare module "*.scss" {
  const content: string;
  export default content;
}

declare module "*.sass" {
  const content: string;
  export default content;
}

declare module "*.less" {
  const content: string;
  export default content;
}
