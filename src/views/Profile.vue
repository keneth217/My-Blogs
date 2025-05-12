<template>
  <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <!-- Profile Header -->
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="relative">
                <img
                    :src="user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}&background=random`"
                    alt="Profile picture"
                    class="w-16 h-16 rounded-full border-2 border-white"
                >
                <button
                    @click="editAvatar = true"
                    class="absolute -bottom-1 -right-1 bg-blue-100 text-blue-600 p-1 rounded-full hover:bg-blue-200 transition"
                >
                  <PencilIcon class="h-4 w-4"/>
                </button>
              </div>
              <div>
                <h1 class="text-2xl font-bold">{{ user?.user_metadata?.full_name || user?.email }}</h1>
                <p class="text-blue-100">{{ user?.email }}</p>
              </div>
            </div>
            <button
                @click="handleLogout"
                class="flex items-center space-x-1 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition"
            >
              <ArrowLeftOnRectangleIcon class="h-5 w-5"/>
              <span>Logout</span>
            </button>
          </div>
        </div>

        <!-- Profile Content -->
        <div class="p-6">
          <!-- Edit Avatar Modal -->
          <div v-if="editAvatar" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 class="text-xl font-bold mb-4">Update Profile Picture</h2>
              <input type="file" @change="handleAvatarUpload" class="mb-4" accept="image/*">
              <div class="flex justify-end space-x-3">
                <button @click="editAvatar = false" class="px-4 py-2 border rounded">Cancel</button>
                <button @click="saveAvatar" class="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
              </div>
            </div>
          </div>

          <!-- User Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 class="text-lg font-semibold mb-4">Personal Information</h2>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-gray-500">Full Name</label>
                  <p v-if="!editing" class="font-medium">{{ user?.user_metadata?.full_name || 'Not set' }}</p>
                  <input
                      v-else
                      v-model="editForm.fullName"
                      class="w-full px-3 py-2 border rounded"
                  >
                </div>
                <div>
                  <label class="block text-sm text-gray-500">Email</label>
                  <p class="font-medium">{{ user?.email }}</p>
                </div>
                <div>
                  <label class="block text-sm text-gray-500">Account Created</label>
                  <p class="font-medium">{{ formatDate(user?.created_at) }}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 class="text-lg font-semibold mb-4">Security</h2>
              <div class="space-y-3">
                <button
                    @click="showPasswordModal = true"
                    class="w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded transition"
                >
                  Change Password
                </button>
                <button
                    v-if="user?.app_metadata?.provider === 'email'"
                    @click="requestEmailVerification"
                    class="w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded transition"
                >
                  {{ user?.email_confirmed_at ? 'Email Verified' : 'Verify Email' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 border-t pt-4">
            <button
                v-if="!editing"
                @click="startEditing"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
            <template v-else>
              <button
                  @click="cancelEditing"
                  class="px-4 py-2 border rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                  @click="saveProfile"
                  class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  :disabled="saving"
              >
                <span v-if="!saving">Save Changes</span>
                <span v-else class="flex items-center">
                  <Spinner class="h-4 w-4 mr-2"/>
                  Saving...
                </span>
              </button>
            </template>
          </div>
        </div>
      </div>

      <!-- Change Password Modal -->
      <div v-if="showPasswordModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
          <h2 class="text-xl font-bold mb-4">Change Password</h2>
          <div class="space-y-3">
            <div>
              <label class="block text-sm text-gray-500 mb-1">Current Password</label>
              <input
                  type="password"
                  v-model="passwordForm.currentPassword"
                  class="w-full px-3 py-2 border rounded"
              >
            </div>
            <div>
              <label class="block text-sm text-gray-500 mb-1">New Password</label>
              <input
                  type="password"
                  v-model="passwordForm.newPassword"
                  class="w-full px-3 py-2 border rounded"
              >
            </div>
            <div>
              <label class="block text-sm text-gray-500 mb-1">Confirm New Password</label>
              <input
                  type="password"
                  v-model="passwordForm.confirmPassword"
                  class="w-full px-3 py-2 border rounded"
              >
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button @click="showPasswordModal = false" class="px-4 py-2 border rounded">Cancel</button>
            <button
                @click="changePassword"
                class="px-4 py-2 bg-blue-600 text-white rounded"
                :disabled="changingPassword"
            >
              <span v-if="!changingPassword">Update Password</span>
              <span v-else class="flex items-center">
                <Spinner class="h-4 w-4 mr-2"/>
                Updating...
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {AuthService} from '@/services/AuthService';
import {ArrowLeftOnRectangleIcon, PencilIcon} from '@heroicons/vue/24/outline';
import Spinner from "@/views/spinner.vue";


const router = useRouter();

// User data
const user = ref<any>(null);
const loading = ref(true);

// Profile editing
const editing = ref(false);
const saving = ref(false);
const editForm = ref({
  fullName: '',
});
const editAvatar = ref(false);
const avatarFile = ref<File | null>(null);

// Password change
const showPasswordModal = ref(false);
const changingPassword = ref(false);
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const fetchUser = async () => {
  try {
    // First check if we have a valid session
    const {session: currentSession, error: sessionError} = await AuthService.getSession();

    if (sessionError || !currentSession) {
      console.error('No active session:', sessionError);
      router.push('/login');
      return;
    }

    // Then fetch the user details
    const {user: currentUser, error: userError} = await AuthService.getUser();
    console.log(currentUser)
    if (userError || !currentUser) {
      console.error('Failed to fetch user:', userError);
      router.push('/login');
      return;
    }

    user.value = currentUser;
    editForm.value.fullName = currentUser.user_metadata?.full_name || '';
    console.log('User loaded:', currentUser);
  } catch (error) {
    console.error('Error in fetchUser:', error);
    router.push('/login');
  } finally {
    loading.value = false;
  }
};

// Handle logout
const handleLogout = async () => {
  try {
    await AuthService.logout();
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Profile editing
const startEditing = () => {
  editing.value = true;
};

const cancelEditing = () => {
  editing.value = false;
  editForm.value.fullName = user.value?.user_metadata?.full_name || '';
};

const saveProfile = async () => {
  saving.value = true;
  try {
    const {data, error} = await AuthService.updateUser({
      data: {
        full_name: editForm.value.fullName
      }
    });

    if (error) throw error;

    user.value = data?.user || null;
    editing.value = false;
  } catch (error) {
    console.error('Error updating profile:', error);
  } finally {
    saving.value = false;
  }
};

// Avatar handling
const handleAvatarUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    avatarFile.value = target.files[0];
  }
};

const saveAvatar = async () => {
  if (!avatarFile.value) return;

  try {
    // In a real app, you would upload to storage first
    // Then update the user's metadata with the new avatar URL
    editAvatar.value = false;
  } catch (error) {
    console.error('Error updating avatar:', error);
  }
};

// Password change
const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert("Passwords don't match");
    return;
  }

  changingPassword.value = true;
  try {
    const {error} = await AuthService.updateUser({
      password: passwordForm.value.newPassword
    });

    if (error) throw error;

    showPasswordModal.value = false;
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    alert('Password updated successfully');
  } catch (error) {
    console.error('Error changing password:', error);
    alert('Failed to change password');
  } finally {
    changingPassword.value = false;
  }
};

// Email verification
const requestEmailVerification = async () => {
  if (user.value?.email_confirmed_at) return;

  try {
    await AuthService.resendVerificationEmail();
    alert('Verification email sent!');
  } catch (error) {
    console.error('Error sending verification email:', error);
    alert('Failed to send verification email');
  }
};

// Helper function
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
};

// Initialize
onMounted(() => {
  fetchUser();
});
</script>