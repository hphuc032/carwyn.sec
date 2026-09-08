import type { ComponentPropsWithoutRef } from "react";

const sizes = {
  "display-xl": "text-display-xl", "display-lg": "text-display-lg",
  "heading-1": "text-heading-1", "heading-2": "text-heading-2", "heading-3": "text-heading-3",
} as const;
type Props = ComponentPropsWithoutRef<"h2"> & {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: keyof typeof sizes;
};

export function EditorialHeading({ as: Tag = "h2", size = "heading-2", className = "", ...props }: Props) {
  return <Tag className={`editorial-heading ${sizes[size]} ${className}`} {...props} />;
}
