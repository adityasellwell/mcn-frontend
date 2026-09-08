import { useEffect } from "react";

const usePageTitle = (title) => {
  useEffect(() => {
    if (title) {
      if (title.includes("Muslim Community Network") || title.includes("MCN")) {
        document.title = title.replace("MCN", "Muslim Community Network");
      } else {
        document.title = `${title} — Muslim Community Network`;
      }
    } else {
      document.title = "Muslim Community Network (MCN)";
    }
  }, [title]);
};

export default usePageTitle;