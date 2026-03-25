import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/contexts/theme-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getErrorMessage } from '@/utils/error-handler';
import { Archive, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err: any) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] p-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[#d1e8dd]/30 blur-[120px]"></div>
                <div className="absolute top-[60%] -right-[5%] w-[35%] h-[35%] rounded-full bg-[#cae6fe]/20 blur-[100px]"></div>
                <div className="absolute bottom-[5%] left-[15%] w-[20%] h-[20%] rounded-full bg-[#dcedff]/20 blur-[80px]"></div>
            </div>

            {/* Theme toggle */}
            <button
                onClick={toggleTheme}
                className="absolute top-6 right-6 p-2 rounded-lg hover:bg-slate-200 transition-colors text-[#5a6062]"
            >
                {theme === 'dark' ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                )}
            </button>

            <div className="relative z-10 w-full max-w-md">
                {/* Brand Identity Header */}
                <div className="mb-10 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#4f645b] rounded-xl flex items-center justify-center mb-6 shadow-xl shadow-[#4f645b]/10">
                        <Archive className="text-[#e7fef3] text-3xl" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-[#2d3335] mb-2">The Curator</h1>
                    <p className="text-[#5a6062] font-medium tracking-wide">Inventario CIE API</p>
                </div>

                {/* Login Card */}
                <div className="w-full p-8 md:p-10 rounded-2xl shadow-2xl shadow-[#2d3335]/5 flex flex-col gap-8 bg-white/70 backdrop-blur-xl border border-white/30">
                    <header className="space-y-1">
                        <h2 className="text-xl font-bold text-[#2d3335]">Bienvenido</h2>
                        <p className="text-[#5a6062] text-sm">Ingresa tus credenciales para continuar</p>
                    </header>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* Email Field */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-[#5a6062] px-1" htmlFor="email">
                                Correo Electrónico
                            </label>
                            <div className="relative flex items-center">
                                <svg className="absolute left-4 text-[#5a6062] text-xl" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="nombre@ejemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full h-14 pl-12 pr-4 bg-[#ebeef0] border-0 rounded-xl text-[#2d3335] placeholder:text-[#adb3b5] focus:ring-2 focus:ring-[#4f645b]/40 transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-xs font-bold uppercase tracking-widest text-[#5a6062]" htmlFor="password">
                                    Contraseña
                                </label>
                                <a className="text-xs font-bold text-[#4f645b] hover:text-[#43574f] transition-colors" href="#">
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>
                            <div className="relative flex items-center">
                                <svg className="absolute left-4 text-[#5a6062] text-xl" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full h-14 pl-12 pr-12 bg-[#ebeef0] border-0 rounded-xl text-[#2d3335] placeholder:text-[#adb3b5] focus:ring-2 focus:ring-[#4f645b]/40 transition-all duration-300"
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 text-[#5a6062] hover:text-[#2d3335] transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="rounded-lg bg-[#fa746f]/10 border border-[#fa746f]/20 px-4 py-3 text-sm text-[#a83836]">
                                {error}
                            </div>
                        )}

                        {/* Action Button */}
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full h-14 bg-gradient-to-br from-[#4f645b] to-[#43574f] text-[#e7fef3] font-bold rounded-full shadow-lg shadow-[#4f645b]/20 hover:shadow-xl hover:shadow-[#4f645b]/30 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#e7fef3] border-t-transparent" />
                            ) : (
                                <>
                                    <span>Iniciar Sesión</span>
                                    <svg className="text-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Footer Links */}
                    <footer className="text-center pt-2">
                        <p className="text-sm text-[#5a6062]">
                            ¿No tienes acceso? 
                            <Link className="font-bold text-[#4f645b] hover:text-[#43574f] underline decoration-[#4f645b]/30 underline-offset-4" to="/registro">
                                Solicitar registro
                            </Link>
                        </p>
                    </footer>
                </div>

                {/* System Status Info */}
                <div className="mt-12 flex items-center gap-6 opacity-60 justify-center">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#4f645b] animate-pulse"></div>
                        <span className="text-xs font-medium tracking-tight">API Operacional</span>
                    </div>
                    <div className="w-px h-3 bg-[#767c7e]"></div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium tracking-tight">v2.4.1</span>
                    </div>
                </div>
            </div>

            {/* Hidden visual context for UI completeness */}
            <div className="fixed bottom-0 left-0 p-8 hidden lg:block pointer-events-none">
                <p className="text-[10rem] font-black text-[#c3dacf]/10 leading-none select-none">ARCHIVE</p>
            </div>
        </div>
    );
}
