import { ColumnConfig } from "@/modules/table/utils/configs/columnConfig";
import * as React from "react";
import One from "@/modules/table/components/additional-components/One";
import Two from "@/modules/table/components/additional-components/Two";
import Three from "@/modules/table/components/additional-components/Three";

export const additionalColumnRenderers: Record<string, ColumnConfig["render"]> = {
  one: (value: any, row: any) => React.createElement(One, { value, row }),
  two: (value: any, row: any) => React.createElement(Two, { value, row }),
  three: (value: any, row: any) => React.createElement(Three, { value, row }),
};
