import { Container } from "@mui/material";
import CommunicationMessagesTableV2 from "./components/CommunicationMessagesTableV2";

export default function CommunicationMessagesView() {
  return (
    <Container maxWidth="xl">
      <CommunicationMessagesTableV2 />
    </Container>
  );
}
