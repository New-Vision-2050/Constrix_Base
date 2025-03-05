export class Company {
  constructor(
    public name: string,
    public email: string,
    public phone: string,
    public countryId: number,
    public companyTypeId: string,
    public companyFieldId: string,
    public generalManagerId: string,
    public registrationTypeId: string,
    public registrationNo: string | null,
    public classificationNo: string | null,
    public readonly id?: string
  ) {}
}
