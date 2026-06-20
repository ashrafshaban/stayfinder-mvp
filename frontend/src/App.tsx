import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { SearchPage } from "./pages/SearchPage";
import { RecommendationsPage } from "./pages/RecommendationsPage";
import { HotelDetailsPage } from "./pages/HotelDetailsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/hotels/:id" element={<HotelDetailsPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
