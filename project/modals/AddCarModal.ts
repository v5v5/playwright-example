import { ModalBase } from "./ModalBase";

export class AddCarModal extends ModalBase {
  public async createCar(brand: string, model: string, text: string) {
    await this.pickCarBrand(brand);
    await this.pickCarModel(model);
    await this.addMileage(text);
    return await this.clickAdd();
  }

  private async pickCarBrand(brand: string) {
    await this.clickDropdownElement("Brand", brand);
  }

  private async pickCarModel(model: string) {
    await this.clickDropdownElement("Model", model);
  }

  private async addMileage(text: string) {
    await this.typeIntoInputField("Mileage", text);
  }

  private async clickAdd() {
    let response = await Promise.all([
      this.clickModalButton("Add"),
      this.getCreatedCarId(),
    ]);
    return response[1];
  }

  private async getCreatedCarId() {
    const response = await Promise.all([
      this.page.waitForResponse(
        (response) =>
          response.url().includes("/api/cars") && response.status() === 201
      ),
    ]);

    const responseObject = await response[0].json();
    if (responseObject) {
      return responseObject["data"]["id"];
    }
  }
}
