// import ElectricitySettings from "./electricity-settings";
export default WorkOrdersView;
import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import WorkOrderTypeForm from "./components/TypeForm";

export type CARDTYPE = "WORK_ORDER_TYPES" | "SECTIONS" | "HIDE";

function WorkOrdersView() {
  const [activeCard, setActiveCard] = useState<CARDTYPE>("HIDE");

  return (
    <Paper className="py-6">
      {activeCard === "HIDE" && (
        <div>
          <Accordion defaultExpanded className="mb-2">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Electricity settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Card
                sx={{
                  minWidth: 275,
                  color: "white",
                  display: "flex",
                  justifyContent: "space-between",
                  "&:hover": { backgroundColor: "#2d2d5a" },
                }}
              >
                <CardContent>
                  <Typography>Work order type</Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    className="cursor-pointer"
                    onClick={() => setActiveCard("WORK_ORDER_TYPES")}
                  >
                    <KeyboardArrowRightIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </AccordionDetails>
          </Accordion>
        </div>
      )}

      {activeCard === "WORK_ORDER_TYPES" && (
        <WorkOrderTypeForm setActiveCard={setActiveCard} />
      )}
    </Paper>
  );
}
