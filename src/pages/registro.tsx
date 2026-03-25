import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertTriangle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { register } from '@/services/auth';
import { getErrorMessage } from '@/utils/error-handler';

export default function RegistroPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        nombre: '',
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await register(form);
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err: any) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8F3EE] via-[#d1e8dd] to-[#b6dcc7] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#2d3335] dark:text-white mb-2">¡Registro Exitoso!</h2>
                    <p className="text-[#5a6062] dark:text-slate-400 mb-4">
                        Tu cuenta ha sido creada. Serás redirigido al login para iniciar sesión.
                    </p>
                    <div className="animate-pulse text-sm text-green-600 dark:text-green-400">
                        Redireccionando...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8F3EE] via-[#d1e8dd] to-[#b6dcc7] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-[#4f645b]/10 dark:shadow-black/30 p-8 max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#4f645b] text-white mb-4 shadow-lg shadow-[#4f645b]/20">
                        <Save className="h-8 w-8" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#2d3335] dark:text-white tracking-tight">
                        Crear Cuenta
                    </h1>
                    <p className="text-[#5a6062] dark:text-slate-400 mt-2">
                        Ingresa tus datos para registrarte en el sistema
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 shrink-0" />
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-[#2d3335] dark:text-slate-200 mb-2">
                            Nombre Completo
                        </label>
                        <Input
                            type="text"
                            placeholder="Ej: Juan Pérez"
                            value={form.nombre}
                            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                            required
                            className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#2d3335] dark:text-slate-200 mb-2">
                            Correo Electrónico
                        </label>
                        <Input
                            type="email"
                            placeholder="correo@cie.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                            className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#2d3335] dark:text-slate-200 mb-2">
                            Contraseña
                        </label>
                        <div className="relative">
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Mínimo 6 caracteres"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                                minLength={6}
                                className="pr-12 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5a6062] dark:text-slate-400 hover:text-[#4f645b] dark:hover:text-emerald-400"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground dark:text-slate-500 mt-1">
                            Mínimo 6 caracteres
                        </p>
                    </div>

                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                        <div className="flex items-start gap-3">
                            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-800 rounded-lg shrink-0">
                                <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                                    Tu cuenta será creada como <strong>Viewer</strong>
                                </p>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                                    Un administrador deberá approve tu acceso para obtener más permisos.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 mt-4"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Registrando...
                            </span>
                        ) : (
                            <>
                                <Save className="h-5 w-5 mr-2" />
                                Crear Cuenta
                            </>
                        )}
                    </Button>
                </form>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700">
                    <div className="text-center">
                        <p className="text-sm text-[#5a6062] dark:text-slate-400">
                            ¿Ya tienes cuenta?{' '}
                            <Link
                                to="/login"
                                className="font-bold text-[#4f645b] dark:text-emerald-400 hover:text-[#43574f] dark:hover:text-emerald-300 underline decoration-[#4f645b]/30 underline-offset-4"
                            >
                                Iniciar Sesión
                            </Link>
                        </p>
                    </div>
                    <div className="mt-4 flex justify-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-sm text-[#5a6062] dark:text-slate-400 hover:text-[#4f645b] dark:hover:text-emerald-400"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver al login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}