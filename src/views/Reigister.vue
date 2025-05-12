<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8">
      <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h1>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
              type="email"
              id="email"
              v-model="registerForm.email"
              required
              autocomplete="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              :class="{ 'border-red-500': errors.email }"
              @input="clearError('email')"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
              type="password"
              id="password"
              v-model="registerForm.password"
              required
              autocomplete="new-password"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              :class="{ 'border-red-500': errors.password }"
              @input="clearError('password')"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
              type="password"
              id="confirmPassword"
              v-model="registerForm.confirmPassword"
              required
              autocomplete="new-password"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              :class="{ 'border-red-500': errors.confirmPassword }"
              @input="clearError('confirmPassword')"
          />
          <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
        </div>

        <div>
          <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">Full Name (Optional)</label>
          <input
              type="text"
              id="fullName"
              v-model="registerForm.fullName"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition flex justify-center items-center"
            :disabled="isLoading"
        >
          <span v-if="!isLoading">Create Account</span>
          <span v-else class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating account...
          </span>
        </button>

        <!-- Social login divider -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or sign up with</span>
          </div>
        </div>

        <!-- Social login buttons -->
        <div class="grid grid-cols-2 gap-3">
          <button
              type="button"
              @click="loginWithProvider('google')"
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :disabled="isSocialLoading"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#EA4335"/>
            </svg>
            <span class="ml-2">Google</span>
          </button>

          <button
              type="button"
              @click="loginWithProvider('github')"
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :disabled="isSocialLoading"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"/>
            </svg>
            <span class="ml-2">GitHub</span>
          </button>
        </div>

        <div v-if="authError" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ authError }}
        </div>
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Already have an account?
          <router-link to="/login" class="text-blue-600 hover:text-blue-800 hover:underline">
            Sign in
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { AuthService } from '@/services/AuthService';

const router = useRouter();

interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const registerForm = reactive<RegisterForm>({
  email: '',
  password: '',
  confirmPassword: '',
  fullName: ''
});

const errors = reactive<FormErrors>({});
const authError = ref<string>('');
const isLoading = ref<boolean>(false);
const isSocialLoading = ref<boolean>(false);

const validateForm = (): boolean => {
  let isValid = true;
  errors.email = '';
  errors.password = '';
  errors.confirmPassword = '';

  if (!registerForm.email) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
    errors.email = 'Email is invalid';
    isValid = false;
  }

  if (!registerForm.password) {
    errors.password = 'Password is required';
    isValid = false;
  } else if (registerForm.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
    isValid = false;
  }

  if (registerForm.password !== registerForm.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
    isValid = false;
  }

  return isValid;
};

const clearError = (field: keyof FormErrors) => {
  errors[field] = '';
  authError.value = '';
};

const handleRegister = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  authError.value = '';

  try {
    const response = await AuthService.register(
        registerForm.email,
        registerForm.password,
        { full_name: registerForm.fullName }
    );

    if (response.error) {
      authError.value = response.error.message || 'Registration failed. Please try again.';
      return;
    }

    // Successful registration
    console.log('Registration successful:', response);

    // Redirect to login or directly log them in
    router.push('/login?registered=true');

  } catch (error) {
    console.error('Registration error:', error);
    authError.value = 'An unexpected error occurred. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const loginWithProvider = async (provider: 'google' | 'github') => {
  isSocialLoading.value = true;
  authError.value = '';

  try {
    const response = await AuthService.loginWithSocial(provider);

    if (response.error) {
      authError.value = response.error.message || `${provider} login failed. Please try again.`;
      return;
    }

    // Successful social login
    console.log(`${provider} login successful:`, response);
    router.push('/dashboard');

  } catch (error) {
    console.error(`${provider} login error:`, error);
    authError.value = `An error occurred during ${provider} login. Please try again.`;
  } finally {
    isSocialLoading.value = false;
  }
};
</script>