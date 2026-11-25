import type { ElementType, ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
};

/** Every section sits in this, so content always aligns to the same page margins. */
export function Container({
  children,
  as: Tag = "div",
  className = "",
}: ContainerProps) {
  return (
    <Tag
      className={`mx-auto w-full max-w-(--page-max) px-(--page-gutter) ${className}`}
    >
      {children}
    </Tag>
  );
}
