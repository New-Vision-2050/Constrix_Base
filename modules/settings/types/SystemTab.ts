export type SystemTab = {
  id: string;
  title: string;
  icon?: JSX.Element;
  content: React.ReactNode;
  /** When set, the host UI may render a second tab row while this tab is active. */
  nestedTabs?: SystemTab[];
};
