import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/contexts/theme-context';
import { ToastProvider } from '@/components/ui/toast';
import { Layout } from '@/components/layout/layout';
import { ProtectedRoute } from '@/components/layout/protected-route';

// Pages
import Login from '@/pages/login';
import Dashboard from '@/pages/dashboard';
import Equipos from '@/pages/equipos';
import Electronica from '@/pages/electronica';
import Robots from '@/pages/robots';
import Materiales from '@/pages/materiales';
import Prestatarios from '@/pages/prestatarios';
import Prestamos from '@/pages/prestamos';
import Movimientos from '@/pages/movimientos';
import Exportar from '@/pages/exportar';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 30, // 30 seconds — short enough to refetch after invalidation
            refetchOnMount: true,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <AuthProvider>
                    <ToastProvider>
                        <Router>
                            <Routes>
                                <Route path="/login" element={<Login />} />

                                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/equipos" element={<Equipos />} />
                                    <Route path="/electronica" element={<Electronica />} />
                                    <Route path="/robots" element={<Robots />} />
                                    <Route path="/materiales" element={<Materiales />} />
                                    <Route path="/prestatarios" element={<Prestatarios />} />
                                    <Route path="/prestamos" element={<Prestamos />} />
                                    <Route path="/movimientos" element={<Movimientos />} />
                                    <Route path="/exportar" element={<Exportar />} />
                                    {/* Fallback */}
                                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                                </Route>
                            </Routes>
                        </Router>
                    </ToastProvider>
                </AuthProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
