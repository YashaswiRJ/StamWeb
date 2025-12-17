import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();
    const navType = useNavigationType();

    useEffect(() => {
        // "POP" means the user clicked the back/forward button.
        // In this case, we want the browser's native scroll restoration to kick in.
        if (navType !== "POP") {
            window.scrollTo(0, 0);
        }
    }, [pathname, navType]);

    return null;
}
