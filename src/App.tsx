import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/contexts/theme-context';
import { ToastProvider } from '@/components/ui/toast';
import { Layout } from '@/components/layout/layout';
import { ProtectedRoute } from '@/components/layout/protected-route';

// Pages
import Login from '@/pages/login';
import Registro from '@/pages/registro';
import Dashboard from '@/pages/dashboard';
import Equipos from '@/pages/equipos';
import Electronica from '@/pages/electronica';
import Robotica from '@/pages/robotica';
import Materiales from '@/pages/materiales';
import Prestamos from '@/pages/prestamos';
import Prestatarios from '@/pages/prestatarios';
import NuevoPrestamo from '@/pages/nuevo-prestamo';
import Danados from '@/pages/danados';
import Movimientos from '@/pages/movimientos';
import Reportes from '@/pages/reportes';
import Configuracion from '@/pages/configuracion';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 30,
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
                                    <Route path="/registro" element={<Registro />} />

                                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/equipos" element={<Equipos />} />
                                    <Route path="/electronica" element={<Electronica />} />
                                    <Route path="/robotica" element={<Robotica />} />
                                    <Route path="/materiales" element={<Materiales />} />
                                    <Route path="/prestamos" element={<Prestamos />} />
                                    <Route path="/prestamos/nuevo" element={<NuevoPrestamo />} />
                                    <Route path="/prestatarios" element={<Prestatarios />} />
                                    <Route path="/movimientos" element={<Movimientos />} />
                                    <Route path="/danados" element={<Danados />} />
                                    <Route path="/reportes" element={<Reportes />} />
                                    <Route path="/configuracion" element={<Configuracion />} />
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
