@extends('layouts.app')

@section('content')
<link rel="stylesheet" href="{{ asset('/turizteca/css/turizteca-login.css') }}">
<!-- Tailwind -->
<script src="https://cdn.tailwindcss.com"></script>


<div class="min-h-screen flex items-center justify-center px-4">
    <div class="w-full max-w-md">

        <div class="text-center mb-6">
            <div class="mx-auto h-40 w-40 rounded-md bg-white flex items-center justify-center text-white font-bold">
                <img src="{{ asset('/turizteca/img/Turizteca-Logo.png') }}" alt="Turizteca Logo" class="h-[90%] w-full object-contain" loading="lazy" decoding="async"/>
            </div>
                
            <h1 class="mt-3 text-2xl font-semibold">Turizteca</h1>
            <p class="mt-1 text-sm text-gray-400">Accede al panel de administración</p>
        </div>

        <div class="bg-gray-900 text-white p-6 rounded-xl shadow-lg">

            <form method="POST" action="{{ route('login') }}" class="space-y-4">
                @csrf

                <!-- EMAIL -->
                <div>
                    <label for="email" class="text-sm">Correo electrónico</label>

                    <input id="email"
                        type="email"
                        name="email"
                        value="{{ old('email') }}"
                        required
                        autofocus
                        class="w-full mt-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 @error('email') border-red-500 @enderror"
                        placeholder="tu@correo.com">

                    @error('email')
                        <span class="text-red-400 text-sm">
                            {{ $message }}
                        </span>
                    @enderror
                </div>

                <!-- PASSWORD -->
                <div>
                    <label for="password" class="text-sm">Contraseña</label>

                    <div class="relative mt-1">
                        <input id="password"
                            type="password"
                            name="password"
                            required
                            autocomplete="current-password"
                            class="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 @error('password') border-red-500 @enderror"
                            placeholder="••••••••">

                        <button type="button"
                            id="togglePwd"
                            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                            
                        </button>
                    </div>

                    @error('password')
                        <span class="text-red-400 text-sm">
                            {{ $message }}
                        </span>
                    @enderror
                </div>

                <!-- REMEMBER -->
                <div class="flex items-center justify-between">
                    <label class="flex items-center gap-2 text-sm">
                        <input type="checkbox" name="remember" id="remember">
                        Recordarme
                    </label>

                    @if (Route::has('password.request'))
                        <a class="text-sm text-gray-400 hover:underline"
                            href="{{ route('password.request') }}">
                            ¿Olvidaste tu contraseña?
                        </a>
                    @endif
                </div>

                <!-- BUTTON -->
                <button type="submit"
                    class="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold">
                    Iniciar sesión
                </button>

            </form>
        </div>

        <p class="mt-6 text-center text-xs text-gray-500">
            © {{ date('Y') }} Turizteca
        </p>

    </div>
</div>

<script>
const toggle = document.getElementById('togglePwd');
const pwd = document.getElementById('password');

toggle.addEventListener('click', ()=>{
    pwd.type = pwd.type === 'password' ? 'text' : 'password';
});
</script>

@endsection