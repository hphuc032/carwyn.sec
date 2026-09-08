import type { MDXComponents } from "mdx/types";
import { LogCallout } from "@/components/log/LogCallout";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { LogCallout, ...components };
}
