import { baseApi } from "@/config/axios/instances/base";
import { GetCurrentAboutUsResponse, UpdateAboutUsResponse } from "./types/response";
import { UpdateAboutUsParams } from "./types/params";

/**
 * About Us API Service
 * Handles all API calls related to About Us (website-about-us)
 */
export const CompanyDashboardAboutApi = {
  /**
   * Get current About Us data for the company
   * GET /website-about-us/current
   */
  getCurrent: () =>
    baseApi.get<GetCurrentAboutUsResponse>("website-about-us/current"),

  /**
   * Update current About Us data for the company
   * POST /website-about-us/current
   * @param body - About Us update parameters
   */
  updateCurrent: (body: UpdateAboutUsParams) => {
    const formData = new FormData();

    // Add simple fields
    if (body.title !== undefined) formData.append("title", body.title);
    if (body.description !== undefined) formData.append("description", body.description);
    if (body.is_certificates !== undefined) formData.append("is_certificates", body.is_certificates.toString());
    if (body.is_approvals !== undefined) formData.append("is_approvals", body.is_approvals.toString());
    if (body.is_companies !== undefined) formData.append("is_companies", body.is_companies.toString());
    if (body.about_me_ar !== undefined) formData.append("about_me_ar", body.about_me_ar);
    if (body.about_me_en !== undefined) formData.append("about_me_en", body.about_me_en);
    if (body.vision_ar !== undefined) formData.append("vision_ar", body.vision_ar);
    if (body.vision_en !== undefined) formData.append("vision_en", body.vision_en);
    if (body.target_ar !== undefined) formData.append("target_ar", body.target_ar);
    if (body.target_en !== undefined) formData.append("target_en", body.target_en);
    if (body.slogan_ar !== undefined) formData.append("slogan_ar", body.slogan_ar);
    if (body.slogan_en !== undefined) formData.append("slogan_en", body.slogan_en);

    // Add main image if it's a File
    if (body.main_image instanceof File) {
      formData.append("main_image", body.main_image);
    }

    // Add project types array
    if (body.project_types && body.project_types.length > 0) {
      body.project_types.forEach((pt, index) => {
        formData.append(`project_types[${index}][title_ar]`, pt.title_ar);
        formData.append(`project_types[${index}][title_en]`, pt.title_en);
        formData.append(`project_types[${index}][count]`, pt.count.toString());
      });
    }

    // Add attachments array
    if (body.attachments && body.attachments.length > 0) {
      body.attachments.forEach((att, index) => {
        formData.append(`attachments[${index}][name]`, att.name);
        if (att.file instanceof File) {
          formData.append(`attachments[${index}][attachment]`, att.file);
        }
      });
    }

    return baseApi.post<UpdateAboutUsResponse>("website-about-us/current", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

