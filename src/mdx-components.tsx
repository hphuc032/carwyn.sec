import type { MDXComponents } from "mdx/types";

// Semantic MDX elements remain native until the approved article design phase.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return components;
}
