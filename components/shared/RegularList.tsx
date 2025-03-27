import React from "react";

/**
 * Props for RegularList component.
 *
 * @template T - The type of each item in the list.
 * @template K - The expected key name for passing props dynamically.
 */
interface RegularListProps<T, K extends string> {
  items: T[];
  /** The dynamic prop name for passing items to the child component */
  sourceName: K;
  /** The component responsible for rendering each item */
  ItemComponent: React.ComponentType<{ [key in K]: T }>;
}

/**
 * RegularList Component
 *
 * A reusable list component that renders a list of items using a provided component.
 *
 * @template T - The type of items in the list.
 * @template K - The expected key name for passing props dynamically.
 * @param {RegularListProps<T, K>} props - The component props.
 * @returns {JSX.Element} A list of rendered components.
 */
export default function RegularList<T, K extends string>({
  items,
  sourceName,
  ItemComponent,
}: RegularListProps<T, K>) {
  return (
    <>
      {items?.map((item, idx) => {
        // Ensure the dynamic prop name matches the expected component props
        const itemProps = { [sourceName]: item } as { [key in K]: T };

        return <ItemComponent key={idx} {...itemProps} />;
      })}
    </>
  );
}
