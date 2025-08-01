import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Presensi from "./pages/Presensi";
import Kelas from "./pages/Kelas";
import DataSiswa from "./pages/DataSiswa";
import DataPresensi from "./pages/DataPresensi";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/presensi" element={<Presensi />} />
          <Route path="/kelas" element={<Kelas />} />
          <Route path="/data-siswa" element={<DataSiswa />} />
          <Route path="/data-presensi" element={<DataPresensi />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
