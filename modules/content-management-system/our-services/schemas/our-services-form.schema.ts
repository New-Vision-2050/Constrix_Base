import { z } from "zod";

/**
 * Creates a Zod schema for our-services form validation
 */
export const createOurServicesFormSchema = (t: (key: string) => string) =>
  z.object({
    mainTitle: z
      .string({
        required_error: t("mainTitleRequired") || "Main title is required",
      })
      .min(1, {
        message: t("mainTitleRequired") || "Main title is required",
      })
      .trim(),

    mainDescription: z
      .string({
        required_error:
          t("mainDescriptionRequired") || "Main description is required",
      })
      .min(1, {
        message: t("mainDescriptionRequired") || "Main description is required",
      })
      .trim(),

    departments: z
      .array(
        z
          .object({
            id: z.string(),
            titleAr: z
              .string({
                required_error:
                  t("departmentTitleArRequired") || "Arabic title is required",
              })
              .min(1, {
                message:
                  t("departmentTitleArRequired") || "Arabic title is required",
              })
              .trim(),
            titleEn: z
              .string({
                required_error:
                  t("departmentTitleEnRequired") || "English title is required",
              })
              .min(1, {
                message:
                  t("departmentTitleEnRequired") || "English title is required",
              })
              .trim(),
            descriptionAr: z
              .string({
                required_error:
                  t("departmentDescriptionArRequired") ||
                  "Arabic description is required",
              })
              .min(1, {
                message:
                  t("departmentDescriptionArRequired") ||
                  "Arabic description is required",
              })
              .trim(),
            descriptionEn: z
              .string({
                required_error:
                  t("departmentDescriptionEnRequired") ||
                  "English description is required",
              })
              .min(1, {
                message:
                  t("departmentDescriptionEnRequired") ||
                  "English description is required",
              })
              .trim(),
            designType: z
              .string({
                required_error:
                  t("designTypeRequired") || "Design type is required",
              })
              .min(1, {
                message: t("designTypeRequired") || "Design type is required",
              }),
            services: z
              .array(z.string())
              .min(1, {
                message:
                  t("servicesRequired") || "At least one service is required",
              }),
          })
      )
      .min(1, {
        message:
          t("departmentsMinRequired") || "At least one department is required",
      }),
  });

/**
 * Type inference from the our-services form schema
 */
export type OurServicesFormData = z.infer<
  ReturnType<typeof createOurServicesFormSchema>
>;

/**
 * Default form values for our-services form
 */
export const getDefaultOurServicesFormValues = (): OurServicesFormData => ({
  mainTitle: "",
  mainDescription: "",
  departments: [],
});

