import { _m, MessagesGroup } from "../../types";

export const attendanceDepartureMessages = new MessagesGroup({
  status: new MessagesGroup({
    present: _m("Present", "حاضر"),
    absent: _m("Absent", "غائب"),
    late: _m("Late", "متأخر"),
    holiday: _m("On Leave", "في إجازة"),
    unspecified: _m("Unspecified", "غير محدد")
  })
});
