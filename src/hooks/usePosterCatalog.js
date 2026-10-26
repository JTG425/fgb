import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import seed from "../data/poster-catalog.json";
import { mergeCatalog } from "../lib/posters";
import { loadPosterOverrides } from "../services/posterService";

export default function usePosterCatalog() {
  const [overrides, setOverrides] = useState([]);
  const [status, setStatus] = useState("loading");
  const generation = useRef(0);
  const reload = useCallback(async () => {
    const current = ++generation.current;
    setStatus("loading");
    try {
      const data = await loadPosterOverrides();
      if (current !== generation.current) return;
      setOverrides(data);
      setStatus("ready");
    } catch {
      if (current === generation.current) setStatus("error");
    }
  }, []);
  useEffect(() => {
    reload();
    return () => { generation.current += 1; };
  }, [reload]);
  const posters = useMemo(() => mergeCatalog(seed, overrides), [overrides]);
  return { posters, status, reload };
}
