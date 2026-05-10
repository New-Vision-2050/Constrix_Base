import React, { useState } from "react";
import WorkOrderTypeView from "./work-order-types/WorkOrderTypeView";
import SectionView from "./section/SectionView";
import ActionsView from "./actions/ActionsView";
import ReportsFormsView from "./report-forms/ReportsFormsView";
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
import { useTranslations } from "next-intl";
import TasksView from "./tasks/TasksView";
import TasksSettingsView from "./tasks-settings/TasksSettingsView";
import { SettingsTabItemProps } from "../../types";
import type { CARDTYPE } from "./card-types";

export type { CARDTYPE } from "./card-types";

export default function WorkOrdersView({ thirdLevelId }: SettingsTabItemProps) {
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
                  color: "text.primary",
                  display: "flex",
                  justifyContent: "space-between",
                  "&:hover": { backgroundColor: "action.hover" },
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
                  color: "text.primary",
                  display: "flex",
                  justifyContent: "space-between",
                  "&:hover": { backgroundColor: "action.hover" },
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
                  color: "text.primary",
                  display: "flex",
                  justifyContent: "space-between",
                  "&:hover": { backgroundColor: "action.hover" },
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
                  color: "text.primary",
                  display: "flex",
                  justifyContent: "space-between",
                  "&:hover": { backgroundColor: "action.hover" },
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
                  color: "text.primary",
                  display: "flex",
                  justifyContent: "space-between",
                  "&:hover": { backgroundColor: "action.hover" },
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
        <WorkOrderTypeView
          setActiveCard={setActiveCard}
          projectTypeId={thirdLevelId}
        />
      )}
      {activeCard === "SECTION" && (
        <SectionView
          setActiveCard={setActiveCard}
          projectTypeId={thirdLevelId}
        />
      )}
      {activeCard === "ACTIONS" && (
        <ActionsView
          setActiveCard={setActiveCard}
          projectTypeId={thirdLevelId}
        />
      )}
      {activeCard === "REPORT_FORMS" && (
        <ReportsFormsView
          setActiveCard={setActiveCard}
          projectTypeId={thirdLevelId}
        />
      )}
      {activeCard === "ADD_TASKS" && (
        <TasksView
          setActiveCard={setActiveCard}
          projectTypeId={thirdLevelId}
        />
      )}
      {activeCard === "TASKS_SETTINGS" && (
        <TasksSettingsView setActiveCard={setActiveCard} />
      )}
    </Paper>
  );
}
