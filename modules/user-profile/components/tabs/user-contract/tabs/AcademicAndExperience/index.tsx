import { AcademicAndExperienceCxtProvider } from "./context/AcademicAndExperienceCxt";
import AcademicAndExperienceEntryPoint from "./components/entry-point";

export default function AcademicAndExperience() {
  return (
    <AcademicAndExperienceCxtProvider>
      <AcademicAndExperienceEntryPoint />
    </AcademicAndExperienceCxtProvider>
  );
}
