import { SidebarProjectItem } from "@/types/sidebar-project-item";
import RegularList from "../../RegularList";
import { SetStateAction } from "react";

type PropsT = {
  projects: SidebarProjectItem[];
  activeProject: SidebarProjectItem;
  setActiveProject: React.Dispatch<SetStateAction<SidebarProjectItem>>;
};

export default function ShowMainProjects({
  activeProject,
  setActiveProject,
  projects,
}: PropsT) {
  return (
    <div className="w-full">
      <label
        htmlFor="main-sidebar-item"
        className="block mb-2 px-2  text-gray-700"
      >
        البرامج الرئيسية
      </label>
      <MainProjectsList
        projects={projects}
        activeProject={activeProject}
        setActiveProject={setActiveProject}
      />
    </div>
  );
}

type MainProjectsListProps = {
  projects: SidebarProjectItem[];
  activeProject: SidebarProjectItem;
  setActiveProject: React.Dispatch<SetStateAction<SidebarProjectItem>>;
};

const MainProjectsList = (props: MainProjectsListProps) => {
  // declare and define component state and variables
  const { projects, activeProject, setActiveProject } = props;
  // declare and define helper methods
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProject =
      projects.find((project) => project.name === e.target.value) ||
      projects?.[0];
    setActiveProject(selectedProject);
  };

  return (
    <select
      id="main-sidebar-item"
      name="main-sidebar-item"
      value={activeProject.name}
      onChange={handleChange}
      className="block w-full h-[55px] px-2 py-[5px] text-[18px] font-semibold bg-[#2D174D] text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 my-[10px] border-0"
    >
      <RegularList<SidebarProjectItem, "item">
        sourceName="item"
        items={projects}
        ItemComponent={MainProjectOption}
      />
    </select>
  );
};

const MainProjectOption = ({ item }: { item: SidebarProjectItem }) => (
  <option value={item.name} key={item.name}>
    {item.name}
  </option>
);
