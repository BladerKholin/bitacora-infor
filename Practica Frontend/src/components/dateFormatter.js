import dayjs from "dayjs";
import  utc  from "dayjs/plugin/utc";
import  timezone  from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

function dateFormatter(date) {
    console.log(date);
  return dayjs.utc(date).local().format("DD/MM/YYYY HH:mm");
}

export { dateFormatter };