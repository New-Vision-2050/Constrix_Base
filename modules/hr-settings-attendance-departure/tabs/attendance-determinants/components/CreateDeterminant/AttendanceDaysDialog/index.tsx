import SetAttendanceDaysDialog from "./dialog";
import {
  AttendanceDayCxtProvider,
  type AttendanceDaysStandaloneConfig,
} from "./context/AttendanceDayCxt";

type PropsT = {
  isOpen: boolean;
  onClose: () => void;
  standaloneConfig?: Omit<AttendanceDaysStandaloneConfig, "isOpen" | "onClose">;
};

export default function AttendanceDaysDialog({
  isOpen,
  onClose,
  standaloneConfig,
}: PropsT) {
  const mergedStandalone: AttendanceDaysStandaloneConfig | undefined =
    standaloneConfig
      ? { ...standaloneConfig, isOpen, onClose }
      : undefined;

  return (
    <AttendanceDayCxtProvider standaloneConfig={mergedStandalone}>
      <SetAttendanceDaysDialog isOpen={isOpen} onClose={onClose} />
    </AttendanceDayCxtProvider>
  );
}
