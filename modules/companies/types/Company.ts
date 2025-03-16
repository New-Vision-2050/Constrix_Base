export class Company {
  constructor(
    public name: string,
    public email: string,
    public domainName: string,
    public countryId: string,
    public supportNvEmployeeId: string,
    public companyFieldId: string,
    public readonly id?: string
  ) {}
}
