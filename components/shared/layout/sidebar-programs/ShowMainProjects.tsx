import RegularList from "../../RegularList";
import { SetStateAction } from "react";
import { Project } from "@/types/sidebar-menu";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type PropsT = {
  projects: Project[];
  activeProject: Project;
  setActiveProject: React.Dispatch<SetStateAction<Project>>;
  handleSub_entitiesItemClick: (url: string) => void;
};

export default function ShowMainProjects({
  activeProject,
  setActiveProject,
  projects,
  handleSub_entitiesItemClick,
}: PropsT) {
  const t = useTranslations();
  return (
    <div className="w-full">
      <label
        htmlFor="main-sidebar-item"
        className="block mb-2 px-2  text-gray-700"
      >
        {t("Sidebar.mainPrograms")}
      </label>
      <MainProjectsList
        projects={projects}
        activeProject={activeProject}
        setActiveProject={setActiveProject}
        handleSub_entitiesItemClick={handleSub_entitiesItemClick}
      />
    </div>
  );
}

type MainProjectsListProps = {
  projects: Project[];
  activeProject: Project;
  setActiveProject: React.Dispatch<SetStateAction<Project>>;
  handleSub_entitiesItemClick: (url: string) => void;
};

const MainProjectsList = (props: MainProjectsListProps) => {
  // declare and define component state and variables
  const {
    projects,
    activeProject,
    setActiveProject,
    handleSub_entitiesItemClick,
  } = props;
  // declare and define helper methods
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProject =
      projects.find((project) => project.name === e.target.value) ||
      projects?.[0];
    setActiveProject(selectedProject);
    if (selectedProject?.sub_entities?.[0]?.url) {
      router.push(selectedProject.sub_entities[0].url);
      handleSub_entitiesItemClick(selectedProject.sub_entities[0].url);
    }
  };

  return (
    <select
      id="main-sidebar-item"
      name="main-sidebar-item"
      value={activeProject.name}
      onChange={handleChange}
      className="block w-full h-[55px] px-2 py-[5px] text-[18px] font-semibold bg-[#2D174D] text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 my-[10px] border-0"
    >
      <RegularList<Project, "item">
        sourceName="item"
        items={projects}
        ItemComponent={MainProjectOption}
      />
    </select>
  );
};

const MainProjectOption = ({ item }: { item: Project }) => (
  <option value={item.name} key={item.name}>
    {item.name}
  </option>
);
