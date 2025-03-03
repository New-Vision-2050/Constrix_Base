export class Company {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public phone: string,
    public countryId: number,
    public companyTypeId: string,
    public companyFieldId: string,
    public generalManagerId: string,
    public registrationTypeId: string,
    public registrationNo: string | null,
    public registrationType: number,
    public classificationNo: string | null
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name) throw new Error("Company name is required");
    if (!this.email) throw new Error("Company email is required");
    if (!this.phone) throw new Error("Company phone is required");
    if (!this.countryId) throw new Error("Country ID is required");
    if (!this.companyTypeId) throw new Error("Company type ID is required");
    if (!this.companyFieldId) throw new Error("Company field ID is required");
    if (!this.generalManagerId)
      throw new Error("General manager ID is required");
    if (!this.registrationTypeId)
      throw new Error("Registration type ID is required");
    if (this.registrationType !== 1 && this.registrationType !== 2) {
      throw new Error("Invalid registration type");
    }
  }
}
