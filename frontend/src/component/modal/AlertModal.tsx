import { useRecoilState} from "recoil";
import { alertstate } from "../../store/notes";
import { useEffect, useState } from "react";
function AlertModal() {
  const [alertstatevalue, setAlertstatevalue] = useRecoilState(alertstate);
  const [timeoutid, setTimeoutid] = useState<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if(timeoutid){
      clearTimeout(timeoutid)
    }
    if (alertstatevalue.isalert) {
      const timeout = setTimeout(() => {
        setAlertstatevalue({
          isalert: false,
          alertname: 'none',
          alertcolor: "none",
        });
      }, 2500);
      setTimeoutid(timeout)
    }

  }, [alertstatevalue]);
  return (
    !alertstatevalue.isalert || (
      <div
        className={`border-white fixed top-4 right-4 text-white px-4 py-2 rounded-md shadow-lg ${alertstatevalue.alertcolor}`}
      >
        <p className="font-semibold">{alertstatevalue.alertname}</p>
      </div>
    )
  );
}

export default AlertModal;
