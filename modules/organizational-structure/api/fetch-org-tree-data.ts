import { apiClient } from "@/config/axios-config";
import { OrgChartNode } from '@/types/organization'

type ResponseT = {
  code: string;
  message: string;
  payload: OrgChartNode[];
};

export default async function fetchOrgTreeData(branchId: string|number) {
  const res = await apiClient.get<ResponseT>(`/management_hierarchies/tree`,{
    params: {
      id: branchId ?? "",
    },
  });

  // let payload = [
  //   {
  //     "id": 1,
  //     "parent_id": null,
  //     "name": "الفرع الرئيسي",
  //     "type": "branch",
  //     "deputy_managers": [],
  //     "description": null,
  //     "reference_user_id": null,
  //     "branch_id": null,
  //     "status": 1,
  //     "reference_user": null,
  //     "is_main": 1,
  //     "manager_id": "f3689191-0650-4a60-9bd4-e93b86c870bf",
  //     "manager": {
  //       "id": null,
  //       "name": null,
  //       "email": null,
  //       "phone": null,
  //       "photo": null
  //     },
  //     "deputy_manager": {
  //       "id": null,
  //       "name": null,
  //       "email": null,
  //       "phone": null,
  //       "photo": null
  //     },
  //     "department_count": 0,
  //     "management_count": 2,
  //     "branch_count": 2,
  //     "user_count": 2,
  //     "children": [
  //       {
  //         "id": 8,
  //         "parent_id": 2,
  //         "name": "الاداره الرئيسيهلا",
  //         "type": "management",
  //         "deputy_managers": [
  //           {
  //             "id": "61676802-8e98-473e-be65-f81cdb7bdd09",
  //             "name": "سسس سسسس",
  //             "email": "eng.abdelrahman.f.shaban@gmail.com",
  //             "phone": "+966555555554"
  //           }
  //         ],
  //         "description": "smart Opp Phoneف",
  //         "reference_user_id": "55488e1d-514d-4547-bc63-4eaaf7c956d0",
  //         "branch_id": 1,
  //         "status": 1,
  //         "reference_user": {
  //           "id": "55488e1d-514d-4547-bc63-4eaaf7c956d0",
  //           "name": "عبدالرحمن الدسوقي",
  //           "email": "dev.desoky@gmail.com",
  //           "phone": "+966567878888"
  //         },
  //         "is_main": 0,
  //         "manager_id": "55488e1d-514d-4547-bc63-4eaaf7c956d0",
  //         "manager": {
  //           "id": "55488e1d-514d-4547-bc63-4eaaf7c956d0",
  //           "name": "عبدالرحمن الدسوقي",
  //           "email": "dev.desoky@gmail.com",
  //           "phone": "+966567878888",
  //           "photo": null
  //         },
  //         "deputy_manager": {
  //           "id": null,
  //           "name": null,
  //           "email": null,
  //           "phone": null,
  //           "photo": null
  //         },
  //         "department_count": 0,
  //         "management_count": 0,
  //         "branch_count": 0,
  //         "user_count": 0,
  //         "children": []
  //       },
  //       {
  //         "id": 3,
  //         "parent_id": 1,
  //         "name": "فرع ثانوي",
  //         "type": "branch",
  //         "deputy_managers": [],
  //         "description": null,
  //         "reference_user_id": null,
  //         "branch_id": null,
  //         "status": 1,
  //         "reference_user": null,
  //         "is_main": 0,
  //         "manager_id": "7c98c26a-4bc6-4941-b46d-3188f3244bc1",
  //         "manager": {
  //           "id": "7c98c26a-4bc6-4941-b46d-3188f3244bc1",
  //           "name": "يحي محمد",
  //           "email": "mmedan263@gmail.com",
  //           "phone": "+966504950395",
  //           "photo": null
  //         },
  //         "deputy_manager": {
  //           "id": null,
  //           "name": null,
  //           "email": null,
  //           "phone": null,
  //           "photo": null
  //         },
  //         "department_count": 0,
  //         "management_count": 1,
  //         "branch_count": 0,
  //         "user_count": 1,
  //         "children": [
  //           {
  //             "id": 7,
  //             "parent_id": 4,
  //             "name": "الاداره 1",
  //             "type": "management",
  //             "deputy_managers": [
  //               {
  //                 "id": "c08f4642-0453-455b-bdb4-85b0b0c24417",
  //                 "name": "يحي محمد",
  //                 "email": "pafiw65842@eligou.com",
  //                 "phone": "+201224855746"
  //               }
  //             ],
  //             "description": "اداره الفرع الثانوي",
  //             "reference_user_id": "cf22708a-efc9-476f-82f3-ed59bb23b4f1",
  //             "branch_id": 3,
  //             "status": 1,
  //             "reference_user": {
  //               "id": "cf22708a-efc9-476f-82f3-ed59bb23b4f1",
  //               "name": "بيب صثي",
  //               "email": "test123@gmail.com",
  //               "phone": "+966551548415"
  //             },
  //             "is_main": 0,
  //             "manager_id": "cf22708a-efc9-476f-82f3-ed59bb23b4f1",
  //             "manager": {
  //               "id": "cf22708a-efc9-476f-82f3-ed59bb23b4f1",
  //               "name": "بيب صثي",
  //               "email": "test123@gmail.com",
  //               "phone": "+966551548415",
  //               "photo": null
  //             },
  //             "deputy_manager": {
  //               "id": null,
  //               "name": null,
  //               "email": null,
  //               "phone": null,
  //               "photo": null
  //             },
  //             "department_count": 0,
  //             "management_count": 0,
  //             "branch_count": 0,
  //             "user_count": 0,
  //             "children": []
  //           },
  //           {
  //             "id": 2327,
  //             "parent_id": 4,
  //             "name": "الاداره 1",
  //             "type": "management",
  //             "deputy_managers": [
  //               {
  //                 "id": "c08f4642-0453-455b-bdb4-85b0b0c24417",
  //                 "name": "يحي محمد",
  //                 "email": "pafiw65842@eligou.com",
  //                 "phone": "+201224855746"
  //               }
  //             ],
  //             "description": "اداره الفرع الثانوي",
  //             "reference_user_id": "cf22708a-efc9-476f-82f3-ed59bb23b4f1",
  //             "branch_id": 3,
  //             "status": 1,
  //             "reference_user": {
  //               "id": "cf22708a-efc9-476f-82f3-ed59bb23b4f1",
  //               "name": "بيب صثي",
  //               "email": "test123@gmail.com",
  //               "phone": "+966551548415"
  //             },
  //             "is_main": 0,
  //             "manager_id": "cf22708a-efc9-476f-82f3-ed59bb23b4f1",
  //             "manager": {
  //               "id": "cf22708a-efc9-476f-82f3-ed59bb23b4f1",
  //               "name": "بيب صثي",
  //               "email": "test123@gmail.com",
  //               "phone": "+966551548415",
  //               "photo": null
  //             },
  //             "deputy_manager": {
  //               "id": null,
  //               "name": null,
  //               "email": null,
  //               "phone": null,
  //               "photo": null
  //             },
  //             "department_count": 0,
  //             "management_count": 0,
  //             "branch_count": 0,
  //             "user_count": 0,
  //             "children": []
  //           },
  //           {
  //             "id": 3367,
  //             "parent_id": 4,
  //             "name": "الاداره 1",
  //             "type": "management",
  //             "deputy_managers": [
  //               {
  //                 "id": "c08f4642-0453-455b-bdb4-85b0b0c24417",
  //                 "name": "يحي محمد",
  //                 "email": "pafiw65842@eligou.com",
  //                 "phone": "+201224855746"
  //               }
  //             ],
  //             "description": "اداره الفرع الثانوي",
  //             "reference_user_id": "cf22708a-efc9-476f-82f3-ed59bb23b4f1",
  //             "branch_id": 3,
  //             "status": 1,
  //             "reference_user": {
  //               "id": "cf22708a-efc9-476f-82f3-ed59bb23b4f1",
  //               "name": "بيب صثي",
  //               "email": "test123@gmail.com",
  //               "phone": "+966551548415"
  //             },
  //             "is_main": 0,
  //             "manager_id": "cf22708a-efc9-476f-82f3-ed59bb23b4f1",
  //             "manager": {
  //               "id": "cf22708a-efc9-476f-82f3-ed59bb23b4f1",
  //               "name": "بيب صثي",
  //               "email": "test123@gmail.com",
  //               "phone": "+966551548415",
  //               "photo": null
  //             },
  //             "deputy_manager": {
  //               "id": null,
  //               "name": null,
  //               "email": null,
  //               "phone": null,
  //               "photo": null
  //             },
  //             "department_count": 0,
  //             "management_count": 0,
  //             "branch_count": 0,
  //             "user_count": 0,
  //             "children": []
  //           }
  //         ]
  //       },
  //       {
  //         "id": 5,
  //         "parent_id": 1,
  //         "name": "فرع 3",
  //         "type": "branch",
  //         "deputy_managers": [],
  //         "description": null,
  //         "reference_user_id": null,
  //         "branch_id": null,
  //         "status": 1,
  //         "reference_user": null,
  //         "is_main": 0,
  //         "manager_id": "a29f26d1-49d5-43f9-9e6d-9c78f9ab0cd8",
  //         "manager": {
  //           "id": "a29f26d1-49d5-43f9-9e6d-9c78f9ab0cd8",
  //           "name": "عبدالرحمن فتحي",
  //           "email": "abdel-rahman.fathy@nv2030.com",
  //           "phone": "+966548484421",
  //           "photo": null
  //         },
  //         "deputy_manager": {
  //           "id": null,
  //           "name": null,
  //           "email": null,
  //           "phone": null,
  //           "photo": null
  //         },
  //         "department_count": 0,
  //         "management_count": 0,
  //         "branch_count": 0,
  //         "user_count": 0,
  //         "children": [
  //           {
  //             "id": 8,
  //             "parent_id": 2,
  //             "name": "الاداره الرئيسيهلا",
  //             "type": "management",
  //             "deputy_managers": [
  //               {
  //                 "id": "61676802-8e98-473e-be65-f81cdb7bdd09",
  //                 "name": "سسس سسسس",
  //                 "email": "eng.abdelrahman.f.shaban@gmail.com",
  //                 "phone": "+966555555554"
  //               }
  //             ],
  //             "description": "smart Opp Phoneف",
  //             "reference_user_id": "55488e1d-514d-4547-bc63-4eaaf7c956d0",
  //             "branch_id": 1,
  //             "status": 1,
  //             "reference_user": {
  //               "id": "55488e1d-514d-4547-bc63-4eaaf7c956d0",
  //               "name": "عبدالرحمن الدسوقي",
  //               "email": "dev.desoky@gmail.com",
  //               "phone": "+966567878888"
  //             },
  //             "is_main": 0,
  //             "manager_id": "55488e1d-514d-4547-bc63-4eaaf7c956d0",
  //             "manager": {
  //               "id": "55488e1d-514d-4547-bc63-4eaaf7c956d0",
  //               "name": "عبدالرحمن الدسوقي",
  //               "email": "dev.desoky@gmail.com",
  //               "phone": "+966567878888",
  //               "photo": null
  //             },
  //             "deputy_manager": {
  //               "id": null,
  //               "name": null,
  //               "email": null,
  //               "phone": null,
  //               "photo": null
  //             },
  //             "department_count": 0,
  //             "management_count": 0,
  //             "branch_count": 0,
  //             "user_count": 0,
  //             "children": []
  //           },
  //           {
  //             "id": 18,
  //             "parent_id": 2,
  //             "name": "الاداره الرئيسيهلا2",
  //             "type": "management",
  //             "deputy_managers": [
  //               {
  //                 "id": "61676802-8e98-473e-be65-f81cdb7bdd09",
  //                 "name": "سسس سسسس",
  //                 "email": "eng.abdelrahman.f.shaban@gmail.com",
  //                 "phone": "+966555555554"
  //               }
  //             ],
  //             "description": "smart Opp Phoneف",
  //             "reference_user_id": "55488e1d-514d-4547-bc63-4eaaf7c956d0",
  //             "branch_id": 1,
  //             "status": 1,
  //             "reference_user": {
  //               "id": "55488e1d-514d-4547-bc63-4eaaf7c956d0",
  //               "name": "عبدالرحمن الدسوقي",
  //               "email": "dev.desoky@gmail.com",
  //               "phone": "+966567878888"
  //             },
  //             "is_main": 0,
  //             "manager_id": "55488e1d-514d-4547-bc63-4eaaf7c956d0",
  //             "manager": {
  //               "id": "55488e1d-514d-4547-bc63-4eaaf7c956d0",
  //               "name": "عبدالرحمن الدسوقي",
  //               "email": "dev.desoky@gmail.com",
  //               "phone": "+966567878888",
  //               "photo": null
  //             },
  //             "deputy_manager": {
  //               "id": null,
  //               "name": null,
  //               "email": null,
  //               "phone": null,
  //               "photo": null
  //             },
  //             "department_count": 0,
  //             "management_count": 0,
  //             "branch_count": 0,
  //             "user_count": 0,
  //             "children": [
  //               {
  //                 "id": 113,
  //                 "parent_id": 18,
  //                 "name": "فرع ثانوي2",
  //                 "type": "branch",
  //                 "deputy_managers": [],
  //                 "description": null,
  //                 "reference_user_id": null,
  //                 "branch_id": null,
  //                 "status": 1,
  //                 "reference_user": null,
  //                 "is_main": 0,
  //                 "manager_id": "7c98c26a-4bc6-4941-b46d-3188f3244bc1",
  //                 "manager": {
  //                   "id": "7c98c26a-4bc6-4941-b46d-3188f3244bc1",
  //                   "name": "يحي محمد",
  //                   "email": "mmedan263@gmail.com",
  //                   "phone": "+966504950395",
  //                   "photo": null
  //                 },
  //                 "deputy_manager": {
  //                   "id": null,
  //                   "name": null,
  //                   "email": null,
  //                   "phone": null,
  //                   "photo": null
  //                 },
  //                 "department_count": 0,
  //                 "management_count": 1,
  //                 "branch_count": 0,
  //                 "user_count": 1,
  //                 "children": [
  //                   {
  //                     "id": 87,
  //                     "parent_id": 113,
  //                     "name": "الاداره 1",
  //                     "type": "management",
  //                     "deputy_managers": [
  //                       {
  //                         "id": "c08f4642-0453-455b-bdb4-85b0b0c24417",
  //                         "name": "يحي محمد",
  //                         "email": "pafiw65842@eligou.com",
  //                         "phone": "+201224855746"
  //                       }
  //                     ],
  //                     "description": "اداره الفرع الثانوي",
  //                     "reference_user_id": "cf22708a-efc9-476f-82f3-ed59bb23b4f1",
  //                     "branch_id": 3,
  //                     "status": 1,
  //                     "reference_user": {
  //                       "id": "cf22708a-efc9-476f-82f3-ed59bb23b4f1",
  //                       "name": "بيب صثي",
  //                       "email": "test123@gmail.com",
  //                       "phone": "+966551548415"
  //                     },
  //                     "is_main": 0,
  //                     "manager_id": "cf22708a-efc9-476f-82f3-ed59bb23b4f1",
  //                     "manager": {
  //                       "id": "cf22708a-efc9-476f-82f3-ed59bb23b4f1",
  //                       "name": "بيب صثي",
  //                       "email": "test123@gmail.com",
  //                       "phone": "+966551548415",
  //                       "photo": null
  //                     },
  //                     "deputy_manager": {
  //                       "id": null,
  //                       "name": null,
  //                       "email": null,
  //                       "phone": null,
  //                       "photo": null
  //                     },
  //                     "department_count": 0,
  //                     "management_count": 0,
  //                     "branch_count": 0,
  //                     "user_count": 0,
  //                     "children": []
  //                   }
  //                 ]
  //               },
  //               {
  //                 "id": 1115,
  //                 "parent_id": 18,
  //                 "name": "فرع 223",
  //                 "type": "branch",
  //                 "deputy_managers": [],
  //                 "description": null,
  //                 "reference_user_id": null,
  //                 "branch_id": null,
  //                 "status": 1,
  //                 "reference_user": null,
  //                 "is_main": 0,
  //                 "manager_id": "a29f26d1-49d5-43f9-9e6d-9c78f9ab0cd8",
  //                 "manager": {
  //                   "id": "a29f26d1-49d5-43f9-9e6d-9c78f9ab0cd8",
  //                   "name": "عبدالرحمن فتحي",
  //                   "email": "abdel-rahman.fathy@nv2030.com",
  //                   "phone": "+966548484421",
  //                   "photo": null
  //                 },
  //                 "deputy_manager": {
  //                   "id": null,
  //                   "name": null,
  //                   "email": null,
  //                   "phone": null,
  //                   "photo": null
  //                 },
  //                 "department_count": 0,
  //                 "management_count": 0,
  //                 "branch_count": 0,
  //                 "user_count": 0,
  //                 "children": []
  //               }
  //             ]
  //           },
  //         ]
  //       },
  //       {
  //         "id": 18,
  //         "parent_id": 2,
  //         "name": "الاداره الرئيسيهلا2",
  //         "type": "management",
  //         "deputy_managers": [
  //           {
  //             "id": "61676802-8e98-473e-be65-f81cdb7bdd09",
  //             "name": "سسس سسسس",
  //             "email": "eng.abdelrahman.f.shaban@gmail.com",
  //             "phone": "+966555555554"
  //           }
  //         ],
  //         "description": "smart Opp Phoneف",
  //         "reference_user_id": "55488e1d-514d-4547-bc63-4eaaf7c956d0",
  //         "branch_id": 1,
  //         "status": 1,
  //         "reference_user": {
  //           "id": "55488e1d-514d-4547-bc63-4eaaf7c956d0",
  //           "name": "عبدالرحمن الدسوقي",
  //           "email": "dev.desoky@gmail.com",
  //           "phone": "+966567878888"
  //         },
  //         "is_main": 0,
  //         "manager_id": "55488e1d-514d-4547-bc63-4eaaf7c956d0",
  //         "manager": {
  //           "id": "55488e1d-514d-4547-bc63-4eaaf7c956d0",
  //           "name": "عبدالرحمن الدسوقي",
  //           "email": "dev.desoky@gmail.com",
  //           "phone": "+966567878888",
  //           "photo": null
  //         },
  //         "deputy_manager": {
  //           "id": null,
  //           "name": null,
  //           "email": null,
  //           "phone": null,
  //           "photo": null
  //         },
  //         "department_count": 0,
  //         "management_count": 0,
  //         "branch_count": 0,
  //         "user_count": 0,
  //         "children": [
  //           {
  //             "id": 113,
  //             "parent_id": 18,
  //             "name": "فرع ثانوي2",
  //             "type": "branch",
  //             "deputy_managers": [],
  //             "description": null,
  //             "reference_user_id": null,
  //             "branch_id": null,
  //             "status": 1,
  //             "reference_user": null,
  //             "is_main": 0,
  //             "manager_id": "7c98c26a-4bc6-4941-b46d-3188f3244bc1",
  //             "manager": {
  //               "id": "7c98c26a-4bc6-4941-b46d-3188f3244bc1",
  //               "name": "يحي محمد",
  //               "email": "mmedan263@gmail.com",
  //               "phone": "+966504950395",
  //               "photo": null
  //             },
  //             "deputy_manager": {
  //               "id": null,
  //               "name": null,
  //               "email": null,
  //               "phone": null,
  //               "photo": null
  //             },
  //             "department_count": 0,
  //             "management_count": 1,
  //             "branch_count": 0,
  //             "user_count": 1,
  //             "children": [
  //               {
  //                 "id": 87,
  //                 "parent_id": 113,
  //                 "name": "الاداره 1",
  //                 "type": "management",
  //                 "deputy_managers": [
  //                   {
  //                     "id": "c08f4642-0453-455b-bdb4-85b0b0c24417",
  //                     "name": "يحي محمد",
  //                     "email": "pafiw65842@eligou.com",
  //                     "phone": "+201224855746"
  //                   }
  //                 ],
  //                 "description": "اداره الفرع الثانوي",
  //                 "reference_user_id": "cf22708a-efc9-476f-82f3-ed59bb23b4f1",
  //                 "branch_id": 3,
  //                 "status": 1,
  //                 "reference_user": {
  //                   "id": "cf22708a-efc9-476f-82f3-ed59bb23b4f1",
  //                   "name": "بيب صثي",
  //                   "email": "test123@gmail.com",
  //                   "phone": "+966551548415"
  //                 },
  //                 "is_main": 0,
  //                 "manager_id": "cf22708a-efc9-476f-82f3-ed59bb23b4f1",
  //                 "manager": {
  //                   "id": "cf22708a-efc9-476f-82f3-ed59bb23b4f1",
  //                   "name": "بيب صثي",
  //                   "email": "test123@gmail.com",
  //                   "phone": "+966551548415",
  //                   "photo": null
  //                 },
  //                 "deputy_manager": {
  //                   "id": null,
  //                   "name": null,
  //                   "email": null,
  //                   "phone": null,
  //                   "photo": null
  //                 },
  //                 "department_count": 0,
  //                 "management_count": 0,
  //                 "branch_count": 0,
  //                 "user_count": 0,
  //                 "children": []
  //               }
  //             ]
  //           },
  //           {
  //             "id": 1115,
  //             "parent_id": 18,
  //             "name": "فرع 223",
  //             "type": "branch",
  //             "deputy_managers": [],
  //             "description": null,
  //             "reference_user_id": null,
  //             "branch_id": null,
  //             "status": 1,
  //             "reference_user": null,
  //             "is_main": 0,
  //             "manager_id": "a29f26d1-49d5-43f9-9e6d-9c78f9ab0cd8",
  //             "manager": {
  //               "id": "a29f26d1-49d5-43f9-9e6d-9c78f9ab0cd8",
  //               "name": "عبدالرحمن فتحي",
  //               "email": "abdel-rahman.fathy@nv2030.com",
  //               "phone": "+966548484421",
  //               "photo": null
  //             },
  //             "deputy_manager": {
  //               "id": null,
  //               "name": null,
  //               "email": null,
  //               "phone": null,
  //               "photo": null
  //             },
  //             "department_count": 0,
  //             "management_count": 0,
  //             "branch_count": 0,
  //             "user_count": 0,
  //             "children": []
  //           }
  //         ]
  //       },
  //       {
  //         "id": 13,
  //         "parent_id": 1,
  //         "name": "فرع ثانوي2",
  //         "type": "branch",
  //         "deputy_managers": [],
  //         "description": null,
  //         "reference_user_id": null,
  //         "branch_id": null,
  //         "status": 1,
  //         "reference_user": null,
  //         "is_main": 0,
  //         "manager_id": "7c98c26a-4bc6-4941-b46d-3188f3244bc1",
  //         "manager": {
  //           "id": "7c98c26a-4bc6-4941-b46d-3188f3244bc1",
  //           "name": "يحي محمد",
  //           "email": "mmedan263@gmail.com",
  //           "phone": "+966504950395",
  //           "photo": null
  //         },
  //         "deputy_manager": {
  //           "id": null,
  //           "name": null,
  //           "email": null,
  //           "phone": null,
  //           "photo": null
  //         },
  //         "department_count": 0,
  //         "management_count": 1,
  //         "branch_count": 0,
  //         "user_count": 1,
  //         "children": [
  //           {
  //             "id": 7,
  //             "parent_id": 4,
  //             "name": "الاداره 1",
  //             "type": "management",
  //             "deputy_managers": [
  //               {
  //                 "id": "c08f4642-0453-455b-bdb4-85b0b0c24417",
  //                 "name": "يحي محمد",
  //                 "email": "pafiw65842@eligou.com",
  //                 "phone": "+201224855746"
  //               }
  //             ],
  //             "description": "اداره الفرع الثانوي",
  //             "reference_user_id": "cf22708a-efc9-476f-82f3-ed59bb23b4f1",
  //             "branch_id": 3,
  //             "status": 1,
  //             "reference_user": {
  //               "id": "cf22708a-efc9-476f-82f3-ed59bb23b4f1",
  //               "name": "بيب صثي",
  //               "email": "test123@gmail.com",
  //               "phone": "+966551548415"
  //             },
  //             "is_main": 0,
  //             "manager_id": "cf22708a-efc9-476f-82f3-ed59bb23b4f1",
  //             "manager": {
  //               "id": "cf22708a-efc9-476f-82f3-ed59bb23b4f1",
  //               "name": "بيب صثي",
  //               "email": "test123@gmail.com",
  //               "phone": "+966551548415",
  //               "photo": null
  //             },
  //             "deputy_manager": {
  //               "id": null,
  //               "name": null,
  //               "email": null,
  //               "phone": null,
  //               "photo": null
  //             },
  //             "department_count": 0,
  //             "management_count": 0,
  //             "branch_count": 0,
  //             "user_count": 0,
  //             "children": []
  //           }
  //         ]
  //       },
  //       {
  //         "id": 15,
  //         "parent_id": 1,
  //         "name": "فرع 223",
  //         "type": "branch",
  //         "deputy_managers": [],
  //         "description": null,
  //         "reference_user_id": null,
  //         "branch_id": null,
  //         "status": 1,
  //         "reference_user": null,
  //         "is_main": 0,
  //         "manager_id": "a29f26d1-49d5-43f9-9e6d-9c78f9ab0cd8",
  //         "manager": {
  //           "id": "a29f26d1-49d5-43f9-9e6d-9c78f9ab0cd8",
  //           "name": "عبدالرحمن فتحي",
  //           "email": "abdel-rahman.fathy@nv2030.com",
  //           "phone": "+966548484421",
  //           "photo": null
  //         },
  //         "deputy_manager": {
  //           "id": null,
  //           "name": null,
  //           "email": null,
  //           "phone": null,
  //           "photo": null
  //         },
  //         "department_count": 0,
  //         "management_count": 0,
  //         "branch_count": 0,
  //         "user_count": 0,
  //         "children": []
  //       }
  //     ]
  //   }
  // ]

  return res.data.payload;
}
