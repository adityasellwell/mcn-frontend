import { useEffect } from "react";

const usePageTitle = (title) => {
  useEffect(() => {
    if (title) {
      if (title.includes("MCN") && !title.includes("MCN Mumbai")) {
        document.title = title.replace("MCN", "MCN Mumbai");
      } else if (!title.includes("MCN Mumbai")) {
        document.title = `${title} - MCN Mumbai`;
      } else {
        document.title = title;
      }
    } else {
      document.title = "MCN Mumbai";
    }
  }, [title]);
};

export default usePageTitle;