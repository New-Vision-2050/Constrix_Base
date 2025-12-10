import { Container } from "@mui/material";
import CommunicationMessagesTable from "./components/CommunicationMessagesTable";

export default function CommunicationMessagesView() {
  return <Container maxWidth="xl">
    <CommunicationMessagesTable />
  </Container>;
}