// import ElectricitySettings from "./electricity-settings";
import WorkOrderTypeView from "./WorkOrderTypeView";
import SectionView from "./SectionView";
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

export type CARDTYPE = "WORK_ORDER_TYPES" | "SECTIONS" | "HIDE";

export default function WorkOrdersIndex() {
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
                  <Typography>القسم</Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    className="cursor-pointer"
                    onClick={() => setActiveCard("SECTIONS")}
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
        <WorkOrderTypeView setActiveCard={setActiveCard} />
      )}
      {activeCard === "SECTIONS" && (
        <SectionView setActiveCard={setActiveCard} />
      )}
    </Paper>
  );
}
