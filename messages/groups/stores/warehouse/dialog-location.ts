import { _m, MessagesGroup } from "@/messages/types";

export const warehouseDialogLocationMessages = new MessagesGroup({
  country: _m("Country", "الدولة"),
  city: _m("City", "المدينة"),
  district: _m("District", "الحي"),
  longitude: _m("Longitude", "خط الطول"),
  latitude: _m("Latitude", "خط العرض"),
});
