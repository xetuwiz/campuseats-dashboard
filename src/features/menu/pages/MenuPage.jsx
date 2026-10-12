import { useState } from "react";
import MenuList from "../components/MenuList";
import { useDebounce } from "../hooks/useDebounce";
import { useFetch } from "../hooks/useFetch";
import { apiUrl, HAS_API_BASE } from "../../../config/api";

// Use the real backend when VITE_API_URL is configured, otherwise fall back to
// the bundled static fixture so the app still renders with no backend running.
const MENU_ENDPOINT = HAS_API_BASE ? apiUrl("/api/menu") : "/menu.json";

function MenuPage() {
  const { data: dishes, isLoading, error } = useFetch(MENU_ENDPOINT);
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 400);

  if (isLoading) return <p>Loading menu…</p>;
  if (error) return <p>Could not load menu: {error}</p>;

  const filtered = dishes.filter((d) =>
    d.name.toLowerCase().includes(debounced.toLowerCase())
  );

  return (
    <div>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Search dishes..." 
      />
      <MenuList dishes={filtered} />
    </div>
  );
}
export default MenuPage;