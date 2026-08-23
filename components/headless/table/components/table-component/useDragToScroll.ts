import { useCallback, useRef, type MouseEvent, type RefObject } from "react";

const DRAG_THRESHOLD_PX = 5;
const INTERACTIVE_SELECTOR =
  'button, a, input, textarea, select, [role="button"], [role="checkbox"], [role="menuitem"], [data-no-drag-scroll]';

export function useDragToScroll(
  containerRef: RefObject<HTMLDivElement | null>,
  enabled: boolean
) {
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const scrollTopRef = useRef(0);
  const draggedRef = useRef(false);

  const onMouseDown = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!enabled || !container || event.button !== 0) return;
      if ((event.target as HTMLElement).closest(INTERACTIVE_SELECTOR)) return;

      startXRef.current = event.clientX;
      startYRef.current = event.clientY;
      scrollLeftRef.current = container.scrollLeft;
      scrollTopRef.current = container.scrollTop;
      draggedRef.current = false;

      const swallowClick = (clickEvent: globalThis.MouseEvent) => {
        clickEvent.preventDefault();
        clickEvent.stopPropagation();
      };

      const onMouseMove = (moveEvent: globalThis.MouseEvent) => {
        const dx = moveEvent.clientX - startXRef.current;
        const dy = moveEvent.clientY - startYRef.current;

        if (
          !draggedRef.current &&
          Math.abs(dx) < DRAG_THRESHOLD_PX &&
          Math.abs(dy) < DRAG_THRESHOLD_PX
        ) {
          return;
        }

        if (!draggedRef.current) {
          draggedRef.current = true;
          container.style.cursor = "grabbing";
          document.body.style.userSelect = "none";
        }

        moveEvent.preventDefault();
        container.scrollLeft = scrollLeftRef.current - dx;
        container.scrollTop = scrollTopRef.current - dy;
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        container.style.cursor = "";
        document.body.style.userSelect = "";

        if (draggedRef.current) {
          container.addEventListener("click", swallowClick, {
            capture: true,
            once: true,
          });
        }
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [containerRef, enabled]
  );

  return { onMouseDown };
}
