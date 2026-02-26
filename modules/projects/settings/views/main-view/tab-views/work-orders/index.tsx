import React, { useState } from "react";
import WorkOrderTypeView from "./WorkOrderTypeView";
import SectionView from "./SectionView";
import ActionsView from "./ActionsView";
import ReportsFormsView from "./ReportsFormsView";
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
import {useTranslations} from "next-intl";
import TasksView from "./TasksView";
import TasksSettingsView from "./TasksSettingsView";

export type CARDTYPE = "WORK_ORDER_TYPES" | "SECTION" | "ACTIONS" | "REPORT_FORMS" | "ADD_TASKS" | "TASKS_SETTINGS" | "HIDE";

export default function WorkOrdersIndex() {
  const t = useTranslations("projectSettings.section");
  const [activeCard, setActiveCard] = useState<CARDTYPE>("HIDE");

  return (
    <Paper className="py-6">
      {activeCard === "HIDE" && (
        <div>
          <Accordion defaultExpanded className="mb-2">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{t("electricitySettings")}</Typography>
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
                  <Typography>{t("workOrderType")}</Typography>
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
                  <Typography>{t("section")}</Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    className="cursor-pointer"
                    onClick={() => setActiveCard("SECTION")}
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
                  <Typography>{t("actions")}</Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    className="cursor-pointer"
                    onClick={() => setActiveCard("ACTIONS")}
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
                  <Typography>{t("reportForms")}</Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    className="cursor-pointer"
                    onClick={() => setActiveCard("REPORT_FORMS")}
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
                  <Typography>{t("addTasks")}</Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    className="cursor-pointer"
                    onClick={() => setActiveCard("ADD_TASKS")}
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
      {activeCard === "SECTION" && (
        <SectionView setActiveCard={setActiveCard} />
      )}
      {activeCard === "ACTIONS" && (
        <ActionsView setActiveCard={setActiveCard} />
      )}
      {activeCard === "REPORT_FORMS" && (
        <ReportsFormsView setActiveCard={setActiveCard} />
      )}
      {activeCard === "ADD_TASKS" && (
        <TasksView setActiveCard={setActiveCard} />
      )}
      {activeCard === "TASKS_SETTINGS" && (
        <TasksSettingsView setActiveCard={setActiveCard} />
      )}
    </Paper>
  );
}
